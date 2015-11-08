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

Meteor.publish('cardbreakdowndate', function(){
    return _cardBreakDownDate.find({});
});

Meteor.publish('cardbreakdowncards', function(){
    return _cardBreakDownCards.find({});
});

Meteor.publish('decksWithoutName', function(format){
    return _Deck.find({format : format, $or : [{name : {$exists : false}}, {name : ""}]}, {limit : 8});
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
