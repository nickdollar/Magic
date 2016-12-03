Template.AdminEventsDelete.events({
    "click .js-eventDelete" : function(evt, tmp){
        Meteor.call("eventDelete", $(evt.target).attr("doc"));
    }
});