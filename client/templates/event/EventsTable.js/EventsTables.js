Template.EventsTables.helpers({
    eventsSmallSelector : function(){
        return {"validation.allDecksHasNames" : true, format : FlowRouter.getParam("format"), decks : {$lt : 16} }
    },
    eventsBigSelector : function(){
        return {"validation.allDecksHasNames" : true, format : FlowRouter.getParam("format"), decks : {$gte : 16}}
    },

});

Template.EventsTables.events({
    //"click .clickable-row" : function(evt, template){
    //    window.document.location = $(evt.target).data("href");
    //}
});


Template.EventsTables.onRendered(function(){

});