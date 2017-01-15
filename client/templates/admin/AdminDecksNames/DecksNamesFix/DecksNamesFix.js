Template.AdminDecksNamesFix.events({
    "click .js-fixDecksNamesColorsAbbreviation" : function(){
        console.log("TTTTTTTTTTTTTTTTTT");
        Meteor.call("fixDecksNamesColorsAbbreviation");
    }
})