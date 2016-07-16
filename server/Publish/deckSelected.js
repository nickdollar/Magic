Meteor.publish('deckSelectedImages', function(){
    return _Images.find({});
});

Meteor.publish('deckSelectedDeckPlaylist', function(){
    return _DeckPlayList.find({});
});

Meteor.publish('deckSelectedDeckArchetypes', function(format){
    return _deckArchetypes.find({format : format});
});


Meteor.publish('deckSelectedeventSmallTable', function(format){
    return _Deck.find({format : format});
});

Meteor.publish('deckSelectedDeckCardsWeekChange', function(){
    return _deckCardsWeekChange.find({});
});

Meteor.publish('deckSelectedArchetypeDeckNames', function(format, archetype){
    var names = _deckArchetypes.findOne({format : format, archetype : archetype}).deckNames.map(function(a){return a.name});
    return _DeckNames.find({format : format, name : {$in : names}});
});

Meteor.publishComposite("deckSelectedDeckEventsDaily", function(format, selectedNameDeck) {
    return {
        find: function () {
            return _Deck.find({name: selectedNameDeck, format : format}, {limit : 5});
        },
        children: [
            {

                find: function (deckName) {
                    return _Event.find({_id : deckName._eventID});

                    //return _Event.find({_id : deckName._eventID, eventType : "daily"});
                }
            }
        ]
    }
});

Meteor.publishComposite("deckSelectedDeckEventsPtq", function(format, selectedNameDeck) {
    return {
        find: function () {
            return _Deck.find({name: selectedNameDeck, format : format, eventType : "ptq"}, {limit : 5});
        },
        children: [
            {
                find: function (deckName) {
                    return _Event.find({_id : deckName._eventID});
                }
            }
        ]
    }
});