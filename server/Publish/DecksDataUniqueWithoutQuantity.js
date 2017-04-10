removeToDecksUniqueWithName = function(_id){
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

    DecksDataUniqueWithoutQuantity.remove({format : deckData.format, nonLandMain : {$size : nonLandsCards.length, $all : nonLandsCards}})
}

CreateTheCardList = function(DecksNames_id){
    var cards = DecksNames.aggregate(
        [
            {$match: {_id : "atZiGY27D2P9wZyHS"}},
            {$lookup: {
                    "from" : "DecksData",
                    "localField" : "_id",
                    "foreignField" : "DecksNames_id",
                    "as" : "DecksData"}},
            {$unwind: {path : "$DecksData"}},
            {$project: {main : "$DecksData.main"}},
            {$unwind: {path : "$main",}},
            {$group: {_id : "$_id",cards : {$addToSet : "$main.name"}}}
        ]
    );
    DecksNames.update({_id : DecksNames_id},
        {
            $set : {cards : cards.cards}
        })
}


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