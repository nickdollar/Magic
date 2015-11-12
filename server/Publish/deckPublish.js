Meteor.publish('deck', function() {
    return _Deck.find();
});

Meteor.publish('event', function() {
    return _Event.find();
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