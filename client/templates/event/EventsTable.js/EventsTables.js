

Template.EventsTables.helpers({
    eventsSmallSelector : function(){
        return {state : {$in : ["decks", "names"]},  format : FlowRouter.getParam("format"), decks : {$lt : 16} }
    },
    eventsBigSelector : function(){
        return {state : {$in : ["decks", "names"]}, format : FlowRouter.getParam("format"), decks : {$gte : 16}}
    },
    geoLocation : function(){
        var location = Geolocation.latLng() || { lat: 0, lng: 0 };
        return Geolocation.latLng() || { lat: 0, lng: 0 };
    }

});

Template.EventsTables.events({
    //"click .clickable-row" : function(evt, template){
    //    window.document.location = $(evt.target).data("href");
    //}
});


Template.EventsTables.onRendered(function(){

});