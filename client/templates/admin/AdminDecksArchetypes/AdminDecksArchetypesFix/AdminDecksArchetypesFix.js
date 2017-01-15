Template.AdminDecksArchetypesFix.events({
    "click .js-fixDecksArchetypesColorsAbbreviation" : function(){
        Meteor.call("fixArchetypesColorsAbbreviation");
    }
})