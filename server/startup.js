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

    // for(var i = 0; i< CardsData.getIndexes().length; i++){
    //     if(CardsData.getIndexes()[i].name == "_id_"){
    //         continue;
    //     }
    //     CardsData._dropIndex(CardsData.getIndexes()[i].name);
    // }

    CardsData._ensureIndex({name : 1});
    CardsFullData._ensureIndex({name : 1});
    DecksDataUniqueWithoutQty._ensureIndex({nonLandMain : 1});
    DecksData._ensureIndex({DecksNames_id : 1});
    DecksNames._ensureIndex({DecksArchetypes_id : 1});
    ZipCodes._ensureIndex({ZIP : 1});
    ZipCodes._ensureIndex({ZIP : 1});
    UsersCollection._ensureIndex({"cards.name" : 1});
    CardsCollectionSimplified._ensureIndex({"name" : 1});


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

    if(checkIfCardFullDataQty() != CardsFullData.find().count()){
        console.log("checkIfCardFullDataQty Wrong Qty");
        createCardsFullData();
    }else{
        console.log("Collection CardsFullData Match");
    }
    if(makeCardsDataCount() != CardsData.find().count()){
        console.log("makeCardsData Wrong Qty");
        makeCardsDataFromFullData();
    }else{
        console.log("Collection CardsData Match ");
    }

    if(MTGSetsCountFromFile() != MTGSets.find().count()){
        console.log("MTGSets Wrong Qty");
        MakeMTGSets();
    }else{
        console.log("MTGSets CardsData Match ");
    }

    createEventsTypes();
    createFormats();
    databaseFixes();

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


