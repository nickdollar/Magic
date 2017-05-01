import moment from "moment";
import csv from "csvtojson";

Meteor.methods({
    createCardsCollectionMethod(){
        createCardsCollection();
        getCardsForEachSet();
        getCardsTCGForEachSet();
    },
    testTheGathererCards(){
        logFunctionsStart("testTheGathererCards");
        Gatherer.remove({});
            csv({
                delimiter : "||"
            }).fromFile('assets/app/gatherer.csv').on('json', Meteor.bindEnvironment((jsonObj)=>{
                    jsonObj._id = jsonObj.id;
                    jsonObj.number ? jsonObj.number = parseInt(jsonObj.number) : null;
                    Gatherer.insert(jsonObj);
            })).on("done", (error)=>{
                console.log("end")
            })
        logFunctionsEnd("testTheGathererCards");
    }
});









createCardsCollection = ()=>{
    logFunctionsStart("createCardsCollection");
    Cards.remove({});
    CardsFullData.find().forEach((card)=>{
        var data = {};
        var _id = getCard_id(card);

        data._id = _id;
        data.layout = card.layout ? card.layout : "error";
        data.names = createCardsNames({_id : _id, card : card});
        card.types ?            data.types = arrayLowercaseSorted(card.types) : null;
        card.tl ?               data.tl = card.type : null;
        card.subtypes ?         data.sbs = arrayLowercaseSorted(card.subtypes) : null;
        card.supertypes ?       data.sts = arrayLowercaseSorted(card.supertypes) : null;
        card.cmc ?              data.cmc = card.cmc : null;
        card.manaCost ?         data.mc = arrayLowercase(setCardManaCost({manaCost : card.manaCost})) : null;
        card.text ?             data.txt = card.text : null;
        card.colorIdentity ?    data.ci = arrayLowercaseSorted(card.colorIdentity) : null;
        card.power ?            data.pt = createCardsPowerToughnessNumber({card : card}) : null;
        card.power ?            data.ptt = [card.power, card.toughness] : null;
        card.rulings ?          data.rul = card.rulings.map((rule)=>{return {dt : moment(rule.date, "YYYY-MM-DD").toDate(), txt : rule.text}}) : null;
        Cards.update({_id : _id}, {$setOnInsert : data}, {upsert : 1})
    })
    logFunctionsEnd("createCardsCollection");
}

getCardsForEachSet = ()=>{
    logFunctionsStart("getCardsForEachSet");

    MTGSets.find({}).forEach((set)=>{
        set.cards.forEach((card)=>{
            if(card.variations){
                for(var i = 0; i < card.variations.length; i++){
                    Cards.update({_id : card.name},
                        {
                            $push : {ss : {r : card.rarity, s : set.code, id : card.variations[i]}}
                        })
                }
            }
            Cards.update({_id : card.name},
                {
                    $push : {p : {r : card.rarity, s : set.code, id : card.multiverseid}}
                })
        })
    })
}

getCardsTCGForEachSet = ()=>{
    logFunctionsStart("createCardsCollection");
        TCGPlayerCards.find({}).forEach((set)=>{
            set.cards.forEach((card)=>{
                Cards.update({_id : card.name},
                    {
                        $push : {pr : {r : card.rarity, s : set.name, tcg_id : card.id, fn : [card.normal, card.foil]}}
                    })
            })
        })
    logFunctionsStart("createCardsCollection");
}

createCardsNames = ({_id, card})=>{
    if(card.layout == "split"){
        card.names.unshift(_id);
    }else{
        if(!card.names){
            card.names = [_id]
        }
    }
    return card.names;
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

arrayLowercaseSorted = (array)=>{
    var sorted = [];
    array.forEach((item)=>{
        sorted.push(item.toLowerCase())
    })
    return sorted.sort();
}

arrayLowercase = (array)=>{
    var lowerCase = [];
    array.forEach((item)=>{
        lowerCase.push(item.toLowerCase())
    })
    return lowerCase;
}

getCard_id = (card)=>{
    var _id = card.name;
    if(card.layout == "split"){
        if(card.names.length == 2){
            _id = card.names.join(" // ");
        }else{
            _id = card.names.join("/");
        }
    }
    return _id;
}

setCardManaCost = ({manaCost})=>{
    var manaRegex = new RegExp("(?:B|C|G|R|U|W)?\/?(?:X|P|B|C|G|R|U|W|\\d+)(?=})", 'ig');

    var str = [];
    var res;
    while((res = manaRegex.exec(manaCost)) !== null) {
        str.push(res[0]);
    }
    return str;
}

createCardLegalities = ((card)=>{
    var legalities = card.legalities.map( legality=>{
        var format = Formats.findOne({names : legality.for})
    })
})


cardOrganize = ()=>{
    MTGSets.find().forEach((set)=>{
        set.cards.forEach((card)=>{
            var _id = getCard_id(card);

            // Cards.findOne({})
        })
    });
}