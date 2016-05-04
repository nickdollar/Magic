SV_decksSelectedDeckName = "selectedDeckName";
Session.set(SV_decksSelectedDeckName, "");
SV_decksSelectedEventType = "eventType";
Session.setDefault(SV_decksSelectedEventType, "daily");

Template.deckSelected.helpers({
    isSelected : function(){
        return Router.current().params.deckSelected != null ? true : false;
    }
});

Template.events_COL.helpers({
    event : function(){
        var decks = _Deck.find({}).fetch();
        var list = [];
        for(var i = 0; i < decks.length; i++){
            var eventData = {};
            var event = _Event.findOne({_id :decks[i]._eventID});

            eventData.position = decks[i].eventType == "ptq" ? decks[i].position : decks[i].victory + "-" + decks[i].loss;
            eventData.date = event.date;
            eventData.eventType = event.eventType;
            eventData.httpAddress = event.httpAddress;
            eventData._eventNumber = event._eventNumber;
            eventData.players = event.players;
            list.push(eventData);
        }

        return list;
    }
})

