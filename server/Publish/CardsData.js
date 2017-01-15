Meteor.publish("cardsFromArray", function(array){
    return CardsData.find({name : {$in : array}});
})

Meteor.publish("CardsDataFromDeckData_id", function(DecksData_id){
    var deck = DecksData.findOne({_id : DecksData_id});
    if(!deck) return null;
    var cards = [];
    cards = cards.concat(deck.main.map((card)=>{
        return card.name;
    }));
    cards = cards.concat(deck.sideboard.map((card)=>{
        return card.name;
    }));

    return CardsData.find({name : {$in : cards}});
})