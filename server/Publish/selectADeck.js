Meteor.publish('selectADeckDeckPlaylist', function(){
    return DecksNamesPlaylists.find({});
});

Meteor.publish('selectADeckDeckArchetypes', function(format){
    return _deckArchetypes.find({format : format});
});

Meteor.publish('selectADeckDeck', function() {
    return _Deck.find();
});

Meteor.publish('DecksArchetypesFormat', function(format) {
    return DecksArchetypes.find({format : format});
});