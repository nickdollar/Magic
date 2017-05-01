import csv from "csvtojson";
import Fuse from "fuse.js";

Meteor.methods({
    testInsert(){
        console.log("AAAAAAAAAAAA");
        CardsSimple.update({_id : "AAA", blah : 'query', bbb : "query", aaa : "query"},
            {
                $setOnInsert : {aaa : "setOnInsert"},
                $set : {blah : "set"},
            },
            {upsert : true}
        )
    },

    AddAllCardsToCardsMakeCards(){
        console.log("AAAAAAAAAAAAAAAAa");
        AllCards.find({}).forEach((card)=>{

            var arrayOfCards = [];
            console.log(card.types.length);
            for(var i = 0; i < card.types.length; i++){
                var tempCard = {};
                card.types[i].multiverseid ?    tempCard.multiverseid = card.types[i].multiverseid: null;
                card.types[i].gathererSet ?     tempCard.set =          card.types[i].gathererSet: null;
                card.types[i].TCGName ?         tempCard.TCGName =      card.types[i].TCGName: null;
                card.types[i].gathererRarity ?  tempCard.rarity =       card.types[i].gathererRarity: null;
                card.types[i].TCGSet ?          tempCard.TCGSet =       card.types[i].TCGSet: null;
                card.types[i].extra ?           tempCard.extra =        card.types[i].extra: null;
                arrayOfCards.push(tempCard);
            }

            Cards.update({_id : card._id},
                {
                    $setOnInsert : {printings : arrayOfCards},
                },
                {
                    upsert : true
                }

            );


        })
        console.log("BBBBBBBBBBBBBBB");

    },

    createCardsCollectionFromGatherer(){
        logFunctionsStart("createCardsCollectionFromGatherer");
        Gatherer.find().forEach((card)=>{
            var data = {};
            var foundCard = CardsFullData.findOne({name : new RegExp(`^${card.name}`, "i")});

            if(foundCard){
                console.log("AAAAAAAAAAAAA");
            }
            foundCard  ? data.layout = foundCard.layout : null;
            foundCard  ? foundCard.names ?  data.names = foundCard.names : null : null;

            card.type ?                 data.types = arrayLowercaseSorted(getTypesRegex({card : card})) : null;

            // card.tl ?                data.tl = card.type : null;
            // card.subtypes ?          data.sbs = arrayLowercaseSorted(card.subtypes) : null;
            // card.supertypes ?        data.sts = arrayLowercaseSorted(card.supertypes) : null;
            // card.cmc ?               data.cmc = card.cmc : null;
            card.manacost ?             data.manaCost = arrayLowercase(setCardManaCost({manaCost : card.manacost})) : null;
            // card.text ?              data.txt = card.text : null;
            card.color_identity ?       data.colorIdentity = arrayLowercaseSorted(getColorIdentity({card : card})) : null;
            // card.power ?             data.pt = createCardsPowerToughnessNumber({card : card}) : null;
            // card.power ?             data.ptt = [card.power, card.toughness] : null;
            // card.rulings ?           data.rul = card.rulings.map((rule)=>{return {dt : moment(rule.date, "YYYY-MM-DD").toDate(), txt : rule.text}}) : null;

            if(!isObjectEmpty(data)){
                Cards.update({_id : new RegExp(`^${card.name}`, "i")}, {$set : data});
            }

        })
        logFunctionsEnd("createCardsCollectionFromGatherer ");
    },
    addTypes(){
        logFunctionsStart("addTypes");
        Gatherer.find().forEach((card)=>{
            var data = {};
            card.type ?                 data.types = arrayLowercaseSorted(getTypesRegex({card : card})) : null;
            console.log(data);
            if(!isObjectEmpty(data)){
                Cards.update({_id : card.name}, {$set : data});
            }
        })
        logFunctionsEnd("addTypes");
    }

    // SCGCards(){
    //     logFunctionsStart("SCGCards");
    //         SCGCards.remove({});
    //         csv({
    //             delimiter : ","
    //         }).fromFile('assets/app/scgpaginationcards.csv').on('json', Meteor.bindEnvironment((jsonObj)=>{
    //             SCGCards.insert(jsonObj);
    //         })).on("done", (error)=>{
    //             console.log("end")
    //         })
    //     logFunctionsEnd("SCGCards");
    // },
    // AllCards(){
        // logFunctionsStart("AllCards");
        //     console.log(" Start Gatherer");
        //     Gatherer.find({}).forEach((card)=>{
        //         var data = {multiverseid : card._id.toTitleCase(), gatheredName : card.name, gathererRarity : card.rarity, gathererSet : card.set};
        //
        //         AllCards.update({_id : card.name.toTitleCase()},
        //             {
        //                 $setOnInsert : {types : [data]}
        //             },
        //             {
        //                 upsert : true
        //             });
        //
        //         AllCards.update({_id : card.name.toTitleCase(), types : {$not : {$elemMatch : {gathererSet : card.set, multiverseid : card._id}}}},
        //             {
        //                 $push : { types : data}
        //             }
        //             );
        //     });
        //     console.log("TCGCards");
        //     TCGCards.find({}).forEach((card)=>{
        //         var cardRegex = /(.+) \(.+\)/;
        //         var cardMatch = card.name.match(cardRegex);
        //         var cardName = card.name;
        //         if(cardMatch){cardName = cardMatch[1]}
        //         var foundSet = Sets.findOne({TCG : card.set})
        //         if(foundSet){
        //             var data = {gathererSet : foundSet.gatherer, TCGName: card.name, TCGRarity: card.rarity, TCGSet: card.set};
        //             var arrayData = {"types.$.gathererSet" : foundSet.gatherer,  "types.$.TCGName": card.name, "types.$.TCGRarity": card.rarity, "types.$.TCGSet": card.set};
        //
        //             AllCards.update({_id: cardName, "types.gathererSet" : foundSet.gatherer, "types.gatheredName" : cardName},
        //                 {
        //                     $set: arrayData,
        //                 });
        //
        //             AllCards.update({_id: cardName, types : {$not : {$elemMatch : {TCGSet : card.set, TCGName : cardName}}}},
        //                 {$push: {types: data}});
        //
        //         }else{
        //             var data = {TCGName: card.name, TCGRarity: card.rarity, TCGSet: card.set};
        //             var arrayData = {"types.$.TCGName": card.name, "types.$.TCGRarity": card.rarity, "types.$.TCGSet": card.set}
        //
        //             AllCards.update({
        //                     _id: cardName, types : {$not : {$elemMatch : {TCGSet : card.set, TCGName : cardName}}}
        //                 },
        //                 {$push: {types: data}});
        //         }
        //     })
        //     console.log("extras");
        //     TCGCards.find({}).forEach((card)=>{
        //         var cards = AllCards.find({"types.TCGName" : card.name.toTitleCase()}, {limit : 1}).fetch();
        //
        //         if(!cards.length){
        //             Temp.insert(card);
        //         }
        //

            // })



        // console.log(" Start SCG");

        // SCGCards.find({}).forEach((card)=> {
        //         if (card.name) {
        //             var set = card.edition;
        //
        //             var data = {SCGName: card.name, SCGSet: set, SCGRarity: card.rarity};
        //             var dataArray = {"types.$.SCGName": card.name, "types.$.SCGSet": set, "types.$.SCGRarity": card.rarity};
        //
        //             var setMatch = set.match(/(.*) \(Foil\)/i);
        //             if(setMatch){
        //                 set = setMatch[1];
        //                 data = {SCGName: card.name, SCGSet : set, SCGFoilSet: card.edition, SCGRarity: card.rarity};
        //                 dataArray = {"types.$.SCGName": card.name, "types.$.SCGSet": set, "types.$.SCGFoilSet": card.edition, "types.$.SCGRarity": card.rarity};
        //             }
        //
        //             var foundSet = Sets.findOne({SCG : set});
        //
        //             if(foundSet){
        //                 data = {gathererSet : foundSet.gatherer, SCGName: card.name, SCGSet : set, SCGFoilSet: card.edition, SCGRarity: card.rarity};
        //                 dataArray = {"types.$.gathererSet" : foundSet.gatherer, "types.$.SCGName": card.name, "types.$.SCGSet": set, "types.$.SCGFoilSet": card.edition, "types.$.SCGRarity": card.rarity};
        //
        //                 AllCards.update({_id: card.name},
        //                     {
        //                         $setOnInsert: {_id: card.name, types: [data]},
        //                     },
        //                     {
        //                         upsert: true
        //                     });
        //
        //                 AllCards.update({_id: card.name, "types.gathererSet": foundSet.gatherer},
        //                     {
        //                         $set: dataArray,
        //                     });
        //
        //                 AllCards.update({_id: card.name, "types.gathererSet": {$ne : foundSet.gatherer}},
        //                     {
        //                         $push: {types : data},
        //                     });
        //             }else{
        //                 AllCards.update({_id: card.name},
        //                     {
        //                         $setOnInsert: {_id: card.name, types: [data]},
        //                     },
        //                     {
        //                         upsert: true
        //                     });
        //
        //
        //                 AllCards.update({_id: card.name, "types.SCGSet": set},
        //                     {
        //                         $set: dataArray,
        //                     });
        //
        //                 AllCards.update({_id: card.name, "types.SCGSet": {$ne : set}},
        //                     {
        //                         $push: {types : data},
        //                     });
        //             }
        //         }
        //     })

        // logFunctionsEnd("AllCards");
    // },
    // giveSetsSCGNames(){
    //
    //     var editions = SCGCards.aggregate([
    //     {
    //         $group : {
    //             _id : "$edition"
    //         }
    //     }]);
    //
    //     console.log(editions);
    //
    //     var allSets = Sets.find({}, {fields : {n : 1}}).fetch();
    //
    //
    //     var options = {
    //         keys : ["n"],
    //         id : "n",
    //         threshold : 0.4
    //     }
    //
    //     var fuse = new Fuse(allSets, options);
    //
    //     editions.forEach((edition)=>{
    //
    //         if(!edition._id){return;}
    //         var set = edition._id;
    //
    //         var setMatch = set.match(/(.*) \(Foil\)/i);
    //
    //         if(setMatch){
    //             set = setMatch[1];
    //         }
    //
    //         var founds = fuse.search(set);
    //
    //         if(founds.length){
    //             Sets.update({n : founds[0]},
    //                 {
    //                     $set : {SCG_name : set}
    //                 })
    //         }
    //     })
    // },
    // giveSetsSCGNames(){
    //     var editions = SCGCards.aggregate([
    //         {
    //             $group : {
    //                 _id : "$edition"
    //             }
    //         }]);
    //
    //     console.log(editions);
    //
    //     var allSets = Sets.find({}, {fields : {n : 1}}).fetch();
    //
    //
    //     var options = {
    //         keys : ["n"],
    //         id : "n",
    //         threshold : 0.4
    //     }
    //
    //     var fuse = new Fuse(allSets, options);
    //
    //     editions.forEach((edition)=>{
    //
    //         if(!edition._id){return;}
    //         var set = edition._id;
    //
    //         var setMatch = set.match(/(.*) \(Foil\)/i);
    //
    //         if(setMatch){
    //             set = setMatch[1];
    //         }
    //
    //         var founds = fuse.search(set);
    //
    //         if(founds.length){
    //             Sets.update({n : founds[0]},
    //                 {
    //                     $set : {SCG_name : set}
    //                 })
    //         }
    //     })
    // },
    // TCGCards(){
    //     logFunctionsStart("TCGCards");
    //     TCGSets.find({}).forEach((set)=>{
    //         set.cards.forEach(card=>{
    //             TCGCards.insert(Object.assign(card, {set : set._id, name : card.name.toTitleCase()}))
    //         })
    //     });
    //     logFunctionsEnd("TCGCards");
    // },
    // combineCards(){
    //     logFunctionsStart("combineCards");
    //     AllCards.find({types : {$size : 2}}).forEach(card=>{
    //
    //             if(card.types[0].multiverseid && card.types[0].TCGName){
    //                 console.log(0);
    //                 return;
    //             }
    //             if(card.types[1].multiverseid && card.types[1].TCGName){
    //                 console.log(1);
    //                 return;
    //             }
    //             var combine = Object.assign({}, card.types[1], card.types[0]);
    //
    //             if(combine.multiverseid && combine.TCGName){
    //                 console.log(combine);
    //                 AllCards.update({_id : card._id},
    //                     {
    //                         $set : {types : [combine], auto : "script"}
    //                     })
    //             }
    //     })
    //     logFunctionsEnd("combineCards");
    // },
    // doubleFaced(){
    //     logFunctionsStart("combineCards");
    //
    //     // MTGSets.find({cards : {$elemMatch :{layout : "double-faced", manaCost : {$exists : false}}}}, {cards : {$elemMatch : {layout : "double-faced"}}}).fetch().forEach((set)=>{
    //     //     set.cards.forEach(card=>{
    //     //         console.log(card);
    //     //     })
    //     // });
    //
    //     CardsFullData.find({layout : "meld", manaCost : null}).forEach((card)=>{
    //         console.log(card.name);
    //         AllCards.update({_id : card.name},
    //             {
    //                 $set : {type : "meld"}
    //             })
    //     })
    //
    //     //     .forEach((set)=>{
    //     //     set.cards.forEach(card=>{
    //     //         console.log(card);
    //     //     })
    //     // })
    //     logFunctionsEnd("doubleFaced");
    // },
    // online(){
    //     console.log("online");
    //     ["Tempest Remastered"].forEach((type)=>{
    //         AllCards.update({"types.gathererSet" : type},
    //             {
    //                 $set : {"types.$.online" : true}
    //             },
    //             {
    //                 multi : true
    //             })
    //     })
    //
    //     console.log("end");
    // },
    // extra(){
    //     console.log("extra");
        // ["International Edition", "Collector's Edition", "Fourth Edition (Foreign Black Border)", "Fourth Edition (Foreign White Border)", "Fourth Edition (Foreign Black Border)", "Fourth Edition (Foreign White Border)",
        //     "Revised Edition (Foreign White Border)", "Revised Edition (Foreign Black Border)", "Oversize Cards", "Welcome Deck 2017"
        // ].forEach((type)=>{
        //     AllCards.update({"types.TCGSet" : type},
        //         {
        //             $set : {"types.$.extra" : true}
        //         },
        //         {
        //             multi : true
        //         })
        // })

        // ["Welcome Deck 2017"].forEach((type)=>{
        //     AllCards.update({"types.gathererSet" : type},
        //         {
        //             $set : {"types.$.extra" : true}
        //         },
        //         {
        //             multi : true
        //         })
        // })
        //
        // console.log("extra");
    // },
    // extractTokens(){
    //     console.log("extractTokens");
    //
    //     Temp.find({}).forEach((card)=>{
    //         // console.log(card);
    //
    //         var found = AllCards.findOne({types : {$elemMatch : {TCGName : card.TCGName, TCGSet : card.TCGSet}}});
    //         if(found){
    //             Temp.remove({_id : card._id});
    //         }
    //         // EmblemsList.update({_id : emblem.TCGSet},
    //         //     {
    //         //         $setOnInsert : {_id : emblem.TCGSet, emblems : []}
    //         //     },
    //         //     {
    //         //         upsert : true
    //         //     })
    //         //
    //         // EmblemsList.update({_id : emblem.TCGSet},
    //         //     {
    //         //         $push : {emblems : {name : emblem.TCGName}}
    //         //     })
    //     });
    //     console.log("Edn extractTokens");
    //
    // }

})





isObjectEmpty = (object)=> {
    for(var key in object) {
        if(object.hasOwnProperty(key))
            return false;
    }
    return true;
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

getLayout = ({card : card})=>{
    var foundCard = CardsFullData.find({name : new RegExp(`^${name}`, "i")});
}