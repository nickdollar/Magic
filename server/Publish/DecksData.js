Meteor.publish('DecksDataOnlyDecksNames_id', function() {
    return DecksData.find({}, {DecksNames_id : 1});
});

Meteor.publish('DecksDataBy_id', function(DecksData_id) {
    return DecksData.find({_id : DecksData_id});
});

Meteor.publish('DeckTableExample_Decksnames_id', function(DecksNames_id) {
    return DecksData.find({DecksNames_id : DecksNames_id}, {fields : {
                                                                format : 0,
                                                                totalMain : 0,
                                                                main : 0,
                                                                totalSideboard : 0,
                                                                sideboard : 0,
                                                                colors : 0,
                                                                state : 0
                                                            }});
});


Meteor.publish('DecksDataBy_id_NonReactive', function(DecksData_id) {
    return DecksData.find({_id : DecksData_id});
});

Meteor.publish('DecksDataFromEvent_idSimplified', function(Events_id) {
    return DecksData.find({Events_id : Events_id}, {sort : {position : 1}, fields : {main : 0, sideboard : 0}});
});

Meteor.publish('DecksDataPLayerList_FromEvents', function(Events_id) {
    return DecksData.find({Events_id : Events_id}, {sort : {position : 1, victory : 1}, fields : {main : 0, sideboard : 0}});
});

Meteor.publish('DecksDataDecksData_idOrEvents_id', function(DecksData_id, Events_id) {
    if(DecksData_id){
        return DecksData.find({_id : DecksData_id});
    }else{
        return DecksData.find({Events_id : Events_id}, {$sort : {position : 1, victory : 1}, limit : 1});
    }
});

function arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }
    return a;
}

Meteor.publish("SelectedEventHeaderContainerDecksData_id", function(DecksData_id){
    return DecksData.find({_id : DecksData_id});
});

Meteor.publish("DecksData", function(){
    return DecksData.find({});
});

Meteor.publish("Eve", function(notState){
    return DecksData.find({states : {$nin : notState}});
});

Meteor.publish('DecksDataStatesList', function(notState){
    return DecksData.find({state : {$nin : notState}}, {fields : {state : 1, format : 1}});
});

Meteor.publish('DecksDataQueryProjection', function(query, project){
    return DecksData.find(query, project);
});

Meteor.publish('DecksWithoutNamesContainer', function(state, format, limit, skip){
    return DecksData.find({state : state, format : format}, {limit : limit, skip : skip, fields : {format : 1, state : 1, colors : 1}});
});

Meteor.publishComposite('DecksDataCardsDataByDecksdata_id', function(DecksData_id){
    return {
        find : function() {
            return DecksData.find({_id : DecksData_id});
        },
        children : [
            {
                find : function(DeckData){
                    var main = DeckData.main.map(function(obj){
                        return obj.name;
                    });
                    var sideboard = DeckData.sideboard.map(function(obj){
                        return obj.name;
                    });
                    var allCards = arrayUnique(main.concat(sideboard));
                    return CardsData.find({name: {$in : allCards}});
                }
            }
        ]
    }
});


Meteor.publishComposite('DecksDataCardsDataByIdOrFirstOnEvents', function(DecksData_id, Events_id){
    return {
        find : function() {
            if(DecksData_id){
                return DecksData.find({_id : DecksData_id}, {limit : 1, sort : {position : 1}, field : {main : 1}});
            }
            return DecksData.find({Events_id : Events_id}, {limit : 1, sort : {position : 1}, field : {main : 1}});
        },
        children : [
            {
                find : function(DeckData){
                    var main = DeckData.main.map(function(obj){
                        return obj.name;
                    });
                    var sideboard = DeckData.sideboard.map(function(obj){
                        return obj.name;
                    });
                    var allCards = arrayUnique(main.concat(sideboard));

                    return CardsData.find({name: {$in : allCards}});
                }
            }
        ]
    }
});

Meteor.publishComposite("deckSelectedID", function(_id) {
    return {
        find: function () {
            return DecksData.find({_id : _id});
        },
        children: [
            {
                // collectionName: "selectNamesCards",
                find: function (deck) {
                    var cards = deck.main.map(function(obj){
                        return obj.name;
                    });

                    cards.push.apply(cards, deck.sideboard.map(function(obj){
                        return obj.name;
                    }));
                    return CardsData.find({name : {$in : cards}});
                }
            }
        ]
    }
});

