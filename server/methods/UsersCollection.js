import sizeof from "object-sizeof";
import cheerio from "cheerio";
import csvtojson from "csvtojson";

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

    addCollectionToUsersCollectionMethod({cards, replaceTotal}){
        UsersCollection.update({_id : Meteor.userId()},
            {
                $setOnInsert : {cards : []},
            },
            {
                upsert : true
            }
        )

        for(var i = 0; i < cards.length; i++){

            UsersCollection.update({_id : Meteor.userId(), "cards.CardsUnique_id" : {$ne : cards[i]._id}},
                {
                    $push : {cards : {CardsUnique_id : cards[i]._id, name : cards[i].name}},
                }
            )

            var change = {};
            cards[i].fQty ? change['cards.$.fQty'] = cards[i].fQty : change['cards.$.nQty'] = cards[i].nQty;

            if(replaceTotal){
                UsersCollection.update({_id : Meteor.userId(), "cards.CardsUnique_id" : cards[i]._id},
                    {
                        $set : change
                    })
            }else{
                UsersCollection.update({_id : Meteor.userId(), "cards.CardsUnique_id" : cards[i]._id},
                    {
                        $inc : change
                    }
                )
            }
        }
    },

    getCollectionCardsMethod({colorsMatch, sort, page, itemsCountPerPage, cardsStartingWith}){
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
                        avgfoilprice : "$card.avgfoilprice",
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
    importCollectionMethod({URLNumber}){
        return importCollection({URLNumber : URLNumber});
    },
    updateCollectionFromCSVMethod({file}){
        logFunctionsStart("updateCollectionFromCSVMethod");

        Future = Npm.require('fibers/future');
        var myFuture = new Future();


        var cards = {found : [], notFound : []};
        var message = "";
        var missingFields = [];

        Meteor.bindEnvironment(()=>{
            csvtojson()
                .fromString(file)
                .on('json',(csvRow)=>{
                    if(missingFields.length){return}
                    if(!csvRow.cardName){missingFields.push("cardName")}
                    if(!csvRow.setCode){missingFields.push("setCode")}
                    if(!csvRow.quantity){missingFields.push("quantity")}


                    var foundCard = CardsUnique.find({name : csvRow.cardName, setCode : csvRow.setCode}, {limit : 1}).fetch();
                    if(!foundCard.length){
                        found.notFound.push({csvRow})
                    }else{
                        found.cards.push({foundCard})
                    }

                })
                .on('done',(error)=>{
                    console.log("done")
                    if(missingFields.length){message = `Missing fields: ${missingFields.toString()}`}
                    return {message : message, found : [], notFound : []};
                })
        })

        logFunctionsEnd("updateCollectionFromCSVMethod");
        return myFuture.wait();
    },
    exportCollectionMethod(){
      var cardsAggregate = UsersCollection.aggregate(

          // Pipeline
          [
              // Stage 1
              {
                  $match: {
                      _id : "yiA24CDsErxF97Hr2"
                  }
              },

              // Stage 2
              {
                  $project: {
                      _id : 0,
                      cards : 1
                  }
              },

              // Stage 3
              {
                  $unwind: {
                      path : "$cards",
                  }
              },

              // Stage 4
              {
                  $lookup: {
                      "from" : "CardsUnique",
                      "localField" : "cards.CardsUnique_id",
                      "foreignField" : "_id",
                      "as" : "card"
                  }
              },

              // Stage 5
              {
                  $unwind: {
                      path : "$card",
                  }
              },

              // Stage 6
              {
                  $project: {
                      name : "$card.Cards_id",
                      setCode : "$card.setCode",
                      nQty : { $cond: { if: "$cards.nQty", then: "$cards.nQty", else: 0 } },
                      fQty : { $cond: { if: "$cards.fQty", then: "$cards.fQty", else: 0 } },
                  }
              },

          ]

          // Created with 3T MongoChef, the GUI for MongoDB - https://3t.io/mongochef

      );
        return {cardsAggregate : cardsAggregate, keys : ["name", "setCode", "nQty", "fQty"]};
    },
    updateCollectionFromCSVMethodFuture({file, type}){



        logFunctionsStart("updateCollectionFromCSVMethodFuture");
        var fields = {
            CrowdMTG : {
                fields : ["name", "setCode", "nQty", "fQty"]
            },
            MTGO : {
                fields : ["Card Name", "Quantity", "Set", "Premium"]
            },
            TCGPlayer : {
                fields : ["HAVE", "NAME", "GAME", "SET"]
            }
        };

        Future = Npm.require('fibers/future');
        var myFuture = new Future();

        var found = [],
            notFound = [],
            message = "",
            missingFields = [],
            cardsArray = [];
        csv()
            .fromString(file)
            .on('json',(csvRow)=>{
                if(missingFields.length){return}
                for(var i = 0; i < fields[type].fields.length; i++){
                    if(!csvRow[fields[type].fields[i]]){
                        missingFields.push(fields[type].fields[i])
                    }
                }
                if(missingFields.length){return}

                if(type == "CrowdMTG"){
                    if(missingFields.length){return}
                    var nQty = csvRow.nQty;
                    var fQty = csvRow.fQty;
                    var quantity = {};
                    isNaN(nQty) ? quantity.nQty = 0 : quantity.nQty = nQty;
                    isNaN(fQty) ? quantity.fQty = 0 : quantity.fQty = fQty;
                    cardsArray.push(Object.assign({name : csvRow.name, setCode : csvRow.setCode}, {quantity}));
                }else if(type == "MTGO"){
                        var qty = parseInt(csvRow.Quantity);
                        isNaN(qty) ? qty = 0 : null;
                        var quantity = {nQty : 0, fQty : 0};
                        csvRow.Premium == "Yes" ? quantity.fQty = qty : quantity.nQty = qty;
                        cardsArray.push(Object.assign({name : csvRow["Card Name"], setCode : csvRow["Set"]}, quantity));
                }else if(type == "TCGPlayer"){
                    csvRow.NAME = csvRow.NAME.trim();
                    var foilMatch = new RegExp(/ - \[Foil\]/);
                    var qty = parseInt(csvRow.HAVE);
                    isNaN(qty) ? qty = 0 : null;
                    quantity = {nQty : 0, fQty : 0};
                    if(csvRow.NAME.match(foilMatch)){
                        quantity.fQty = qty
                        csvRow.NAME = csvRow.NAME.replace(foilMatch, "");
                    }else{
                        quantity.nQty = qty
                    }

                    console.log("XXXXX")
                    cardsArray.push(Object.assign({name : csvRow.NAME, setCode : csvRow["SET"]}, quantity));
                }
            })
            .on('done', Meteor.bindEnvironment((error)=>{
                for(var i = 0; i <cardsArray.length; i++){
                    if(type=="TCGPlayer"){
                        var foundCard = CardsUnique.find({TCGName : cardsArray[i].name, TCGSet : cardsArray[i].setCode}, {limit : 1, fields : {name : 1, setCode : 1}}).fetch();
                    }else{
                        var foundCard = CardsUnique.find({name : cardsArray[i].name, setCode : cardsArray[i].setCode}, {limit : 1, fields : {name : 1, setCode : 1}}).fetch();
                    }

                    if(!foundCard.length){
                        notFound.push(cardsArray[i]);
                    }else{
                        found.push(Object.assign(cardsArray[i], foundCard[0]));
                    }
                }
                if(missingFields.length){message = `Missing fields: ${missingFields.toString()}`}
                logFunctionsEnd("updateCollectionFromCSVMethodFuture");
                myFuture.return({message : message, found : found, notFound : notFound});
            }))

        return myFuture.wait();
        return {message : "", found : [], notFound : []}
    },
});

