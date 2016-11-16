Template.AdminEventsNew.helpers({
    selector : function(){
        var date = new Date();
        date.setDate(date.getDate() - 10);
        console.log(date);
        return {$and : [{$or : [{"validation.exists" : false, date : {$gte : date}}, {"validation.exists" : true}]}, {$or : [{"validation.htmlDownloaded" : null}, {"validation.extractDecks" : null}]}]};
    }
})

Template.AdminEventsNew.events({
    "click .js-addOldEvents" : function(){
        Meteor.call("methodEventLeagueGetInfoOld");
    },
    "click .js-getNew" : function(){
        Meteor.call("methodEventLeagueGetInfoNew");
    },
    "click .js-fixAllThings" : function(){
        Meteor.call("methodFixAllEvents");
    }
})