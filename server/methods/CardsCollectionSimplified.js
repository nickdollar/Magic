Meteor.methods({
    createCompliedCardCollection(){
        logFunctionsStart("createCompliedCardCollection");
        setCardNames();
        setManaCost();
        setLayout();
        setTypes();
        setPriceAvg();
        logFunctionsEnd("createCompliedCardCollection");
    },


    fixTcgPlayerCardsFullData(){
        logFunctionsStart("fixTcgPlayerCardsFullData")
        var sets = TCGPlayerCardsFullData.find().fetch();

        for(var i = 0; i < sets.length; i++){
            var cards = [];
            for(var j = 0; j < sets[i].cards.length; j++){
                var obj = Object.assign({}, sets[i].cards[j]);
                obj.hiprice = parseFloat(obj.hiprice);
                obj.lowprice = parseFloat(obj.lowprice);
                obj.avgprice = parseFloat(obj.avgprice);
                obj.foilavgprice = parseFloat(obj.foilavgprice);
                cards.push(obj);
            }
            TCGPlayerCardsFullData.update({name : sets[i].name},
                {
                    $set : {cards : cards}
                })
        }
        logFunctionsStart("fixTcgPlayerCardsFullData");

    },
    getCardsBy_id({CardsCollectionSimplified_id}){
        return CardsCollectionSimplified.find({_id : CardsCollectionSimplified_id}).fetch()[0];
    },
    getAutoCompleteCardsCollectiomSimplified(value){
        var regex = new RegExp("^" + value, "i");
        return CardsCollectionSimplified.find({name : {$regex : regex}}, {limit : 6, fields : {name : 1}}).fetch();
    }

})


setCardNames = ()=>{
    logFunctionsStart("setCardNames");

    var cards = CardsFullData.find({}).fetch();

    for(var i = 0; i < cards.length; i++){
        var name = fixCards(cards[i].name.toTitleCase());
        CardsCollectionSimplified.update({name : name},
            {
                $set : {name : name}
            },
            {
                upsert : true
            })
    }
    logFunctionsEnd("setCardNames");

}

setManaCost = ()=>{
    logFunctionsStart("setManaCost");

    var cards = CardsFullData.find({}).fetch();
    for(var i = 0; i < cards.length; i++){
        var manacost = cards[i].manaCost;
        var manaRegex = new RegExp("(?:B|C|G|R|U|W)?\/?(?:X|P|B|C|G|R|U|W|\\d+)(?=})", 'g');

        var str = [];
        var res;
        while((res = manaRegex.exec(manacost)) !== null) {
            str.push(res[0]);
        }
        CardsCollectionSimplified.update({name : cards[i].name},
            {
                $set : {manaCost : str}
            })
    }
    logFunctionsEnd("setManaCost");
}

setLayout = ()=>{
    logFunctionsStart("setLayout");

    var cards = CardsFullData.find({}).fetch();

    for(var i = 0; i < cards.length; i++){
        CardsCollectionSimplified.update({name : cards[i].name},
            {
                $set : {layout : cards[i].layout}
            })
    }
    logFunctionsEnd("setLayout");
}

// setColorsIdentity = ()=>{
//     logFunctionsStart("setColorsIdentity");
//
//     var cards = CardsFullData.find({}).fetch();
//
//     for(var i = 0; i < cards.length; i++){
//         CardsCollectionSimplified.update({name : cards[i].name},
//             {
//                 $set : {colorIdentity : cards[i].colorIdentity}
//             })
//     }
//     logFunctionsEnd("setColorsIdentity");
// }

setTypes = ()=>{
    logFunctionsStart("setTypes");
    var cards = CardsFullData.find({}).fetch();
    for(var i = 0; i < cards.length; i++){
        CardsCollectionSimplified.update({name : cards[i].name},
            {
                $set : {types : cards[i].types}
            })
    }
    logFunctionsEnd("setTypes");
}

setPriceAvg = ()=>{
    logFunctionsStart("setPriceAvg");
    var cards = TCGPlayerCardsFullData.aggregate(
        [
            {
                $unwind: {
                    path : "$cards"
                }
            },
            {
                $group: {
                    _id : "$cards.name",
                    avgprice : {$addToSet : "$cards.avgprice"},
                    foilavgprice : {$addToSet : "$cards.foilavgprice"}
                }
            },
            {
                $project: {
                    values  : {$filter : {

                        input :
                            {$setUnion :
                                [
                                    {$map : {input : "$avgprice", as : "el", in : "$$el"}},
                                    {$map : {input : "$foilavgprice", as : "el", in : "$$el"}},
                                ]
                            },
                        as : "num",
                        cond : {
                            $gt : ["$$num", 0]
                        }
                    }
                    }

                }
            },
            {
                $unwind: {
                    path : "$values"
                }
            },
            {
                $group: {
                    _id : "$_id",
                    avg : {$min : "$values"}
                }
            },
        ]
    );
    for(var i = 0; i < cards.length; i++){
        CardsCollectionSimplified.update({name : cards[i]._id},
            {
                $set : {avg : cards[i].avg ? cards[i].avg : 0}
            }
         )
    }
    logFunctionsEnd("setPriceAvg");
}

