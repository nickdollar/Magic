import { Cookies } from 'meteor/ostrio:cookies';


Meteor.startup(function () {
    if ( Meteor.users.find().count() === 0 ) {
        Accounts.createUser({
                    username: 'admin',
                    email: 'ivelacc@gmail.com',
                    password: 'admin',
                    profile: {
                        first_name: 'Nicholas',
                        last_name: 'Homolka',
                        company: 'Crowdmtg',
                    }
                });
        var _id = Meteor.users.findOne()._id;
        Roles.createRole("admin");
        Roles.addUsersToRoles(_id, "admin");
    }

    if(checkIfZipNeedsFixing() != ZipCodes.find().count()){
        console.log("makeZipCollection Wrong Quantity");
        makeZipCollection();
    }else{
        console.log("Collection ZipCodes Match");
    }

    if(checkIfCardFullDataQuantity() != CardsFullData.find().count()){
        console.log("checkIfCardFullDataQuantity Wrong Quantity");
        createCardsFullData();
    }else{
        console.log("Collection CardsFullData Match");
    }
    if(makeCardsDataCount() != CardsData.find().count()){
        console.log("makeCardsData Wrong Quantity");
        makeCardsDataFromFullData();
    }else{
        console.log("Collection CardsData Match ");
    }
});

// var cookies = new Cookies()
//
// var cookie = new Cookies({
//     auto: false, // Do not bind as a middleware by default
//     handler: function(cookies){
//
//         var cookiesArray = [{type : "distance", value : 20},
//                             {type : "positionOption", value : "GPS"},
//                             {type : "ZIP", value : ""},
//                             {type : "state", value : ""}
//         ]
//         cookiesArray.forEach((obj)=>{
//             if(!cookies.has(obj.type)){
//                 cookies.set(obj.type, obj.value);
//             }
//         })
//     }
// });
//
// WebApp.connectHandlers.use(cookie.middleware());


