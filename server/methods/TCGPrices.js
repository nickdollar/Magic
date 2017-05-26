import X2JS from "x2js";

Meteor.methods({
    getAllPrices(){
        var cardsAggregate = Cards.aggregate(
            [
                {$project : {
                    printings : 1
                }},
                {
                    $unwind : "$printings"
                },
                {
                    $match :{
                        "printings.TCGName" : {$exists : true},
                        "printings.TCGSet" : {$exists : true},
                    }
                }
            ]
        )

        for(var i = 0; i < cardsAggregate.length; i++){
            webScrapingQueue.add({func : getTCGPLayerCardsFullDataFromResponse, args : {Cards_id : cardsAggregate[i]._id, setName : cardsAggregate[i].printings.TCGSet, cardName : cardsAggregate[i].printings.TCGName}, wait : 80});
        }
    }
})


getTCGPLayerCardsFullDataFromResponse = ({Cards_id, setName, cardName})=>{
    var fixedSetName = setName.replace(/&/g, "%26");
    var fixedCardName = cardName.replace(/&/g, "%26");

    var url = encodeURI(`http://partner.tcgplayer.com/x3/phl.asmx/p?pk=CrowdMtG&s=${fixedSetName}&p=${fixedCardName}`);

    url = url.replace(/%2526/, "%26");

    Meteor.http.get(url, function(err, response){
        if(err){
            TCGPrices.insert({error : "bad response", url : url, setName : setName, cardName : cardName});
            console.log(err);
        }
        var x2js = new X2JS();
        var document = x2js.xml2js(response.content);


        if(!document.products){
            TCGPrices.insert({error : "productNotFound", url : url, setName : setName, cardName : cardName});
            Errors.insert({setName : setName, url : url, description : "Website not found"});
            console.log("ERROR");
            return;
        }

        document.products.product.name = cardName.toTitleCase();

        document.products.product.hiprice = parseFloat(document.products.product.hiprice);
        document.products.product.lowprice = parseFloat(document.products.product.lowprice);
        document.products.product.avgprice = parseFloat(document.products.product.avgprice);
        document.products.product.foilavgprice = parseFloat(document.products.product.foilavgprice);

        var product = document.products.product;

        TCGPrices.update(   {Cards_id : Cards_id, url : url, setName : setName, cardName : cardName, product : product},
            {
                $set : {
                    Cards_id : Cards_id, url : url, setName : setName, cardName : cardName, product : product
                }
            },
            {
                upsert : true
            }
        );
    });
}