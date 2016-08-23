Template.eventAuditHeader.events({
    "click .js-addOldEvents" : function(){
        Meteor.call("methodEventLeagueGetInfoOld");
    },
    "click .js-getNew" : function(){
        Meteor.call("methodEventLeagueGetInfoNew");
    }
});