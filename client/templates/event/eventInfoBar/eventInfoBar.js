Template.eventInfoBar.helpers({
    event : function(){
        console.log(_Event.findOne());
      return _Event.findOne();
    },
    deck : function (){
        if(Session.get("selectedEvent__deckID") != null){
            return _eventDecks.findOne({_id : Session.get("selectedEvent__deckID")});
        };
        return _eventDecks.findOne();
    },
    deckPosition : function(){
        if(this.pos !== undefined){
            return position;
        }
        var position = this.victory + "-" + this.loss;

        if(this.draw != 0){
            position += " " + draw;
        }
        return position;
    }
});