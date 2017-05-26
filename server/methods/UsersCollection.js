import sizeof from "object-sizeof";

Meteor.methods({
    addCardToCollectionMethod: function ({request}) {
        if(!Meteor.userId()){
            logFunctionsEnd("Login Doesn't Exists");
            return;
        }

        UsersCollection.update({_id : Meteor.userId()},
            {
                $setOnInsert : {cards : [{CardsUnique_id : request.CardsUnique_id, name : request.name}]}
            },
            {
                upsert : true
            }
        )

        UsersCollection.update({_id : Meteor.userId(), "cards.CardsUnique_id" : {$ne : request.CardsUnique_id}},
            {
                $push : {cards : {CardsUnique_id : request.CardsUnique_id, name : request.name}},
            }
        )

        var inc = {};
        request.fQty ? inc['cards.$.fQty'] = request.fQty : inc['cards.$.nQty'] = request.nQty;
        UsersCollection.update({_id : Meteor.userId(), "cards.CardsUnique_id" : request.CardsUnique_id},
            {
                $inc : inc
            }
        )
    },
    updateCollectionCardQty({CardsUniques_id, foilNormal, value}){
        if(!Meteor.userId()){
            logFunctionsEnd("Login Doesn't Exists");
            return;
        }
        var changes = {};
        changes[`cards.$.${foilNormal}`] = value;
        UsersCollection.update({_id : Meteor.userId(), "cards.CardsUnique_id" : CardsUniques_id},
            {
                $set : changes,
            }
        )
    },

    getCollectionCardsMethod({colorsMatch, sort, page, itemsCountPerPage, cardsStartingWith}){

        console.log(sort);

        var cards = UsersCollection.aggregate(
            [
                {$match: {_id : Meteor.userId()}},
                {$unwind: {
                        path : "$cards",
                }},
                {$project: {
                         _id : "$cards.CardsUnique_id",
                        fQty : "$cards.fQty",
                        nQty : "$cards.nQty",
                 }},
                {
                    $lookup: {
                        "from" : "CardsUnique",
                        "localField" : "_id",
                        "foreignField" : "_id",
                        "as" : "card"
                    }
                },
                {
                    $unwind : "$card"
                },
                {
                    $project: {
                        _id : 1,
                        setCode : "$card.setCode",
                        name : "$card.TCGName",
                        foil : 1,
                        nQty : 1,
                        fQty : 1,
                        colorIdentity : "$card.colorIdentity",
                        avgprice : "$card.avgprice",
                        foilavgprice : "$card.foilavgprice",
                    }
                },
                {
                    $match : Object.assign(colorsMatch, {name : {$regex : `^${cardsStartingWith}`, $options: 'i'}})
                },
                {
                    $sort : sort
                }
            ]
        );

        var count = cards.length;
        var slice = cards.slice(itemsCountPerPage*page, itemsCountPerPage*(page + 1));
        if(count){
            return {qty : count, cards : slice};
        }
        return {qty : 0, cards : []};
    },
    removeCardFromCollectionMethod(cardObj){
        removeCardFromCollection(cardObj);
    },
    importCollectionMethod(){
        importCollection();
    },
    importCollectionMethod(){
        importCollection();
    }
});

removeCardFromCollection = function({CardsUnique_id}){
    UsersCollection.update({_id : Meteor.userId()},
        {
            $pull : {cards : {CardsUnique_id : CardsUnique_id}}
        }
    )
}

importCollection = (URL)=>{
    logFunctionsStart("importCollection");
    var URL = "http://store.tcgplayer.com/collection/view/142729"
    var resMainPage = Meteor.http.get(URL);
    if (resMainPage.statusCode == 200) {
        var $collectionPage = cheerio.load(resMainPage.content, {decodeEntities: false});
        var collectionTable = $collectionPage("#collectionContainer");

        if(collectionTable.length){

            var headers = $collectionPage(collectionTable).find("thead th");
            var rows = $collectionPage(collectionTable).find("tbody tr");
            var nameRegex = /(\b.+\b) *(?= - \[Foil\]|$|\(\b\w+\b\))(\(\b\w+\b\))?( - \[Foil\])?/i;

            var columnPosition = {};
            for(var i = 0; i < headers.length; i++){
                columnPosition[$collectionPage(headers[i]).html()] = i +1;
            }
            for(var i = 0; i < rows.length; i++){

                var data = {};
                var game = $collectionPage(rows[i]).find(`td:nth-child(${columnPosition.Game})`).html();
                if(game != "Magic"){
                    continue;
                }
                var qty = parseInt($collectionPage(rows[i]).find(`td:nth-child(${columnPosition.Have})`).html());
                if(isNaN(qty)){
                    qty = 0;
                }
                var name = $collectionPage(rows[i]).find(`td:nth-child(${columnPosition.Name}) a`).html();

                var match = name.match(nameRegex);

                var nameMatched = match[1];
                var foil;

                if(match[3]){
                    data.fQty = qty;
                }else{
                    data.nQty = qty;
                }

                var setName = replaceEdition($collectionPage(rows[i]).find(`td:nth-child(${columnPosition.Set})`).html());


                var cardFound = Cards.find({printings : {$elemMatch : {TCGSet : new RegExp(setName, "i")}}}, {fields : {TCGSet : new RegExp(setName, "i")}})

                if(!setCode){
                    setCode = "wrongCode";
                }


                // addCardToCollection({ Cards_id : nameMatched, foil : foil, setCode : setCode});
            }
        }
    }
    logFunctionsEnd("importCollection");
}