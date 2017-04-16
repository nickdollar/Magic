import X2JS from "x2js";

Meteor.methods({
    TCGPlayerCardsDailyPricesMethods(){
        logFunctionsStart("cardsDataFullDateFormatMethod");
        var sets = TCGPlayerCards.find({}).fetch();
        // for(var i = 0; i < sets.length; i++){
        //     for(var j = 0; j < sets[i].cards.length; j++){

        for(var i = 0; i < 10; i++){
            for(var j = 0; j < 5; j++){
                TCGPlayerCardsDailyPrices.update({setName : sets[i].name},
                    {
                        $setOnInsert : {setName : sets[i].name, cards : []}
                    },
                    {$upsert : true}
                )


                var fixedSetName = sets[i].name.replace(/&/g, "%26");
                var fixedCardName = sets[i][j].name.replace(/&/g, "%26");

                var url = encodeURI(`http://partner.tcgplayer.com/x3/phl.asmx/p?pk=CrowdMtG&s=${fixedSetName}&p=${fixedCardName}`);
                url = url.replace(/%2526/, "%26");
                Meteor.http.get(url, (err, response)=>{
                    var product = getTCGPLayerCardsFullData({response});
                    TCGPlayerCardsDailyPrices.update({date : date, setName : sets[i].name}, {
                        $push : {"setName.$.cards" : product}
                    })
                });
            }
        }
        logFunctionsEnd("TCGPlayerCardsDailyPricesMethods");
    },
})

getTCGPLayerCardsFullData = ({response})=>{
    var x2js = new X2JS();
    var document = x2js.xml2js(response.content);

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