import Fuse from "fuse.js";

Meteor.methods({
    addALGSDecksData: function ({submitDeck}) {
        if(Events.findOne({_id : submitDeck._id})){
            var decksData = DecksData.findOne({_id : submitDeck.DecksData_id});
            if(decksData){
                DecksData.update({_id : submitDeck.DecksData_id},
                    {
                        $set : {
                            main : submitDeck.main,
                            sideboard : submitDeck.sideboard,
                        }
                    },
                )
                return {DecksData_id : submitDeck.DecksData_id, message : "Deck Updated"};
            }else{
                var DecksData_id = DecksData.insert(
                    {
                        Events_id : submitDeck._id,
                        LGS_id : submitDeck.LGS_id,
                        Formats_id : submitDeck.Formats_id,
                        type : "lgs",
                        main : submitDeck.main,
                        player : submitDeck.player,
                        sideboard : submitDeck.sideboard,
                        date : submitDeck.date,
                        position : 1,
                        state : "lgs",
                    }
                )
                return {DecksData_id : DecksData_id, message : "Deck Submitted"};
            }

        }
    },
    updateALGSDecksData: function (deck) {
        deck.main = deck.main.map((card)=>{
            return {name : card.name, qty : card.qty }
        })
        deck.sideboard = deck.sideboard.map((card)=>{
            return {name : card.name, qty : card.qty }
        })

        if(Events.findOne({_id : deck.Events_id})){
            DecksData.update({_id : deck._id},
                {
                    $set : {
                        main : deck.main,
                        sideboard : deck.sideboard,
                        state : "admin"
                    }
                }
            )
        }
        return "Deck Updated";
    },
    updateMainSide: function (mainSide, DecksData_id) {

        var main = mainSide.main.map((card)=>{
            var cardQuery = CardsData.findOne({name : card.name});

            var cardResult = {name : card.name, qty : card.qty}
            if(!cardQuery){
                Object.assign(cardResult, {wrongName : true})
            }
            return cardResult;
        })

        var sideboard = mainSide.sideboard.map((card)=>{
            var cardQuery = CardsData.findOne({name : card.name});

            var cardResult = {name : card.name, qty : card.qty}
            if(!cardQuery){
                Object.assign(cardResult, {wrongName : true})
            }
            return cardResult;
        })

        var totalMain = mainSide.main.reduce((a, b)=>{
            return a + b.qty
        }, 0);

        var totalSideboard = mainSide.sideboard.reduce((a, b)=>{
            return a + b.qty
        }, 0);

        var colors = setUpColorForDeckName(main);
        DecksData.update({_id : DecksData_id},
            {$set : {
                totalMain : totalMain,
                main : main,
                totalSideboard : totalSideboard,
                colors : colors,
                sideboard : sideboard,
                state : "lgs"
            }
        })
    },
    updateLGSDecksData: function (change) {
        var colors = setUpColorForDeckName(deck.main);
        Object.assign({}, deck, {colors : colors})
        DecksData.update({_id : change._id},
            {$set : change}
        )
    },
    updatePlayerFromAdmin: function (DecksData_id, newValues) {
        DecksData.update({_id : DecksData_id},
            {$set : newValues}
        )
    },
    removeDeckFromLGSEvent: function (DecksData_id) {
        DecksData.remove({_id : DecksData_id});
    },
    giveNamesToAllDecksScrapedMethod({Formats_id}){
        logFunctionsStart("giveNamesToAllDecksScrapedMethod");
        DecksData.find({Formats_id : Formats_id, state : "scraped"}).forEach(deck=>{
            giveNamesToAllDecksScraped({_id : deck._id});
        });
        logFunctionsEnd("giveNamesToAllDecksScrapedMethod");
    },

    recheckDeckWithWrongCardName(format){
    logFunctionsStart("recheckDeckWithWrongCardName");
        var cardsWithWrongName = DecksData.aggregate([
            {
                $match : {
                    format: format,
                    $or : [
                        {"main.wrongName" : true},
                        {"sideboard.wrongName" : true}
                    ]
                }
            },
            {
                $project :{
                    _id : "$_id",
                    cards : {
                        $setUnion :
                            [
                                {$map : {input : "$main", as: "el", in : "$$el"}},
                                {$map : {input : "$sideboard", as: "el", in : "$$el"}}
                            ]
                    }
                }
            },
            {
                $unwind : "$cards"
            },
            {
                $match : {
                    "cards.wrongName" : true
                }
            },
            {
                $group : {
                    _id : "$cards.name"
                }
            }
        ])

        var allCardsNames = CardsData.find({}, {fields : {name : 1}}).fetch();

        var options = {
            keys : [{name : "name"}],
            id : "name",
            threshold : 0.4

        }

        var fuse = new Fuse(allCardsNames, options);

        cardsWithWrongName.forEach((card, index)=>{
            var rightName = fuse.search(card._id)[0];
              DecksData.update  (  {"main.name" : card._id},
                                   {
                                    $unset : { "main.$.wrongName" : ""},
                                    $set : { "main.$.name" : rightName},
                                    },
                                    {
                                        multi : true
                                    }
                                )

                DecksData.update  (  {"sideboard.name" : card._id},
                    {
                        $unset : { "sideboard.$.wrongName" : ""},
                        $set : { "sideboard.$.name" : rightName},
                    },
                    {
                        multi : true
                    }
                )
        })

    logFunctionsEnd("recheckDeckWithWrongCardName");
    },
    methodAddNameToDeck : function(data){
        removeNameFromDeck(data._id);
        addNameToDeck(data._id, data.DecksNames_id);
        addToDecksUniqueWithName(data._id);
        CreateTheCardList(data.DecksNames_id);
        DecksData.update({_id : data._id},
            {
                $set : {state : "manual"}
            },
            {multi : true}
        )
    },
    getDecksListFromDeckName(DecksNames_id){
        return DecksData.find({DecksNames_id : DecksNames_id}, {sort : {date : -1}, fields : {
            format : 0,
            totalMain : 0,
            main : 0,
            totalSideboard : 0,
            sideboard : 0,
            colors : 0,
            state : 0
        }}).fetch()
    },
    getDecksListEvents_id(Events_id){
        var EventQuery = Events.findOne({_id : Events_id});
        var DecksDataQuery = DecksData.find({Events_id : Events_id}, {fields : {
            format : 0,
            totalMain : 0,
            main : 0,
            totalSideboard : 0,
            sideboard : 0,
            colors : 0,
            state : 0
        }}).fetch()
        return {Event : EventQuery, DecksData : DecksDataQuery};
    },
    getDecksDataBy_id(DecksData_id){
        return DecksData.findOne({_id : DecksData_id});
    },
    bannedDeck(Formats_id){
        logFunctionsStart("bannedDeck");

        var format = Formats_id.findOne({Formats_id : Formats_id});
            DecksData.update(
                    {Formats_id : Formats_id, $or :
                        [
                            {"main.name" : {$in : format.banned}},
                            {"sideboard.name" : {$in :  format.banned}}
                        ]
                    },
                {$set : {format : `${Formats_id}Banned`}},
                {
                    multi : true
                }
            )
        logFunctionsEnd("bannedDeck");
    },
    getDecksDataFromDecksNames(DecksNames_id){
        return DecksData.find({DecksNames_id : DecksNames_id, format : { $ne : {$regex : /Banned$/}}}, {sort : {name : 1}}).fetch();
    },
    getDecksDataFromArchetypes_idFormatCards({selectedCards, DecksArchetypes_id}){

        var aggregation = DecksArchetypes.aggregate(
            [
                {$match: {_id : DecksArchetypes_id}},
                {$lookup: {
                    "from" : "DecksNames",
                    "localField" : "_id",
                    "foreignField" : "DecksArchetypes_id",
                    "as" : "DecksNames_id"
                }},
                {$unwind: {path : "$DecksNames_id"}},
                {$group: {_id : "$_id", DecksNames_ids : {$addToSet : "$DecksNames_id._id"}}},

            ]
        );

        if(selectedCards.length){
            return DecksData.find({DecksNames_id : {$in : aggregation[0].DecksNames_ids}, "main.name" : {$all : selectedCards}}, {fields : {
                Formats_id : 0,
                totalMain : 0,
                main : 0,
                totalSideboard : 0,
                sideboard : 0,
                colors : 0,
                state : 0
            }}).fetch();
        }
        return DecksData.find({DecksNames_id : {$in : aggregation[0].DecksNames_ids}}, {fields : {
            Formats_id : 0,
            totalMain : 0,
            main : 0,
            totalSideboard : 0,
            sideboard : 0,
            colors : 0,
            state : 0
        }}).fetch();
    },
    getAllCardsFromDeckArchetypeMethod({selectedCards, DecksArchetypes_id}){

        if(selectedCards.length){
            var DecksArchetypesAggregation = DecksArchetypes.aggregate(
                [
                    {$match: {_id : DecksArchetypes_id}},
                    {$lookup: {
                        "from" : "DecksNames",
                        "localField" : "_id",
                        "foreignField" : "DecksArchetypes_id",
                        "as" : "DecksName"
                    }},
                    {$unwind: {path : "$DecksName"}},
                    {$lookup: {
                        "from" : "DecksData",
                        "localField" : "DecksName._id",
                        "foreignField" : "DecksNames_id",
                        "as" : "DecksData"
                    }},
                    {$unwind: {path : "$DecksData"}},
                    {$match : {"DecksData.main.name" : {$all : selectedCards}}},
                    {$project: {_id : "$DecksData._id",name : {$map : {input : "$DecksData.main", as : "el", in : "$$el.name"}}}},
                    {$unwind: {path : "$name"}},
                    {$group: {_id : "$name", count : {$sum : 1}}},
                    {$lookup: {
                        "from" : "CardsCollectionSimplified",
                        "localField" : "_id",
                        "foreignField" : "name",
                        "as" : "cardData"
                    }},
                    {$unwind: {path : "$cardData"}},
                    {$match: {"cardData.types" : {$ne : "land"}}},
                    {$sort: {count : -1}},
                ]
            );
        }else{
            var DecksArchetypesAggregation = DecksArchetypes.aggregate(
                [

                    {$match: {_id : DecksArchetypes_id}},
                    {$lookup: {
                        "from" : "DecksNames",
                        "localField" : "_id",
                        "foreignField" : "DecksArchetypes_id",
                        "as" : "DecksName"
                    }},
                    {$unwind: {path : "$DecksName"}},
                    {$lookup: {
                        "from" : "DecksData",
                        "localField" : "DecksName._id",
                        "foreignField" : "DecksNames_id",
                        "as" : "DecksData"
                    }},
                    {$unwind: {path : "$DecksData"}},
                    {$project: {_id : "$DecksData._id",name : {$map : {input : "$DecksData.main", as : "el", in : "$$el.name"}}}},
                    {$unwind: {path : "$name"}},
                    {$group: {_id : "$name", count : {$sum : 1}}},
                    {$lookup: {
                        "from" : "CardsCollectionSimplified",
                        "localField" : "_id",
                        "foreignField" : "name",
                        "as" : "cardData"
                    }},
                    {$unwind: {path : "$cardData"}},
                    {$match: {"cardData.types" : {$ne : "land"}}},
                    {$sort: {count : -1}},
                ]
            );
        }
        return DecksArchetypesAggregation;
   },
    getDecksDataWithCardsInformation({DecksData_id}){
            var deck = DecksData.aggregate(
                [
                    {
                        $match: {
                            _id : DecksData_id
                        }
                    },
                    {
                        $project: {
                            player : 1,
                            position : 1,
                            victory : 1,
                            loss : 1,
                            DecksNames_id : 1,
                            main : 1,
                            sideboard : 1,
                            cards : {
                                $setUnion :
                                    [
                                        {$map : {input : "$main", as : "main", in : "$$main.name"}},
                                        {$map : {input : "$sideboard", as : "sideboard", in : "$$sideboard.name"}}
                                    ]
                            }
                        }
                    },
                    {
                        $unwind: {
                            path : "$cards"
                        }
                    },
                    {
                        $lookup: {
                            "from" : "CardsSimple",
                            "localField" : "cards",
                            "foreignField" : "_id",
                            "as" : "cardsInfo"
                        }
                    },
                    {
                        $group: {
                            _id : "_id",
                            player : {$first : "$player"},
                            position : {$first : "$position"},
                            victory : {$first : "$victory"},
                            loss : {$first : "$loss"},
                            draw : {$first : "$draw"},
                            main : {$first : "$main"},
                            sideboard : {$first : "$sideboard"},
                            DecksNames_id : {$first : "$DecksNames_id"},
                            cardsInfo : {$push : {$arrayElemAt : ["$cardsInfo", 0]}}
                        }
                    },

                ]
            );

        return deck[0];
    },
    getDecksDataStateQty({Formats_id}){
        var decksDataAggregate = DecksData.aggregate(
            [
                {$match: {Formats_id : Formats_id}},
                {$group: {_id : "$state", qty : {$sum : 1}}},
            ]
        );
        return decksDataAggregate;
    },
    getDecksDataByState({state, Formats_id, limit, page}){
        var decksDataAggregate = DecksData.aggregate(
            [
                {$match: {Formats_id : Formats_id}},
                {$group: {_id : "$state", qty : {$sum : 1}}},
            ]
        );
        return decksDataAggregate;
    },
    adminUpdateDeck({DecksData_id, deck}){
        DecksData.update({_id : DecksData_id},
            {
                $set : deck
            })
    },
    getDeckWithInformation({DecksData_id}){
        var deck = DecksData.aggregate(
            [
                {
                    $match: {
                        _id : DecksData_id
                    }
                },
                {
                    $project: {
                        Formats_id : 1,
                        main : 1,
                        sideboard : 1,
                        player : 1,
                        cards : {
                            $setUnion :
                                [
                                    {$map : {input : "$main", as : "main", in : "$$main.name"}},
                                    {$map : {input : "$sideboard", as : "sideboard", in : "$$sideboard.name"}}
                                ]
                        }
                    }
                },
                {
                    $unwind: {
                        path : "$cards"
                    }
                },
                {
                    $lookup: {
                        "from" : "CardsCollectionSimplified",
                        "localField" : "cards",
                        "foreignField" : "name",
                        "as" : "cardsInfo"
                    }
                },
                {
                    $group: {
                        _id : "$_id",
                        Formats_id : {$first : "$Formats_id"},
                        player : {$first : "$player"},
                        DecksNames_id : {$first : "$DecksNames_id"},
                        main : {$first : "$main"},
                        sideboard : {$first : "$sideboard"},
                        cardsInfo : {$push : {$arrayElemAt : ["$cardsInfo", 0]}}
                    }
                }
            ]
        );
        if(deck.length == 0){
            return {main : [], sideboard : [], cardsInfo : []}
        }
        return deck[0];
    },
    confirmEventAdminChanges({decks}){
        console.log(decks);
        for(var i =0; i < decks.length; i++){
            DecksData.update({_id : decks[i]._id},
                {
                    $set : decks[i]
                })
        }
        return false;
    }
});