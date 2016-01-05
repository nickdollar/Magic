Meteor.publish('counters', function(){
    Counts.publish(this, 'deckCardsCounter', _DeckCards.find());
    Counts.publish(this, 'deckNamesCounter', _DeckNames.find());
    Counts.publish(this, 'decksCounter', _Deck.find({format : "modern"}));
    Counts.publish(this, 'decknamesCounter', _DeckNames.find());
    Counts.publish(this, 'decknamesCounter', _MetaValues.find());
});


