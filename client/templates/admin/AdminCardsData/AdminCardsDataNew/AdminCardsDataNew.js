Template.AdminCardsDataNew.helpers({

})

Template.AdminCardsDataNew.events({
    "click .js-parseAllCards" : function(){
        Meteor.call("methodsCardsData");
    }
})