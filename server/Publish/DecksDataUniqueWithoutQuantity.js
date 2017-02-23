Meteor.publish('DecksDataUniqueWithoutQuantity-_id', function(_id) {
    return DecksDataUniqueWithoutQuantity.find({_id : _id});
});

addToDecksUniqueWithName = function(_id){
    var deckData = DecksData.findOne({_id : _id});
    var cardsOnMain = [];

    deckData.main.forEach(function(obj){
        cardsOnMain.push(obj.name)
    });

    var queryCards = CardsData.find({name : {$in : cardsOnMain}});
    if(cardsOnMain.length != queryCards.count()){
        console.log("A Card Doesn't Exists");
        return;
    }

    var nonLandsCards = CardsData.find({name : {$in : cardsOnMain}, land : false}).map(function(obj){
        return obj.name;
    });

    if(!DecksDataUniqueWithoutQuantity.find({format : deckData.format, nonLandMain : {$size : nonLandsCards.length, $all : nonLandsCards}}).count()){
        console.log("New Unique Deck");
    }else{
        console.log("Unique Deck Exists");
    }

    DecksDataUniqueWithoutQuantity.update({format : deckData.format, nonLandMain : {$size : nonLandsCards.length, $all : nonLandsCards}},
        {$set : {DecksNames_id : deckData.DecksNames_id, format : deckData.format, nonLandMain : nonLandsCards}},
        {
            upsert : true
        });
}