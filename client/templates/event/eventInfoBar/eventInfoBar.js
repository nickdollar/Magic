Template.eventInfoBar.helpers({
    event : function(){
      return _Event.findOne();
    },
    deck : function (){
        if(Session.get("selectedEvent__deckID") != null){
            return _eventDecks.findOne({_id : Session.get("selectedEvent__deckID")});
        };
        return _eventDecks.findOne();
    },
    deckPosition : function(){
        if(this.position !== undefined){
            return this.position;
        }

        var position = this.victory + "-" + this.loss;

        if(this.draw != 0){
            position += " " + this.draw;
        }
        return position;
    }
});