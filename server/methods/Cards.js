import moment from "moment";
import csvtojson from "csvtojson";

Meteor.methods({
    // createCardsCollectionFromGatherer(){
    //     logFunctionsStart("createCardsCollectionFromGatherer");
    //     Gatherer.find().forEach((card)=>{
    //         var data = {};
    //         // foundCard  ? data.layout = foundCard.layout : null;
    //         // foundCard  ? foundCard.names ?  data.names = foundCard.names : null : null;
    //
    //         // card.type ?                 data.types = arrayLowercaseSorted(getTypesRegex({card : card})) : null;
    //
    //         // card.tl ?                data.tl = card.type : null;
    //         // card.subtypes ?          data.sbs = arrayLowercaseSorted(card.subtypes) : null;
    //         // card.supertypes ?        data.sts = arrayLowercaseSorted(card.supertypes) : null;
    //         // card.cmc ?               data.cmc = card.cmc : null;
    //         card.manacost ?             data.manaCost = arrayLowercase(setCardManaCost({manaCost : card.manacost})) : null;
    //         // card.text ?              data.txt = card.text : null;
    //         // card.color_identity ?       data.colorIdentity = arrayLowercaseSorted(getColorIdentity({card : card})) : null;
    //         // card.power ?             data.pt = createCardsPowerToughnessNumber({card : card}) : null;
    //         // card.power ?             data.ptt = [card.power, card.toughness] : null;
    //         // card.rulings ?           data.rul = card.rulings.map((rule)=>{return {dt : moment(rule.date, "YYYY-MM-DD").toDate(), txt : rule.text}}) : null;
    //
    //         if(!isObjectEmpty(data)){
    //             Cards.update({_id : new RegExp(`^${card.name}`, "i")}, {$set : data});
    //         }
    //
    //     })
    //     logFunctionsEnd("createCardsCollectionFromGatherer ");
    // },
    giveNamesFromSplitsMethod(){
        Cards.find({layout : "split"}).forEach((card)=>{
            var names = [card._id];
            var nameRegex = /\b\w+\b/g;
            var res;
            while((res = nameRegex.exec(card._id)) !== null) {
                names.push(res[0]);
            }
            Cards.update({_id : card._id},
                {
                    $set : {names : names}
                })
        });
    },
    giveNamesFromNormalMethod(){
        logFunctionsStart("giveNamesFromNormalMethod");
        Cards.find({layout : {$in : ["scheme","leveler", "plane", "phenomenon", "token"]}}).forEach((card)=>{
            Cards.update({_id : card._id},
                {
                    $set : {names : [card._id]}
                })
        });
        logFunctionsEnd("giveNamesFromNormalMethod");
    },
    giveLatestPriceForEach(){
        logFunctionsStart("giveLatestPriceForEach");
        var cardsPrices = TCGPrices.aggregate(

            [{$project: {
                        Cards_id : 1,
                        prices : [{$ifNull : ["$product.avgprice",0]}, {$ifNull : ["$product.foilavgprice",0]}]
                    }},
                {
                    $unwind: {
                        path : "$prices"
                    }
                },
                {
                    $match: {
                        prices : {$ne : 0}
                    }
                },
                {
                    $group: {
                        _id : "$Cards_id",
                        avgPrice : {$min : "$prices"},

                    }
                },
            ]
        );

        for(var i=0; i < cardsPrices.length; i++){

            Cards.update({_id : cardsPrices[i]._id},
                {
                    $set : {avgPrice : cardsPrices[i].avgPrice}
                })
        }
        logFunctionsEnd("giveLatestPriceForEach");
    },
    // addFoilOrNormal(){
    //       TCGPrices.find({}).forEach((card)=>{
    //
    //         if(card.product){
    //
    //         }else{
    //             console.log("not product");
    //         }
    //           // Cards.update({_id : card.Cards_id, "printings.set" : card.setName},
    //           //     {
    //           //         $set : {"printings.$."}
    //           //     })
    //       });
    // },
    getCardsListMethod({value}){
        return Cards.find({_id : new RegExp(`^${value}`, 'i')}, {limit : 5, fields : {printings : 1}}).fetch();
    },
    addSetCodeToCards(){
        Sets.find({}).forEach((set)=>{
            Cards.update({"printings.set" : set.gatherer},
                {
                    $set : {"printings.$.setCode" : set._id}
                },
                {
                    multi : true
                }
            )
        })
    },
    createCardsCollectionMethod(){
        createCardsCollection();
    },
    organizeAllCardsDatabaseMethod(){
        logFunctionsStart("organizeAllCardsDatabase");
        createCardsCollection();
        giveLatestPriceForEach();
        UpdateCardsSimple();
        makeCardsUnique();
        cardsUniquesPrices();
        logFunctionsEnd("organizeAllCardsDatabase");
    }
});


