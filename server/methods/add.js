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
                $unset : {autoNaming : 1, autoPercentage : 1}
            },
            {multi : true}
        )
    },

    methodAddNameToDeckAutomaticallyLessThan100 : function(format){
        console.log("START: methodAddNameToDeckAutomaticallyLessThan100")

        DecksData.find({format : format, eventType : {$in : ["league", "daily"]}, autoPercentage : {$lt : 1}}, {autoNaming : true}).forEach(function(deckData){
            var bestResult = findBestResultDeckComparison(deckData._id);
            console.log(deckData._id);
            console.log(bestResult);

            if(bestResult.result > 0.85 && bestResult.DecksNames_id){
                removeNameFromDeck(deckData._id);
                addNameToDeck(deckData._id, bestResult.DecksNames_id);
                DecksData.update({_id : deckData._id},
                    {
                        $set : {autoNaming : true, autoPercentage : bestResult.result}
                    })
            }
        });
        console.log("END: methodAddNameToDeckAutomaticallyLessThan100")
    },
    methodAddNameToDeckWithoutNameAutomaticallyLeagueDaily : function(format){
        console.log("START: methodAddNameToDeckWithoutNameAutomaticallyLeagueDaily")

        // DecksData.find({format : format, eventsType : {$in : ["league", "daily"]}, DecksNames_id : null}).forEach(function(deckData){
        //     var bestResult = findBestResultDeckComparison(deckData._id);
        //     console.log(deckData._id);
        //     console.log(bestResult);
        //
        //     if(bestResult.result > 0.85 && bestResult.DecksNames_id){
        //         removeNameFromDeck(deckData._id);
        //         addNameToDeck(deckData._id, bestResult.DecksNames_id);
        //         DecksData.update({_id : deckData._id},
        //             {
        //                 $set : {autoNaming : true, autoPercentage : bestResult.result}
        //             })
        //     }
        // });
        console.log("END: methodAddNameToDeckWithoutNameAutomaticallyLeagueDaily")
    },
    createAllCardsAndInfoDatabase : function(){

    }
});

