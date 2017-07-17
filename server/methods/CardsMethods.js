import moment from "moment";
import csvtojson from "csvtojson";
import jsonlint from "jsonlint";

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
    AddNewCardsFromGathererMethod(){
        console.log("START: AddNewCardsFromGathererMethod");
        Gatherer.find({}).forEach((card)=>{
            if(!Cards.find({_id : new RegExp(`^${card.name}`, "i")}, {limit : 1}).count()){
                console.log(card.name, card.id, card.set);
            }
        })
        console.log("   END: AddNewCardsFromGathererMethod");
    },
    AddNewCardsPrintingsFromGathererMethod(){
        console.log("START: AddNewCardsPrintingsFromGathererMethod");
            Gatherer.find({set : {$nin : ["Prerelease Events", 'Planechase "Planes"']}}).forEach((card)=>{
                if(!Cards.find({"printings.multiverseid" : card._id}, {limit : 1}).count()){
                    console.log(card.name, card.id, card.set);
                    var foundSet = Sets.findOne({gatherer : card.set});
                    console.log(Cards.update({_id : card.name, "printings.multiverseid" : {$ne : card._id}},
                        {
                            $push : {printings : {multiverseid : card._id, set : card.set, TCGSet : foundSet.TCG, setCode : foundSet._id}}
                        }
                    ))
                }
            })
        console.log("   END: AddNewCardsPrintingsFromGathererMethod ");
    },
    addNumbersToCardsPrintingsMethod(){
        logFunctionsStart("addNumbersToCardsPrintingsMethod");
            Gatherer.find({}).forEach((card)=>{
                Cards.update({printings : {$elemMatch : {multiverseid : card._id, number : null}}},
                    {
                        $set : {"printings.$.number" : parseInt(card.number)}
                    })
            })
        logFunctionsEnd("addNumbersToCardsPrintingsMethod");
    },
    AddTCGCardsMethod(){
        console.log("START: AddStarcityGamesCardsMethod");
        TCGCards.find().forEach((card)=>{
            if(Cards.find({_id : card.TCGName, printings : {$elemMatch : {TCGSet : card.TCGSet, TCGName : {$exists : false}}}}, {limit : 1}).count()){
                console.log(card.TCGName, card.TCGSet);
                console.log(Cards.update({_id : card.TCGName, printings : {$elemMatch : {TCGSet : card.TCGSet, TCGName : null}}},
                    {
                        $set : {"printings.$.TCGName" : card.TCGName, "printings.$.tcg_id" : card._id}
                    }
                ))
            }
        })
        console.log("   END: AddStarcityGamesCardsMethod");
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
    giveNamesToLandsMethod(){
        logFunctionsStart("giveNamesToLandsMethod");
        Cards.find({_id : {$in : ["Island", "Forest", "Plains", "Mountain", "Swamp"]}}).forEach((card)=>{
            for(var i = 0; i < card.printings.length; i++){
                if(card.printings[i].set){
                    var foundSet = Sets.findOne({gatherer : card.printings[i].set});
                    var foundLand = TCGCards.findOne({TCGSet : foundSet.TCG, TCGName : `${card._id} (${card.printings[i].number})`});
                    if(foundLand){
                        Cards.update({_id : card._id, "printings.multiverseid" : card.printings[i].multiverseid},
                            {
                                $set : {"printings.$.TCGName" : foundLand.TCGName, "printings.$.TCGSet" : foundLand.TCGSet, "printings.$.tcg_id" : foundLand._id }
                            });
                    }
                }
            }
        });
        logFunctionsEnd("giveNamesFromNormalMethod");
    },
    getCardsInfoFromCards_id({cards}){
        console.log("getCardsInfoFromCards_id");
        var cardsRegex = cards.map((card)=>{
            return new RegExp(`^${card}$`);
        })

        var cardsInfo = CardsSimple.aggregate(
            [
                {
                  $match : {
                      _id : {$in : cardsRegex}
                  }
                },
            ]
        );
        return cardsInfo;
    },
    giveLatestPriceForEachPrintingsMethod(){
        giveLatestPriceForEachPrintings();
    },
    giveLatestPriceForEachMethod(){
            giveLatestPriceForEach();
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
    giveTCGCards_id(){
        logFunctionsStart("giveTCGCards_id");
          TCGCards.find({}).forEach((card)=>{
              var result =Cards.update({printings : {$elemMatch : {TCGName : card.TCGName, TCGSet : card.TCGSet}}},
                  {
                      $set : {"printings.$.TCGCards_id" : card._id},
                      $unset : {"printings.$.tcg_id" : ""}
                  })

              if(result == 0){
                  console.log(card.TCGName, card.TCGSet);
              }
          })
        logFunctionsEnd("giveTCGCards_id");
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
            giveLatestPriceForEachPrintings();
            UpdateCardsSimple();
            makeCardsUnique();
            cardsUniquesPrices();
        logFunctionsEnd("organizeAllCardsDatabase");
    },
    updateCardsSimpleAndCardsUniqueCollections(){

    },
    cardsRemoveNaN(){
        Cards.find({}).
    }
});


createCardsCollection = ()=>{
    logFunctionsStart("createCardsDatabase");
    var cards = jsonlint.parse(Assets.getText("CardsArray2.json"));
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

giveLatestPriceForEachPrintings = ()=>{
    logFunctionsStart("giveLatestPriceForEach");
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    console.log(date);
    TCGDailyPrices.find({date : date}).forEach((card)=>{
        Cards.update({"printings.TCGCards_id" : card.TCGCards_id},
            {
                $set : {"printings.$.priceDate" : date, "printings.$.avgprice" : card.avg},
            })
    });
    logFunctionsEnd("giveLatestPriceForEach");
}

giveLatestPriceForEach = ()=>{
    logFunctionsStart("giveLatestPriceForEach");
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    var cardsPrices = TCGDailyPrices.aggregate(
        [
            {
                $match: {
                    date : date
                }
            },
            {
                $lookup: {
                    "from" : "TCGCards",
                    "localField" : "TCGCards_id",
                    "foreignField" : "_id",
                    "as" : "info"
                }
            },
            {
                $unwind: {
                    path : "$info",
                }
            },
            {
                $project: {
                    _id : "$TCGCards_id",
                    avg : 1,
                    foil : 1,
                }
            },
            {
                $lookup: {
                    "from" : "Cards",
                    "localField" : "_id",
                    "foreignField" : "printings.TCGCards_id",
                    "as" : "card"
                }
            },
            {
                $unwind: {
                    path : "$card",
                }
            },

            {
                $project: {
                    prices : [{$ifNull : ["$avg",0]}, {$ifNull : ["$foil",0]}],
                    Cards_id : "$card._id"
                }
            },

            {
                $unwind: {
                    path : "$prices",
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
                    avg : {$min : "$prices"}
                }
            },
        ],
    );


    for(var i = 0; i < cardsPrices.length; i++){
        Cards.update({_id : cardsPrices[i]._id},
            {
                $set : {avgPrice : cardsPrices[i].avg}
            })
    }
    logFunctionsEnd("giveLatestPriceForEach");
}