Meteor.publishComposite('dashBoardDecksTables', function(tableName, ids, fields) {
    return {
        find: function () {
            return DecksData.find({_id: {$in: ids}}, {fields: fields});
        },
        children: [
            {
                find: function(deckData) {
                    // Publish the related user
                    return DecksNames.find({_id: deckData.DecksNames_id}, {limit: 1, fields: {name : 1}, sort: {_id: 1}});
                }
            }
        ]
    };
});

Meteor.publishComposite('dacksWithoutNameTable', function(tableName, ids, fields) {

    return {
        find: function () {
            return DecksData.find({_id: {$in: ids}}, {fields: fields});
        },
        children: [
            {
                find: function(deckData) {
                    // Publish the related user
                    return DecksNames.find({_id: deckData.DecksNames_id}, {limit: 1, fields: {name : 1}, sort: {_id: 1}});
                }
            }
        ]
    };

});

Meteor.publishComposite("deckSelectedAndCardsData", function(_id, DecksNames_id) {
    return {
        find: function () {

            if(_id){
                return DecksData.find({_id : _id});
            }else{
                return DecksData.find({DecksNames_id : DecksNames_id}, {sort : {date : -1}, limit : 1});
            }

        },
        children : [
            {
                find : function(decksData){
                    var main = decksData.main.map(function(obj){
                        return obj.name;
                    });
                    var sideboard = decksData.sideboard.map(function(obj){
                        return obj.name;
                    });
                    var allCards = arrayUnique(main.concat(sideboard));
                    return CardsData.find({name: {$in : allCards}});
                }
            }
        ]
    }
});

Meteor.publish('deckSelectedGetNewestDeck', function(DecksNames_id){
    return DecksData.find({DecksNames_id : DecksNames_id});
});

Meteor.publish('DecksWithoutNamesQuantity', function(format){
    return  DecksData.find({
            format: format,
            DecksNames_id: null,
        },
        {
            fields : {DecksNames_id : 1, format : 1, type : 1, autoNaming : 1, autoPercentage : 1}
        })
});

Meteor.publish('DecksWithoutNamesComplete', function(format){
    return  DecksData.find({
            format: format,
            DecksNames_id: null,
        },
        {
            fields : {main : 0, sideboard : 0}
        })
});

Meteor.publish('DecksAutoPercentage100AutoNamingQuantity', function(format){
    return  DecksData.find({
            format: format,
            type : {$in : ["league", "daily"]},
            autoPercentage : 1,
            autoNaming : true,
        },
        {
            fields : {DecksNames_id : 1, format : 1, type : 1, autoNaming : 1, autoPercentage : 1}
        })
});

Meteor.publish('DecksDataLeagueDailyWithWrongCardsNameQuantity', function(format){
    return  DecksData.find({
            format: format,
            $or :   [
                        {"main.wrongName" : true},
                        {"sideboard.wrongName" : true}
                    ]

            },
            {
                fields : {DecksNames_id : 1, main : {$elemMatch : {wrongName : true}}, sideboard : {$elemMatch : {wrongName : true}}, sideboard : 1, format : 1}
            })
});

Meteor.publish('DecksDataLeagueDailyWithWrongCardsNameComplete', function(format){
    return  DecksData.find({
            format: format,
            type : {$in : ["league", "daily"]},
            $or : [
                {"main.wrongName" : true},
                {"sideboard.wrongName" : true}
            ]

        })
});

Meteor.publish('DecksAutoPercentageLessThan100LeagueDailyQuantity', function(format){
    return  DecksData.find({
            format: format,
            type : {$in : ["league", "daily"]},
            autoPercentage: {$lt : 1},
        },
        {
            fields : {DecksNames_id : 1, format : 1, type : 1, autoNaming : 1, autoPercentage : 1}
        })
});

Meteor.publish('DecksAutoPercentageLessThan100LeagueDailyComplete', function(format){
    return  DecksData.find({
            format: format,
            type : {$in : ["league", "daily"]},
            autoPercentage: {$lt : 1},
        },
        {
            fields : {main : 0, sideboard : 0}
        })
});

Meteor.publishComposite("deckSelectedGetDeckDataAndCardData", function(DecksNames_id) {
    return {
        find: function () {
            return DecksData.find({DecksNames_id : DecksNames_id}, {limit : 1});
        },
        children: [
            {
                find: function (DeckData) {
                    return DecksData.find({DecksNames_id : DeckData._id}, {sort : {date : 1}, limit : 1});
                }
            }
        ]
    }
});



function arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }
    return a;
}