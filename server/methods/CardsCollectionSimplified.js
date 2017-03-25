Meteor.methods({


    //fields

    //
    getCardsByName(){

    },
    createCompliedCardCollection(){
        console.log("START: createCompliedCardCollection");
        setCardNames();
        setManaCost();
        setLayout();
        setTypes();
        setPriceAvg();
        console.log("   END: createCompliedCardCollection");
    },


    fixTcgPlayerCardsFullData(){
        // console.log("START : fixtcg")
        // var sets = TCGPlayerCardsFullData.find().fetch();
        //
        // for(var i = 0; i < sets.length; i++){
        //     var cards = [];
        //     for(var j = 0; j < sets[i].cards.length; j++){
        //         var obj = Object.assign({}, sets[i].cards[j]);
        //         obj.hiprice = parseFloat(obj.hiprice);
        //         obj.lowprice = parseFloat(obj.lowprice);
        //         obj.avgprice = parseFloat(obj.avgprice);
        //         obj.foilavgprice = parseFloat(obj.foilavgprice);
        //         cards.push(obj);
        //     }
        //     TCGPlayerCardsFullData.update({name : sets[i].name},
        //         {
        //             $set : {cards : cards}
        //         })
        // }
        // console.log("   END : fixtcg")

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
    console.log("START: setCardNames");

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
    console.log("   END: setCardNames");

}

setManaCost = ()=>{
    console.log("START: setManaCost");

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
    console.log("   END: setManaCost");
}

setLayout = ()=>{
    console.log("START: setLayout");

    var cards = CardsFullData.find({}).fetch();

    for(var i = 0; i < cards.length; i++){
        CardsCollectionSimplified.update({name : cards[i].name},
            {
                $set : {layout : cards[i].layout}
            })
    }
    console.log("   END: setLayout");
}

// setColorsIdentity = ()=>{
//     console.log("START: setColorsIdentity");
//
//     var cards = CardsFullData.find({}).fetch();
//
//     for(var i = 0; i < cards.length; i++){
//         CardsCollectionSimplified.update({name : cards[i].name},
//             {
//                 $set : {colorIdentity : cards[i].colorIdentity}
//             })
//     }
//     console.log("   END: setColorsIdentity");
// }

setTypes = ()=>{
    console.log("START: setTypes");
    var cards = CardsFullData.find({}).fetch();
    for(var i = 0; i < cards.length; i++){
        CardsCollectionSimplified.update({name : cards[i].name},
            {
                $set : {types : cards[i].types}
            })
    }
    console.log("   END: setTypes");
}

setPriceAvg = ()=>{
    console.log("START: setPriceAvg");
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
    console.log("   END: setPriceAvg");
}

