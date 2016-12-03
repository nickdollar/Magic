Meteor.publish('DecksDataOnlyDecksNames_id', function() {
    return DecksData.find({}, {DecksNames_id : 1});
});

Meteor.publish('DecksDataFromEvent_idSimplified', function(Events_id) {
    return DecksData.find({Events_id : Events_id}, {sort : {position : 1}, fields : {player : 1, DecksNames_id : 1, victory : 1, loss : 1, colors : 1, position : 1}});
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

Meteor.publish("_temp2", function(){
    return DecksData.find();
});

Meteor.publish('_temp2FieldsName_eventID', function(){
    return DecksData.find({}, {fields : {name : 1, events_id : 1}});
});

Meteor.publish("DecksData", function(){
    return DecksData.find({});
});

Meteor.publishComposite('DecksDataCardsDataByDecksdata_id', function(DecksData_id){
    return {
        find : function() {
            return DecksData.find({_id : DecksData_id}, {limit : 1});
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

            console.log(_id, DecksNames_id);
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