createCardsCollection = ()=>{
    logFunctionsStart("createCardsDatabase");
    var cards = JSON.parse(Assets.getText("CardsArray.json"));
    for(var i = 0; i < cards.length; i++){
        var object = Object.assign({}, cards[i]);
        delete object._id;
        Cards.update({_id : cards[i]._id},
            {
                $setOnInsert : {_id : cards[i]._id},
                $set : object
            },
            {
                upsert : true
            })
    }
    logFunctionsEnd("createCardsDatabase");
}

createCardsPowerToughness = ({card})=>{
    return [card.power, card.toughness];
}

createCardsPowerToughnessNumber = ({card})=>{
    var numberMatch = new RegExp("-?.?\\d+(?:.\\d+)?", "i");
    var powerMatch = parseFloat(card.power.match(numberMatch));
    var toughnessMatch = parseFloat(card.toughness.match(numberMatch));

    if(isNaN(powerMatch)){
        powerMatch = 0;
    }

    if(isNaN(toughnessMatch)){
        toughnessMatch = 0;
    }
    return [powerMatch, toughnessMatch];
}

setCardManaCost = ({manaCost})=>{
    var manaRegex = /(?:(?:X|P|B|C|G|R|U|W|\d+)(?:B|C|G|R|U|W)?|\/\/)/ig;
    var mana = manaCost;
    var str = [];
    var res;
    while(res = manaRegex.exec(manaCost)) {
        str.push(res[0]);
    }
    return str;
}

getTypesRegex = ({card})=>{
    var type = card.type;
    var types = [];
    var typesRegex = new RegExp("Artifact|Creature|Enchantment|Land|Planeswalker|Instant|Sorcery|Scheme|Plane|Conspiracy|Phenomenon|Tribal|Vanguard", "ig");
    var res;
    while ((res = typesRegex.exec(type)) !== null) {
        types.push(res[0]);
    }
    return types;
}

getColorIdentity = ({card})=>{
    var colorIdentity = card.color_identity;
    var colorIdentities = [];
    var typesRegex = new RegExp("B|G|R|U|W", "ig");
    var res;
    while ((res = typesRegex.exec(colorIdentity)) !== null) {
        colorIdentities.push(res[0]);

    }
    return colorIdentities;
}


giveLatestPriceForEach = ()=>{
    logFunctionsStart("giveLatestPriceForEach");
    var cardsPrices = TCGPrices.aggregate(

        [{$project: {
            Cards_id : 1,
            prices : [{$ifNull : ["$product.avgprice",0]}, {$ifNull : ["$product.foilavgprice",0]}]
        }},
            {
                $unwind: {
                    path : "$prices"
                }
            },
            {
                $match: {
                    prices : {$ne : 0}
                }
            },
            {
                $group: {
                    _id : "$Cards_id",
                    avgPrice : {$min : "$prices"},

                }
            },
        ]
    );

    for(var i=0; i < cardsPrices.length; i++){

        Cards.update({_id : cardsPrices[i]._id},
            {
                $set : {avgPrice : cardsPrices[i].avgPrice}
            })
    }
    logFunctionsEnd("giveLatestPriceForEach");
}