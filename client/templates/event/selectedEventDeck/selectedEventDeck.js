var cardsOptions = {
    artifact : {creature: false, artifact: true, land : false},
    creature : {creature: true},
    enchantment : {enchantment: true, creature: false, artifact: false},
    instant : {instant: true},
    planeswalker : {planeswalker: true},
    sorcety : {sorcery: true},
    land : {land: true, creature: false},
    sideboard : {}
}


Template.selectedEventDeck.helpers({
    cardType: function () {
        var blocks = ["land", "creature", "artifact", "enchantment", "instant", "planeswalker", "sorcery", "sideboard"];
        return blocks;
    },
    cardBlock : function(option){
        var eventDecksQuery = [];
        if(option === "sideboard"){
            if(Session.get("selectedEvent__deckID") == null){
                eventDecksQuery = _eventDecks.findOne().sideboard;
            }else {
                eventDecksQuery = _eventDecks.findOne({_id : Session.get("selectedEvent__deckID")}).sideboard;
            }

        }else {
            if(Session.get("selectedEvent__deckID") == null){
                eventDecksQuery = _eventDecks.findOne().main;
            }else {
                eventDecksQuery = _eventDecks.findOne({_id : Session.get("selectedEvent__deckID")}).main;
            }
        }


        var quantity = 0;
        var result = [];

        var cardDatabaseQuery = _CardDatabase.find(cardsOptions[option]).fetch();
        cardDatabaseQuery.forEach(function(cardsQueryObj){
            var card = eventDecksQuery.find(function(eventDecksQueryObj){
                        return  eventDecksQueryObj.name === cardsQueryObj.name;
            });
            if(card != null){
                quantity += card.quantity;
                cardsQueryObj.quantity = card.quantity;
                result.push(cardsQueryObj);
            }

        });

        if(quantity== 0){
            return false;
        }
        return {quantity : quantity, cards : result};
    }
});