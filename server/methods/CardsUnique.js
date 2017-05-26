Meteor.methods({
    makeCardsUnique(){
        logFunctionsStart("makeCardsUnique");
            makeCardsUnique();
        logFunctionsEnd("makeCardsUnique");
    },
    cardsUniquesPricesMethod(){
        cardsUniquesPrices();
    }
})


cardsUniquesPrices = ()=>{
    logFunctionsStart("cardsUniquesPrices");
    TCGPrices.find().forEach((tcgprice)=>{
        if(tcgprice.product){
            CardsUnique.update({TCGSet : tcgprice.setName, TCGName : tcgprice.cardName},
                {
                    $set : {avgprice : tcgprice.product.avgprice, foilavgprice : tcgprice.product.foilavgprice}
                }
            );
        }
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
                    colorIdentity : "$colorIdentity"
                }
            }
        ])

        for(var i = 0; i < cardsAggregate.length; i++){
            CardsUnique.update({_id : cardsAggregate[i]._id},
                {
                    $set : cardsAggregate[i]
                },
                {
                    upsert : true
                }
            );
        }
    logFunctionsEnd("makeCardsUnique");
}