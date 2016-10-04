Template.eventAuditHeader.events({
    "click .js-addOldEvents" : function(){
        Meteor.call("methodEventLeagueGetInfoOld");
    },
    "click .js-getNew" : function(){
        Meteor.call("methodEventLeagueGetInfoNew");
    },
    "click .js-fixAllThings" : function(){
        Meteor.call("methodFixAllEvents");
    },
});