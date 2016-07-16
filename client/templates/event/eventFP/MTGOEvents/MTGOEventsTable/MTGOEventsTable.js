Template.MTGOEventsTable.helpers({
    mtgoEvents : function(){
        return _Event.find({_eventNumber : {$exists : true}, players : {$exists : true}}, {limit : 10});
    }
});

Template.MTGOEventsTable.events({
    //"click .clickable-row" : function(evt, template){
    //    window.document.location = $(evt.target).data("href");
    //}
});


Template.MTGOEventsTable.onRendered(function(){

});