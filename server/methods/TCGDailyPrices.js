import X2JS from "x2js";

Meteor.methods({
    CreateTCGDailyPricesMethod(){
        console.log("CreateTCGDailyPrices");
            CreateTCGDailyPrices();
    }
})


CreateTCGDailyPrices = ()=>{
    var TCGCardsAllCards = TCGCards.find({}).fetch();
    var date = new Date();
    date.setHours(0, 0, 0, 0);

    for(var i = 0; i < TCGCardsAllCards.length; i++){
        if(!TCGDailyPrices.find({TCGCards_id : TCGCardsAllCards[i]._id, date : date}, {limit : 1}).count()){
            webScrapingQueue.add({func : getTCGDailyPricesFullDataFromResponse, args : {card : TCGCardsAllCards[i], date : date}, wait : 80});
        }
    }
    console.log("END");
}

getTCGDailyPricesFullDataFromResponse = ({card, date})=>{

    var fixedSetName = card.TCGSet.replace(/&/g, "%26");
    var fixedCardName = card.TCGName.replace(/&/g, "%26");
    var url = encodeURI(`http://partner.tcgplayer.com/x3/phl.asmx/p?pk=CrowdMtG&s=${fixedSetName}&p=${fixedCardName}`);

    url = url.replace(/%2526/, "%26");

    Meteor.http.get(url, function(err, response){
        if(err){
            // TCGPrices.insert({error : "bad response", url : url, setName : setName, cardName : cardName});
            console.log(err);
        }
        var x2js = new X2JS();
        var document = x2js.xml2js(response.content);


        if(!document.products){
            Errors.update({date : date, TCGName : card.TCGName, TCGSet : card.TCGSet, Cards_id : card._id, description : "Card response didn't worked"},
                {
                    $set : {date : date, TCGName : card.TCGName, TCGSet : card.TCGSet, Cards_id : card._id, description : "Card response didn't worked"}
                },
                {
                    upsert : true
                });
            console.log("ERROR");
            return;
        }

        document.products.product.hiprice = parseFloat(document.products.product.hiprice);
        document.products.product.lowprice = parseFloat(document.products.product.lowprice);
        document.products.product.avgprice = parseFloat(document.products.product.avgprice);
        document.products.product.foilavgprice = parseFloat(document.products.product.foilavgprice);

        var product = document.products.product;

        var insertData = {};
        insertData.TCGCards_id = card._id;
        insertData.hi = document.products.product.hiprice;
        insertData.low = document.products.product.lowprice;
        insertData.avg = document.products.product.avgprice;
        insertData.foil = document.products.product.foilavgprice;

        TCGDailyPrices.update({TCGCards_id : card._id, date : date},
            {
                $set : insertData
            },
            {
                upsert : true
            }
        )
    });
}