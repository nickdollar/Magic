Template.EventsIsDone.helpers({
    isDone : function(){
        if(this.doc.validation.allDecksHasNames){
            return "Completed";
        }
        return "not Completed";
    }
})