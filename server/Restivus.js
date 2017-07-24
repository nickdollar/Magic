// Global API configuration
var API = new Restivus({
    useDefaultAuth: true,
    auth: {
        token: "services.resume.loginTokens.hashedToken",
        user: function(){
            var token = Accounts._hashLoginToken(this.request.headers['x-auth-token']);
            // switch (this.request.headers['vf-auth-type']){
            //     case 'accounts':
            //         token = Accounts._hashLoginToken(this.request.headers['x-auth-token']);
            //         break;
            //     case 'facebook':
            //         token =  this.request.headers['x-auth-token']
            //         break;
            // }
            return {
                userId: this.request.headers['x-user-id'],
                token: token
            }
        }
    },
    prettyJson: true
});



// Generates: POST on /api/users and GET, DELETE /api/users/:id for
// Meteor.users collection
API.addCollection(Meteor.users, {
    excludedEndpoints: ['getAll', 'put', "patch"],
    routeOptions: {
        authRequired: true
    },
    endpoints: {
        post: {
            authRequired: false
        },
        delete: {
            roleRequired: 'admin'
        }
    }
});

// Generates: GET, POST on /api/items and GET, PUT, PATCH, DELETE on
// /api/items/:id for the Items collection
API.addCollection(UsersCollection);

// Maps to: /api/articles/:id
API.addRoute('collection', {authRequired: true}, {
    get: function () {
        console.log(this);
        return UsersCollection.findOne();
    },
    delete: {
        roleRequired: ['author', 'admin'],
        action: function () {
            if (UsersCollection.remove(this.urlParams.id)) {
                return {status: 'success', data: {message: 'Article removed'}};
            }
            return {
                statusCode: 404,
                body: {status: 'fail', message: 'Article not found'}
            };
        }
    }
});

API.addCollection(UsersTradesConnected);

API.addRoute('connectedPlayers/Users_id:/:longitude/:latitude', {authRequired: true}, {
    get: function () {

        return UsersTradesConnected.find({}).fetch();
    },
    delete: {
        roleRequired: ['author', 'admin'],
        action: function () {
            if (Articles.remove(this.urlParams.id)) {
                return {status: 'success', data: {message: 'Article removed'}};
            }
            return {
                statusCode: 404,
                body: {status: 'fail', message: 'Article not found'}
            };
        }
    },
    post: function () {
        console.log("AAAAAAAAAAAAAAAA");
        return ""
    }
});

// Api.addRoute("a", {authRequired: true}, {
//     get: function () {
//         console.log(test);
//
//         return UsersTradesConnected.findOne();
//     },
//     delete: {
//         roleRequired: ['author', 'admin'],
//         action: function () {
//             if (UsersCollection.remove(this.urlParams.id)) {
//                 return {status: 'success', data: {message: 'Article removed'}};
//             }
//             return {
//                 statusCode: 404,
//                 body: {status: 'fail', message: 'Article not found'}
//             };
//         }
//     }
// });

API.addRoute('fb/login', {authRequired: false}, {
    get: function () {
        return {
            statusCode: 404,
            body: {status: 'fail', message: 'Post not found'}
        };
    },
    post: {
        action: function () {
            var accessToken = this.bodyParams.accessToken || this.urlParams.accessToken;
            var email = this.bodyParams.email;
            var name = this.bodyParams.name;
            if (accessToken) {
                return facebookLoginWithAccessToken(accessToken, email, name)
            }
            return {
                statusCode: 400,
                body: {
                    status: "fail",
                    message: "Unable to Post to FB Login. Values Received: accessToken: " + accessToken + ", email: " + email + ", name: " + name
                }
            };
        }
    }
});

API.addRoute('checkToken', {authRequired: true}, {
    get: function () {
        return {
            statusCode: 200,
            body: {status: true, message: 'Token Exists'}
        };
    },
    post: {
        action: function () {
            return {
                check : true
            }
        }
        //     console.log("checkToken");
        //     console.log(this.bodyParams);
        //
        //     var token = Accounts._hashLoginToken(this.bodyParams.accessToken);
        //
        //
        //     console.log(userId)
        //
        //
        //     var foundLogin = Meteor.users.findOne({_id : userId, "services.resume.loginTokens.hashedTokens" : token});
        //
        //
        //
        //     console.log(foundLogin);
        //
        //     if (accessToken) {
        //         return {
        //             confirmed: true,
        //             bbb: "cccc"
        //         }
        //     }
        //     return {
        //         statusCode: 400,
        //         body: {
        //             status: "fail",
        //             message: "Unable check if Token Exists: " + accessToken
        //         }
        //     };
        // }
    }
});

facebookLoginWithAccessToken = (accessToken, email, name)=> {
    var Future = Npm.require('fibers/future');
    var future = new Future();
    var serviceData = {
        accessToken: accessToken,
        email: email
    };

    // var meteor_accounts_loginServiceConfiguration.findOne();

    console.log(services.resume.loginTokens.hashedToken);
    var input = "1535016826538049" + '|' + "215259d052fccf7a66e36894c16417a2";
    // var input = Meteor.settings.private.facebook.id + '|' + Meteor.settings.private.facebook.secret
    var url = "https://graph.facebook.com/debug_token?input_token=" + accessToken + "&access_token=" + input
    HTTP.call( 'GET', url, function( error, response ) {
        if (error) {
            future.throw(new Meteor.Error(503, 'A error validating your login has occured.'));
        }

        var info = response.data.data;


        if (!info.is_valid) {
            future.throw(new Meteor.Error(503, 'This access token is not valid.'));
        }

        if (info.app_id !== "1535016826538049") {
            future.throw(new Meteor.Error(503, 'This token is not for this app.'));
        }

        // Force the user id to be the access token's user id
        serviceData.id = info.user_id;

        // Returns a token you can use to login
        var user = Accounts.updateOrCreateUserFromExternalService('facebook', serviceData, {});
        if(!user.userId){
            future.throw(new Meteor.Error(500, "Failed to create user"));
        }

        //Add email & user details if necessary


        Meteor.users.update(user.userId, { $set : { "profile.name" : name}});
        // Accounts.addEmail(user.userId, email);

        //Generate your own access token!
        var token = Accounts._generateStampedLoginToken()
        Accounts._insertLoginToken(user.userId, token);

        // Return the token and the user id
        future.return({
            'x-user-id' : user.userId,
            'x-auth-token' : token.token
        })
    });
    return future.wait();
}