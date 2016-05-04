Meteor.publish('deck', function() {
    return _Deck.find();
});

Meteor.publish('event', function() {
    return _Event.find();
});

Meteor.publish('metaEvent', function(format, eventType) {
    return _Event.find({format : format , eventType : eventType});
});

Meteor.publish('cardsmetavalues', function(){
    return _cardsMetaValues.find({});
});

Meteor.publish('cardweekquantity', function(format){
    return _cardWeekQuantity.find({format : format});
});

Meteor.publish('deckArchetypes', function(format){
    return _deckArchetypes.find({format : format});
});

Meteor.publish('temp', function(){
    return _temp.find({});
});


Meteor.publishComposite("testing", function(format){
    return {
        find: function () {
            return _Deck.find({format : format, $or : [{name : {$exists : false}}, {name : ""}]}, {limit : 8});
        },
        children: [
            {
                find: function (deck) {
                    return _DeckCards.find({_deckID: deck._id});
                },
                children : [
                    {
                        //collectionName: "joinExampleCards",
                        find: function (card) {
                            return _CardDatabase.find({name: card.name});
                        }
                    }
                ]
            }
        ]
    }
});


Meteor.publishComposite("joinCards", function(_deckID){
    return {
        find: function () {
            return _DeckCards.find({_deckID:  _deckID});
        },
        children: [
            {
                collectionName: "joinCardsChildren",
                find: function (deckCard) {
                    return _CardDatabase.find({name: deckCard.name});
                }
            }
        ]
    }
});

Meteor.publishComposite("joinExampleCardsPtq", function(format, name ){
    return {
        find: function () {
            return _Deck.find({eventType : "ptq", format : format, name : name}, {limit : 1});
        },
        children: [
            {
                find: function (deck) {
                    return _DeckCards.find({_deckID: deck._id});
                },
                children : [
                    {
                        find: function (card) {
                            return _CardDatabase.find({name: card.name});
                        }
                    }
                ]
            }
        ]
    }
});

Meteor.publishComposite("joinExampleCardsDaily", function(format, name ){
    return {
        find: function () {

            return _Deck.find({eventType : "daily", format : format, name : name}, {limit : 1});
        },
        children: [
            {
                find: function (deck) {
                    return _DeckCards.find({_deckID: deck._id});
                },
                children : [
                    {
                        find: function (card) {
                            return _CardDatabase.find({name: card.name});
                        }
                    }
                ]
            }
        ]
    }
});

