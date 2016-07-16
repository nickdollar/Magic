Meteor.publish('selectADeckDeckPlaylist', function(){
    return _DeckPlayList.find({});
});

Meteor.publish('selectADeckDeckArchetypes', function(format){
    return _deckArchetypes.find({format : format});
});

Meteor.publish('selectADeckDeck', function() {
    return _Deck.find();
});