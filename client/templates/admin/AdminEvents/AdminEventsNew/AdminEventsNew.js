Template.AdminEventsNew.onCreated(function(){
    this.options = new ReactiveDict();
    this.options.set("format", 'standard');
});

Template.AdminEventsNew.helpers({
    selector : function(){
        var date = new Date();
        date.setDate(date.getDate() - 10);
        return {format : Template.instance().options.get("format"), $and : [{$or : [{"validation.exists" : false, date : {$gte : date}}, {"validation.exists" : true}]}, {$or : [{"validation.htmlDownloaded" : null}, {"validation.extractDecks" : null}]}]};
    }
})

Template.AdminEventsNew.events({
    "click .js-addOldLeagueEvents" : function(evt, tmp){
        Meteor.call("methodEventLeagueGetInfoOld", tmp.options.get("format"));
    },

    'change input[name="format"]' : function(evt, tmp){
        tmp.options.set("format", $(evt.target).attr("value"));
    },
    "click .js-getNew" : function(evt,tmp){
        Meteor.call("methodEventLeagueGetNewEvents", tmp.options.get("format"));
    },
    "click .js-fixAllThingsLeagueDaily" : function(evt, tmp){
        Meteor.call("fixAllThingsLeagueDaily", tmp.options.get("format"));
    },
    "click .js-checkIfOldDailyLeagueEventsExists" : function(evt, tmp){
        Meteor.call("checkIfOldDailyLeagueEventsExists", tmp.options.get("format"));
    },
    "click .js-checkIfOldMTGOPTQEventsExists" : function(evt, tmp){
        Meteor.call("checkIfOldMTGOPTQEventsExists", tmp.options.get("format"));
    },

    //MTGO PTQ
    "click .js-addOldMTGOPTQEvents" : function(evt, tmp){
        Meteor.call("methodEventMTGOPTQGetInfoOld", tmp.options.get("format"));
    },
    "click .js-fixAllMTGOPTQThings" : function(evt, tmp){
        Meteor.call("fixAllMTGOPTQEvents", tmp.options.get("format"));
    },

    //protour
    "click .js-addGPEvents" : function(evt, tmp){
        Meteor.call("methodGPGetInfoOld");
    },
    "click .js-fixAllGPEvents" : function(evt, tmp){
        Meteor.call("fixAllGPEvents");
    },
    "click .js-addStarCityGamesEvents" : function(evt, tmp){
        Meteor.call("getStarCityGamesEvents", tmp.options.get("format"));
    },
    "click .js-fixAllStarCityGamesByFormat" : function(evt, tmp){
        Meteor.call("fixAllStarCityGamesByFormat",  tmp.options.get("format"));
    },

})