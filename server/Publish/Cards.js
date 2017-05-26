Meteor.publish("cardsFromArray", function(array){
    return Cards.find({_id : {$in : array}});
})

Meteor.publish("CardsFromDeckData_id", function(DecksData_id){
    var deck = DecksData.findOne({_id : DecksData_id});
    if(!deck) return null;
    var cards = [];
    cards = cards.concat(deck.main.map((card)=>{
        return card.name;
    }));
    cards = cards.concat(deck.sideboard.map((card)=>{
        return card.name;
    }));

    return Cards.find({_id : {$in : cards}});
})

Meteor.publish("CardsFromDeckData_id_NonReactive", function(DecksData_id){
    var deck = DecksData.findOne({_id : DecksData_id});
    if(!deck) return null;
    var cards = [];
    cards = cards.concat(deck.main.map((card)=>{
        return card.name;
    }));
    cards = cards.concat(deck.sideboard.map((card)=>{
        return card.name;
    }));

    return Cards.find({_id : {$in : cards}});
})