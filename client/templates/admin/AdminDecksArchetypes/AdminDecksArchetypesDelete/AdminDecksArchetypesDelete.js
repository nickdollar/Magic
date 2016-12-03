Template.AdminDecksArchetypesDelete.events({
    "click .js-archetypeDelete" : function(evt, tmp){
        Meteor.call("archetypeDelete", $(evt.target).attr("doc"));
    }
});