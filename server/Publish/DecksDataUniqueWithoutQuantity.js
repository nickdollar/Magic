removeToDecksUniqueWithName = function(_id){
    var deckData = DecksData.findOne({_id : _id});
    var cardsOnMain = [];

    deckData.main.forEach(function(obj){
        cardsOnMain.push(obj.name)
    });

    var queryCards = Cards.find({_id : {$in : cardsOnMain}});
    if(cardsOnMain.length != queryCards.count()){
        console.log("A Card Doesn't Exists 2");
        return;
    }

    var nonLandsCards = Cards.find({_id : {$in : cardsOnMain}, land : false}).map(function(obj){
        return obj.name;
    });
    DecksDataUniqueWithoutQty.remove({Formats_id : deckData.Formats_id, nonLandMain : {$size : nonLandsCards.length, $all : nonLandsCards}})
}

addToDecksUniqueWithName = function({DecksData_id, DecksArchetypes_id}){
    var deckData = DecksData.findOne({_id : DecksData_id});
    var cardsOnMain = [];

    deckData.main.forEach(function(obj){
        cardsOnMain.push(obj.name)
    });

    cardsOnMain = cardsOnMain.sort();

    var queryCards = Cards.find({_id : {$in : cardsOnMain}}, {fields : {_id : 1}}).fetch();

    if(cardsOnMain.length != queryCards.length){
        console.log("A Card Doesn't Exists. addToDecksUniqueWithName ");
        return;
    }

    var nonLandsCards = Cards.find({_id : {$in : cardsOnMain}, types : {$ne : "land"}}).map(function(obj){
        return obj._id;
    });

    DecksDataUniqueWithoutQty.update({format : deckData.Formats_id, nonLandMain : {$size : nonLandsCards.length, $all : nonLandsCards}},
    {
        $setOnInsert : {DecksArchetypes_id : DecksArchetypes_id, nonLandMain : nonLandsCards}
    },
    {
     upsert : true
    })
}