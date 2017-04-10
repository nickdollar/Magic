import X2JS from "x2js";

Meteor.methods({
    cardsPrices(){
        // var test = Meteor.http.get("http://partner.tcgplayer.com/x3/phl.asmx/p?pk=CrowdMtG&s=New%20Phyrexia&p=Flameborn%20Viron");
        var url = encodeURI("http://partner.tcgplayer.com/x3/pv.asmx/p?pk=TCGTEST&p=Sword of War and Peace&s=New Phyrexia&v=3");
        var test = Meteor.http.get(url);
        var x2js = new X2JS();

        var document = x2js.xml2js(test.content);
        return document;
    },
    AllCardSetNameMethod(set, name){
        // var test = Meteor.http.get("http://partner.tcgplayer.com/x3/phl.asmx/p?pk=CrowdMtG&s=New%20Phyrexia&p=Flameborn%20Viron");

        return document;
    },
    findFoilCards(set, name){
        // var test = Meteor.http.get("http://partner.tcgplayer.com/x3/phl.asmx/p?pk=CrowdMtG&s=New%20Phyrexia&p=Flameborn%20Viron");
        logFunctionsStart("findFoilCards");
        var sets = TCGPlayerCards.find({}).fetch();
            for(var i = 0; i < sets.length; i++){
                for(var j = 0; j < sets[i].cards.length; j++){
                    cardSetName({setName : sets[i].name, cardName : sets[i].cards[j].name})
                }
            }
        logFunctionsEnd("findFoilCards");
    },
    cardsDataFullDateFormat(set, name){
        // var test = Meteor.http.get("http://partner.tcgplayer.com/x3/phl.asmx/p?pk=CrowdMtG&s=New%20Phyrexia&p=Flameborn%20Viron");
        logFunctionsStart("findFoilCards");
            var sets = TCGPlayerCards.find({}).fetch();
            for(var i = 0; i < sets.length; i++){
                for(var j = 0; j < sets[i].cards.length; j++){
                    cardsDataFullDate({setName : sets[i].name, cardName : sets[i].cards[j].name})
                }
            }
        logFunctionsEnd("findFoilCards");
    },
    getTCGPLayerCardsFullDataMethods(){
        logFunctionsStart("getTCGPLayerCardsFullDataMethods");
        var sets = TCGPlayerCards.find({state : {$ne : "cards"}}).fetch();
        for(var i = 0; i < sets.length; i++){
            if(i%15 == 0){
                console.log(`${i} of ${sets.length}`);
            }

            if(TCGPlayerCardsFullData.findOne({name : sets[i].name})){
                if(sets[i].cards.length == TCGPlayerCardsFullData.findOne({name : sets[i].name}).cards.length){
                    continue;
                }
            }


            TCGPlayerCardsFullData.update({name : sets[i].name},
                {
                    $setOnInsert : {name : sets[i].name, cards : []}
                },
                {
                    upsert : true
                })

            var cardsList = [];
            for(var j = 0; j < sets[i].cards.length; j++){
                cardsList.push(getTCGPLayerCardsFullData({setName : sets[i].name, cardName : sets[i].cards[j].name}));
            }
            TCGPlayerCardsFullData.update({name : sets[i].name},
                {
                    $set : {cards : cardsList, state : "cards"}
                })
        }
        logFunctionsEnd("getTCGPLayerCardsFullDataMethods");
    },
    setUpFoilNormalMethod(){
        logFunctionsStart("setUpFoilNormalMethod");
        setUpFoilNormal();
        logFunctionsEnd("setUpFoilNormalMethod");
    },
    setUpFoilNormalMethod(){
        logFunctionsStart("setUpFoilNormalMethod");
        setUpFoilNormal();
        logFunctionsEnd("setUpFoilNormalMethod");
    }
})

cardSetName = ({setName, cardName})=>{

    var fixedSetName = setName.replace(/&/g, "%26");
    var fixedCardName = cardName.replace(/&/g, "%26");

    var url = encodeURI(`http://partner.tcgplayer.com/x3/phl.asmx/p?pk=CrowdMtG&s=${fixedSetName}&p=${fixedCardName}`);
    url = url.replace(/%2526/, "%26");
    var test = Meteor.http.get(url);
    var x2js = new X2JS();
    var document = x2js.xml2js(test.content);
    return document.products.product;
}

getTCGPLayerCardsFullData = ({setName, cardName})=>{
    var fixedSetName = setName.replace(/&/g, "%26");
    var fixedCardName = cardName.replace(/&/g, "%26");

    var url = encodeURI(`http://partner.tcgplayer.com/x3/phl.asmx/p?pk=CrowdMtG&s=${fixedSetName}&p=${fixedCardName}`);
    url = url.replace(/%2526/, "%26");
    var test = Meteor.http.get(url);
    var x2js = new X2JS();
    var document = x2js.xml2js(test.content);

    document.products.product.name = cardName.toTitleCase();

    if(!document.products){
        return {name : cardName.toTitleCase(), url : url}
    }

    document.products.product.hiprice = parseFloat(document.products.product.hiprice);
    document.products.product.lowprice = parseFloat(document.products.product.lowprice);
    document.products.product.avgprice = parseFloat(document.products.product.avgprice);
    document.products.product.foilavgprice = parseFloat(document.products.product.foilavgprice);

    return document.products.product;
}





setUpFoilNormal = ()=>{

    var cardsNamesTypes = TCGPlayerCardsFullData.aggregate(
        [
            {
                $unwind: "$cards"
            },
            {
                $project: {
                    setName : "$name",
                    cardName : "$cards.name",
                    id : "$cards.id",
                    normal :
                        {
                            $cond : { if : { $eq : ["$cards.avgprice", "0"]}, then : false, else : true}
                        },
                    foil :
                        {$cond : { if : { $eq : ["$cards.foilavgprice", "0"]}, then : false, else : true}},
                }
            },
            {
                $group: {
                    _id : {normal : "$normal", foil : "$foil", setName : "$setName"},
                    cards : {$push : {name : "$cardName", id : "$id"}}
                }
            },
        ]
    );


    for(var i = 0; i<  cardsNamesTypes.length; i++){
        for(var j = 0; j< cardsNamesTypes[i].cards.length; ++j){

            var $set = {};
            $set["cards.$.foil"] = cardsNamesTypes[i]._id.foil;
            $set["cards.$.normal"] = cardsNamesTypes[i]._id.normal;
            $set["cards.$.id"] = cardsNamesTypes[i].cards[j].id;

            var query = Object.assign({}, {name :  cardsNamesTypes[i]._id.setName});
            query["cards.name"] = cardsNamesTypes[i].cards[j].name

            TCGPlayerCards.update(query,
                {
                    $set : $set
                })
        }
    }

}




getCardsPrices = ({setName, cardName, date})=>{

    var fixedSetName = setName.replace(/&/g, "%26");
    var fixedCardName = cardName.replace(/&/g, "%26");

    var url = encodeURI(`http://partner.tcgplayer.com/x3/phl.asmx/p?pk=CrowdMtG&s=${fixedSetName}&p=${fixedCardName}`);
    url = url.replace(/%2526/, "%26");
    var test = Meteor.http.get(url);
    var x2js = new X2JS();
    var document = x2js.xml2js(test.content);

    document.products.product.name = cardName;
    delete document.products.product.id;
    delete document.products.product.link;
}