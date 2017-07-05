import { Cookies } from 'meteor/ostrio:cookies';
httpRequestTime = 10000;

Meteor.startup(function () {

    var Future = Npm.require('fibers/future');
    Mongo.Collection.prototype.getIndexes = function() {
        var raw = this.rawCollection();
        var future = new Future();

        raw.indexes(function(err, indexes) {
            if (err) {
                future.throw(err);
            }

            future.return(indexes);
        });

        return future.wait();
    };

    DecksDataUniqueWithoutQty._ensureIndex({nonLandMain : 1});
    TCGDailyPrices._ensureIndex({TCGCards_id : 1});
    Cards._ensureIndex({"printings.multiverseid" : 1});
    Cards._ensureIndex({"printings.TCGCards_id" : 1});
    CardsUnique._ensureIndex({name : 1, TCGId : 1});
    DecksData._ensureIndex({DecksArchetypes_id : 1});
    ZipCodes._ensureIndex({ZIP : 1});
    ZipCodes._ensureIndex({ZIP : 1});
    UsersCollection._ensureIndex({"cards.name" : 1});


    if ( Meteor.users.find().count() === 0 ){
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
        var _id = Meteor.users.find({}, {limit : 1}).fetch()[0]._id;
        Roles.createRole("admin");
        Roles.addUsersToRoles(_id, "admin");
    }

    if(checkIfZipNeedsFixing() != ZipCodes.find().count()){
        console.log("makeZipCollection Wrong Qty");
        makeZipCollection();
    }else{
        console.log("Collection ZipCodes Match");
    }

    createEventsTypes();
    createFormats();

});
