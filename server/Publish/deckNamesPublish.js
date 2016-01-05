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

Meteor.publish('decknames', function(){
    return _DeckNames.find({});
});

Meteor.publish('metaValues', function(){
    return _MetaValues.find({});
});

Meteor.publish('metaDate', function(){
    return _MetaDate.find({});
});

Meteor.publish('deckplaylist', function(){
    return _DeckPlayList.find({});
});

Meteor.publish('cardbreakdown', function(){
    return _cardBreakDown.find({});
});

Meteor.publish('deckcardsweekchange', function(){
    return _deckCardsWeekChange.find({});
});

Meteor.publish('decksWithoutName', function(format){
    return _Deck.find({format : format, $or : [{name : {$exists : false}}, {name : ""}]}, {limit : 8});
});

Meteor.publish('deckArchetype', function(format){
    return _Deck.find({format : format, $or : [{name : {$exists : false}}, {name : ""}]}, {limit : 8});
});


Meteor.publish('formatsCards', function(){
    var d = new Date();
    d.setDate(d.getDate()-6);
    return _formatsCards.find({date : {$gte : d}});
});

Meteor.publish('simplifiedTables',function(){
   return _simplifiedTables.find({});
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

Meteor.publishComposite("deckEvents", function(format, selectedNameDeck) {
    return {
        find: function () {
            return _Deck.find({name: selectedNameDeck, format : format});
        },
        children: [
            {
                find: function (deckName) {
                    console.log(deckName);
                    return _Event.find({_id : deckName._eventID});
            }
            }
        ]
    }
});
