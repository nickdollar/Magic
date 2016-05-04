Template.selectedEventBar.helpers({
    playerList : function(){
        return _eventDecks.find();
    },
    pos : function(){
        if(this.pos !== undefined){
            return position;
        }

        var position = this.victory + "-" + this.loss;

        if(this.draw != 0){
            position += " " + draw;
        }
        return position;
    },
    activated : function(){
        if(this._id == Session.get("selectedEvent__deckID")){
            return true;
        }
    }
})