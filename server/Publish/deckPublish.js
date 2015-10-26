Meteor.publish('deck', function() {
    return _Deck.find();
});

Meteor.publish('event', function() {
    return _Event.find();
});



Meteor.publishComposite("joinCards", function(selectedDeck){
    return {
        find: function () {
            return _DeckCards.find({_deckID:  selectedDeck});
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


Meteor.publishComposite("joinExampleCards", function(){
    return {
        find: function () {
            return _Deck.find({name : "RWg Burn"}, {limit : 3});
        },
        children: [
            {
                find: function (deck) {
                    return _DeckCards.find({_deckID: deck._id});
                },
                children : [
                    {
                        collectionName: "joinExampleCards",
                        find: function (card) {
                            return _CardDatabase.find({name: card.name});
                        }
                    }
                ]
            }
        ]
    }
});