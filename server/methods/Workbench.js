import csv from "csvtojson";
import Fuse from "fuse.js";

Meteor.methods({
    findCardsThatDoesntExistsMethod(){
        console.log("START: ");
        Gatherer.find({set : {$nin : ["Prerelease Events", 'Planechase "Planes"']}}).forEach((card)=>{
            if(!Cards.find({"printings.multiverseid" : card._id}, {limit : 1}).count()){
                console.log(card._id, card.name, card.set);
            }
        })
        console.log("END: ");

    },
    fixPTCTHINGSMethod(){
        Gatherer.find({set : "Prerelease Events"}).forEach((card)=>{
            Cards.find({_id : card.name, "printings.setCode" : "PRE", },
                {
                    $set : {"printings.$.multiverseid" : card._id}
                })
        })
    },

    yoyoyoyoMethod(){
        console.log("fixPTCTHINGSMethod");
        console.log(Meteor.user());
        console.log(services);
        console.log(services.resume);
        console.log(services.resume.loginTokens);
        console.log(services.resume.loginTokens.hashedToken);
    },
    addSetsToCards(){
        Cards.find({printings: {$elemMatch: {setCode: {$exists: false}}}}).forEach((card) => {
            var printings = card.printings.map((printing) => {
                var foundSet = Sets.findOne({gatherer: printing.set});

                if (foundSet) {
                    return Object.assign(printing, {setCode: foundSet._id})
                }
                console.log("not found");

                return printing;
            })

            Cards.update({_id: card._id},
                {
                    $set: {printings: printings}
                },
                {
                    multi: true
                })
        })
    },
    addFoilOrNormal(){
        TCGPrices.find({}).forEach((card) => {
            if (card.product) {
                Cards.update({
                        _id: card.Cards_id,
                        printings: {$elemMatch: {TCGSet: card.setName, TCGName: card.cardName}}
                    },
                    {
                        $set: {
                            "printings.$.foil": card.product.foilavgprice ? true : false,
                            "printings.$.normal": card.product.avgprice ? true : false,
                            "printings.$.tcg_id": card.product.id,
                            "printings.$.test": card.cardName
                        }
                    })
            }
        });
        console.log("end");
    },

    fixArchetypes(){
        DecksArchetypes.find().forEach((deckArchetype)=>{
            if(deckArchetype.manual){
                DecksArchetypes.update({_id : deckArchetype._id},{
                    $set : {cards : deckArchetype.manual.cards, decksQty : deckArchetype.manual.decksQty},
                    $unset : {manual : ""}
                })
            }

        })
    },
    giveStarCityCards_idMethod(){
        logFunctionsStart("giveStarCityCards_id");
            TCGPrices.find({}).forEach((card)=>{
                var foundCard = CardsUnique.findOne({TCGName : card.cardName, TCGSet : card.setName});
                if(foundCard){
                    CardsUnique.update({_id : foundCard._id},
                        {
                            $set : {TCGId : card.product.id}
                        })
                }
            })
        logFunctionsEnd("giveStarCityCards_id");
    },
    fixedArchetypes_namesMethod(){
        console.log("START: fixedArchetypes_namesMethod")
        DecksArchetypes.find({}).forEach((deckArchetype)=>{

            var mainCards = [];
            var sideboardCards = [];
            var CardsDecksData_ids = [];

            if(deckArchetype.mainCards){
                mainCards = deckArchetype.mainCards.map((card)=>{
                    return {qty : card.qty, avg : card.avg, totalQty : card.totalQty, Cards_id : card.name}
                })
            }



            if(deckArchetype.sideboardCards){
                sideboardCards = deckArchetype.sideboardCards.map((card)=>{
                    return {qty : card.qty, avg : card.avg, totalQty : card.totalQty, Cards_id : card.name}
                })
            }

            if(deckArchetype.CardsDecksData_ids){
                CardsDecksData_ids = deckArchetype.CardsDecksData_ids.map((DecksArchetypesIDS)=>{
                    return {Cards_id : DecksArchetypesIDS._id, DecksData_ids : DecksArchetypesIDS._ids}
                })
            }



            DecksArchetypes.update({_id : deckArchetype._id}, {
                $set : {mainCards : mainCards, sideboardCards : sideboardCards, CardsDecksData_ids : CardsDecksData_ids}
            })

        })
        console.log("  END: fixedArchetypes_namesMethod")
    },

})

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