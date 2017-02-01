Meteor.methods({
    methodAddNameToDeck : function(data){
        removeNameFromDeck(data._id);
        addNameToDeck(data._id, data.DecksNames_id);

        var deckData = DecksData.findOne({_id : data._id});
        var cardsOnMain = [];

        deckData.main.forEach(function(obj){
            cardsOnMain.push(obj.name)
        });

        var nonLandsCards = CardsData.find({name : {$in : cardsOnMain}, land : false}).map(function(obj){
            return obj.name;
        });

        if(!DecksDataUniqueWithoutQuantity.find({format : deckData.format, nonLandMain : {$size : nonLandsCards.length, $all : nonLandsCards}}).count()){
            console.log("EQUAL");
        }

        DecksDataUniqueWithoutQuantity.update({format : deckData.format, nonLandMain : {$size : nonLandsCards.length, $all : nonLandsCards}},
        {$set : {DecksNames_id : deckData.DecksNames_id, format : deckData.format, nonLandMain : nonLandsCards}},
        {
            upsert : true
        });
        DecksData.update({_id : data._id},
            {
                $set : {state : "manual"}
            },
            {multi : true}
        )
    },
});

