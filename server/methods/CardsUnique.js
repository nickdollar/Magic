Meteor.methods({
    makeCardsUniqueMethod(){
        makeCardsUnique();
    },
    cardsUniquesPricesMethod(){
        cardsUniquesPrices();
    },
})



cardsUniquesPrices = ()=>{
    logFunctionsStart("cardsUniquesPrices");
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    TCGDailyPrices.find({date: date}).forEach((TCGDailyPrice)=>{
        var updated = CardsUnique.update({TCGCards_id : TCGDailyPrice.TCGCards_id},
            {
                $set : {avgprice : TCGDailyPrice.avg, avgfoilprice : TCGDailyPrice.foil, datePrice : date}
            }
        );
    })
    logFunctionsEnd("cardsUniquesPrices");
}

makeCardsUnique = ()=>{
    logFunctionsStart("makeCardsUnique");
        var cardsAggregate = Cards.aggregate([
            {
                $unwind : "$printings"
            },
            {
                $project : {
                    _id : "$printings.multiverseid",
                    name : "$_id",
                    setCode : "$printings.setCode",
                    set : "$printings.set",
                    TCGName : "$printings.TCGName",
                    TCGSet : "$printings.TCGSet",
                    rarity : "$printings.rarity",
                    foil : "$printings.foil",
                    normal : "$printings.normal",
                    colorIdentity : "$colorIdentity",
                    TCGCards_id : "$printings.TCGCards_id"
                }
            }
        ])

        for(var i = 0; i < cardsAggregate.length; i++){
            var update = CardsUnique.update({_id : cardsAggregate[i]._id},
                {
                    $set : cardsAggregate[i]
                },
                {
                    upsert : true
                }
            );

            if(update == 0){
                console.log(cardsAggregate[i]._id);
            }
        }
    logFunctionsEnd("makeCardsUnique");
}