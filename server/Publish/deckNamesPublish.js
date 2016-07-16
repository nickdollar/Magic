_DeckNames.allow({
    'insert' : function(){
        return true;
    },
    'update' : function(){
        return true;
    },
    'remove' : function(){
        return true;
    }
});

_DeckNamesCards.allow({
    'insert' : function(){
        return true;
    },
    'remove' : function(){
        return true;
    },
    'update' : function(){
        return true;
    }
});

_Deck.allow({
    'update' : function(){
        return true;
    }
});

_temp.allow({
    'insert' : function(){
        return true;
    }
});

_Event.allow({
    'insert' : function(){
        return true;
    },
    'remove' : function(){
        return true;
    },
    'update' : function(){
        return true;
    }
});

Meteor.publish('eventOthersTable', function(format){
    if(format == null){
        return _Event.find();
    }
    return _Event.find({format : format});
});

Meteor.publish('futureEventsTable', function(format){
    if(format == null){
        return _Event.find({customEvent : true});
    }
    return _Event.find({format : {$in : [format]}, customEvent : true});
});

Meteor.publish('mtgoEventsTable', function(format){
    if(format == null){
        return _Event.find({_eventNumber : {$exists : true}})
    }
    return _Event.find({format : format, _eventNumber : {$exists : true}});
});

Meteor.publish('decknames', function(){
    return _DeckNames.find({});
});

Meteor.publish('metaDate', function(){
    return _MetaDate.find({});
});

Meteor.publish('cardbreakdown', function(){
    return _cardBreakDown.find({});
});

Meteor.publish('decksWithoutName', function(format){
    return _Deck.find({format : format, $or : [{name : {$exists : false}}, {name : ""}]}, {limit : 8});
});

Meteor.publish('deckArchetype', function(format){
    return _Deck.find({format : format, $or : [{name : {$exists : false}}, {name : ""}]}, {limit : 8});
});

Meteor.publish('pastEventsTable', function(format){
    if(format === null){
        return _futureEvents.find();
    }
    return _futureEvents.find({format : {$in : [format]}});
});

Meteor.publish('events', function(format){
    if(format === null){
        return _Event.find();
    }
    return _Event.find({format : format});

});


Meteor.publish('formatsCards', function(){
    var d = new Date();
    d.setDate(d.getDate()-6);
    return _formatsCards.find({date : {$gte : d}});
});

Meteor.publish('simplifiedTables',function(){
   return _simplifiedTables.find({});
});

Meteor.publish('metaValues', function(typesCombinations, date){
    return _MetaValues.find({typesCombinations : typesCombinations, date : date})
})

Meteor.publish('metaCards', function(typesCombinations, date, slice){
    return _metaCards.find({typesCombinations : typesCombinations, date : date}, {fields : {mainboard : {$slice : slice}}});
})

Meteor.publish('selectedEvent', function(_id){
   return _Event.find({_id : _id});
});

Meteor.publish('selectedEventDeck', function(_eventID){
    return _eventDecks.find({_eventID : _eventID});
});

Meteor.publish('selectedEventDeckCard', function(_eventID) {

    var eventDeckQuery = _eventDecks.find({_eventID: _eventID});

    var cards = [];

    eventDeckQuery.forEach(function(eventsDecksObj){
        var main = eventsDecksObj.main.map(function(mainObj){
            return mainObj.name;
        });

        var sideboard = eventsDecksObj.sideboard.map(function(sideboardObj){
            return sideboardObj.name;
        });
        var deckCards = main.concat(sideboard);
        cards = cards.concat(deckCards);
    });

    return _CardDatabase.find({name : {$in : cards}});
});

Meteor.publishComposite("deckNamesSelected", function(selectedNameDeck) {
    return {
        find: function () {
            return _DeckNames.find({_id: selectedNameDeck});
        },
        children: [
            {
                collectionName: "selectNamesCards",
                find: function (_deckNameID) {
                    return _DeckNamesCards.find({_deckNameID: _deckNameID._id});
                },
                children: [
                    {
                        collectionName: "selectedNamesCardsValues",
                        find: function(card){

                            return _CardDatabase.find({name : card.name});
                        }
                    }
                ]
            }
        ]
    }
});