removeCardFromCollection = function({CardsUnique_id}){
    UsersCollection.update({_id : Meteor.userId()},
        {
            $pull : {cards : {CardsUnique_id : CardsUnique_id}}
        }
    )
}

importCollection = ({URLNumber})=>{
    logFunctionsStart("importCollection");
        // var URL = `http://store.tcgplayer.com/collection/view/${URLNumber}`
        var URL = `http://store.tcgplayer.com/collection/view/142729`
        console.log(URL);
        Meteor.http.get(URL, (err, response)=>{
            console.log(response.content)
        })

        var asyncToSync = Meteor.wrapAsync(Meteor.http.get);
        var response  = asyncToSync(URL)
        var found = [],
            notFound = [];
        if(response.statusCode == 200) {
            var $collectionPage = cheerio.load(response.content, {decodeEntities: false});
            var collectionTable = $collectionPage("#collectionContainer");
            // console.log(response.content);
            if (collectionTable.length) {
                var headers = $collectionPage(collectionTable).find("thead th");
                var rows = $collectionPage(collectionTable).find("tbody tr");
                var nameRegex = /(\b.+\b) *(?= - \[Foil\]|$|\(\b\w+\b\))(\(\b\w+\b\))?( - \[Foil\])?/i;

                var columnPosition = {};
                for (var i = 0; i < headers.length; i++) {
                    columnPosition[$collectionPage(headers[i]).html()] = i + 1;
                }
                if(!columnPosition.Have){
                    return {responseText : `Missing "Have" Column`, found : found, notFound : notFound};
                }

                for (var i = 0; i < rows.length; i++) {
                    var data = {};
                    var game = $collectionPage(rows[i]).find(`td:nth-child(${columnPosition.Game})`).html();
                    if (game != "Magic") { continue; }
                    var idRegex = new RegExp(/\d+/);
                    var TCGId = $collectionPage(rows[i]).attr("id").match(idRegex);
                    data.TCGId = TCGId[0];
                    var qty = parseInt($collectionPage(rows[i]).find(`td:nth-child(${columnPosition.Have})`).html());
                    if (isNaN(qty)) {
                        qty = 0;
                    }
                    var name = $collectionPage(rows[i]).find(`td:nth-child(${columnPosition.Name}) a`).html();

                    var match = name.match(nameRegex);

                    var nameMatched = match[1];

                    data.name = nameMatched;

                    if (match[3]) {
                        data.fQty = qty;
                        data.foil = true;
                    } else {
                        data.nQty = qty;
                        data.foil = false;
                    }

                    var setName = $collectionPage(rows[i]).find(`td:nth-child(${columnPosition.Set})`).html();
                    data.setName = setName;

                    var cardFound = CardsUnique.find({TCGId : data.TCGId}, {limit : 1, fields: {name : 1, setCode : 1}}).fetch()
                    if(!cardFound.length){
                        notFound.push(Object.assign(data, {key : `${data.TCGId}${data.foil}`}));
                    }else{
                        found.push(Object.assign(data, cardFound[0], {key : `${data.TCGId}${data.foil}`}));
                    }
                }
            }else{
                return {responseText : "Could not find the URL with number provided", found : found, notFound : notFound}
            }
        }
    logFunctionsEnd("importCollection");
    return {responseText : "Sucess", found : found, notFound : notFound};
}