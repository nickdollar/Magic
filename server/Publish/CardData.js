Meteor.publish("cardsFromArray", function(array){
    return CardsData.find({name : {$in : array}});
})