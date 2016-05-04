Template.exampleDeck_COL.helpers({
    deck : function() {
        return _Deck.findOne({eventType : Session.get(SV_decksSelectedEventType)});
    }
    ,cardType : function(){
        var blocks = ["artifact", "creature", "enchantment", "instant", "planeswalker", "sorcery", "land"];
        var types = [];
        for(var i = 0; i< blocks.length; i++){
            var quantity = getQuantity2(blocks[i], false, Session.get(SV_decksSelectedEventType));
            if(quantity > 0){types.push({name : capitalizeFirstLetter(blocks[i]), quantity : quantity, block : blocks[i]});}
        }
        return types;
    },
    cards : function(block){
        var names = _CardDatabase.find(typeOptions[block]).map(function(p) { return p.name });
        var deck = _Deck.findOne({eventType: Session.get(SV_decksSelectedEventType)});
        return _DeckCards.find({ _deckID : deck._id, sideboard : false, name : {$in : names}});
    },
    sideboard : function(){
        var names = _CardDatabase.find({}).map(function(p) { return p.name });
        var deck = _Deck.findOne({eventType: Session.get(SV_decksSelectedEventType)});
        return _DeckCards.find({_deckID : deck._id, sideboard : true, name : {$in : names}});
    },
    sideboardQuantity: function() {
        return getQuantity2(null, true, Session.get(SV_decksSelectedEventType));
    },
    test : function(test){

    },
    event : function(_deckID) {
        var _eventID = _Deck.findOne({_id: _deckID})._eventID;
        return _Event.findOne({_id: _eventID}).eventType;
    },
    manaCost : function(card){
        return '';
    },
    daily : function(){
        return _Deck.findOne({eventType : "daily"}) != null ? "" : "disabled";
    },
    ptq : function(){
        return _Deck.findOne({eventType : "ptq"}) != null ? "" : "disabled";
    }

});



Template.exampleDeck_COL.onRendered(function(){
    var values = this;
});
