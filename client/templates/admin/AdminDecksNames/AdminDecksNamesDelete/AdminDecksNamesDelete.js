Template.AdminDecksNamesDelete.events({
    "click .js-decksNamesDelete" : function(evt, tmp){
        Meteor.call("decksNamesDelete", $(evt.target).attr("doc"));
    }
});