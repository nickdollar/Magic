import csv from "csvtojson";
import Fuse from "fuse.js";

Meteor.methods({
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
        console.log("BBBBBBBBBBBBBBBB");
        DecksArchetypes.find().forEach((deckArchetype)=>{
            if(deckArchetype.manual){
                DecksArchetypes.update({_id : deckArchetype._id},{
                    $set : {cards : deckArchetype.manual.cards, decksQty : deckArchetype.manual.decksQty},
                    $unset : {manual : ""}
                })
            }

        })
        console.log("gggggggggggggggg");
    }
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