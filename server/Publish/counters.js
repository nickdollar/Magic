Meteor.publish('counters', function(){
    Counts.publish(this, 'deckCardsCounter', _DeckCards.find());
    Counts.publish(this, 'deckNamesCounter', _DeckNames.find());
});


