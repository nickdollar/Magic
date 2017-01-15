import moment from "moment";

Template.EventsIsDone.helpers({
    isDone : function(){
        if(!this.doc.validation) {
            return "not Completed";
        }
        if(this.doc.validation.allDecksHasNames){
            return "Completed";
        }
        return "not Completed";
    }
})

Template.EventDateFormated.helpers({
    dateFormated : function(){
        return moment(this.doc.date).format("L");
    }
})