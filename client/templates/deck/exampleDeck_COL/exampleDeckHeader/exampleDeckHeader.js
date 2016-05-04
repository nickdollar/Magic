Template.exampleDeckHeader.helpers({
    deck : function() {
        return _Deck.findOne({eventType : Session.get(SV_decksSelectedEventType)});
    }
});