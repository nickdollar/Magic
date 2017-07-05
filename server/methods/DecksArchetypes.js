import sizeof from "object-sizeof";


Meteor.methods({
    //CREATE NEW
    fixArchetypesColorsAbbreviation: function () {
        logFunctionsStart("fixArchetypesColorsAbbreviation");

        DecksArchetypes.find({}).forEach(function(obj){
            var name = deckNameAndArchetypeFix(obj.name);
            DecksArchetypes.update({_id : obj._id}, {$set : {name : name}});
        })

        logFunctionsEnd("fixArchetypesColorsAbbreviation");

    },
    DecksArchetypesSideboardMethod({DecksArchetypes_id}) {
        logFunctionsStart("DecksArchetypesSideboard");

        var sideboardCards = DecksArchetypes.aggregate(
            [
                {
                    $match: {
                        _id : DecksArchetypes_id
                    }
                },
                {
                    $project: {
                        _id : 1
                    }
                },
                {
                    $lookup: {
                        "from" : "DecksData",
                        "localField" : "_id",
                        "foreignField" : "DecksArchetypes_id",
                        "as" : "deck"
                    }
                },
                {
                    $unwind: {
                        path : "$deck",
                        includeArrayIndex : "arrayIndex", // optional
                        preserveNullAndEmptyArrays : false // optional
                    }
                },

                {
                    $project: {
                        card : "$deck.sideboard"
                    }
                },
                {
                    $unwind: {
                        path : "$card"
                    }
                },

                // Stage 7
                {
                    $group: {
                        _id : "$card.Cards_id",
                        qty : {$sum : 1},
                        avg : {$avg : "$card.qty"},
                        totalQty : {$sum : "$card.qty"}
                    }
                },

                {
                    $sort: {
                        qty : -1
                    }
                },

            ]
        );

        DecksArchetypes.update({_id : DecksArchetypes_id},
            {
                $set : {sideboardCards : sideboardCards}
            })

        logFunctionsEnd("DecksArchetypesSideboard");

    },
    DecksArchetypesGetCardsListMethod({DecksArchetypes_id}){
        var allCards = DecksArchetypes.aggregate(
            [
                {
                    $match: {
                        _id : DecksArchetypes_id
                    }
                },
                {
                    $project: {
                        CardsDecksData_ids : 1
                    }
                },
                {
                    $unwind: "$CardsDecksData_ids"
                },
                {
                    $project: {
                        _id : 0,
                        Cards_id : "$CardsDecksData_ids.Cards_id",
                        DecksData_ids : "$CardsDecksData_ids.DecksData_ids",
                    }
                },
                {
                    $lookup: {
                        "from" : "CardsSimple",
                        "localField" : "Cards_id",
                        "foreignField" : "_id",
                        "as" : "info"
                    }
                },
                {
                    $unwind: "$info"
                },
            ]
        );
        var allDecks = DecksData.find({DecksArchetypes_id : DecksArchetypes_id},
                        {fields : {
                            Events_id : 1, date : 1, EventsTypes_id : 1, player : 1, position : 1, victory : 1, loss: 1, loss : 1
        }}).fetch()
        var response = {allCards : allCards, allDecks : allDecks}
        return response

    },
    findAllDecksArchetypesMethod: function ({DecksArchetypes_id}) {
        logFunctionsStart("findAllDecksArchetypesMethod");

        var cardsFound = DecksArchetypes.aggregate([
            {
                $match : {
                    _id : DecksArchetypes_id
                },
            },
            {
                $unwind : "$manual.cards"
            },
            {
                $project : {
                    name : "$manual.cards.name",
                    qty : "$manual.cards.qty"

                }
            },
            {
                $lookup : {
                    "from" : "CardsSimple",
                    "localField" : "name",
                    "foreignField" : "_id",
                    "as" : "info"
                }
            },
            {
              $unwind : "$info"
            },
            {
                $match : {
                    "info.types" : {$ne : "land"}
                }
            },
            {
                $group : {
                    _id : "$name",
                    qty : {$first : "$qty"}
                }
            },
            {
                $sort : {
                    qty : -1
                }
            }
        ])

        var cards = [];
        for(var i = 0; i < cardsFound.length; i++){
            if(cards.length > 5){
                if(cardsFound[i -1].qty != cardsFound[i].qty)
                    break;
                }
            cards.push(cardsFound[i]._id);
        }

        var foundDecks = DecksData.find({state : {$nin : ["manual", "pending"]}, "main.Cards_id" : {$all : cards}}, {fields : {_id : 1}}).map(deck => deck._id);
        DecksData.update({_id : {$in : foundDecks}},
        {
            $set : {state : "archetypeAuto", DecksArchetypes_id : DecksArchetypes_id}
        },
        {
            multi : true
        }
        )



        logFunctionsEnd("findAllDecksArchetypesMethod");

    },
    CreateCardListMethod: function () {
        logFunctionsStart("CreateCardListMethod");

        var allArchetypesCards = DecksArchetypes.aggregate(

            // Pipeline
            [
                // Stage 1
                {
                    $project: {
                        _id : 1
                    }
                },

                // Stage 2
                {
                    $lookup: {
                        "from" : "DecksData",
                        "localField" : "_id",
                        "foreignField" : "DecksArchetypes_id",
                        "as" : "DecksData"
                    }
                },

                // Stage 3
                {
                    $unwind: "$DecksData"
                },
                {
                    $match : {
                        state : "manual"
                    }
                },

                // Stage 4
                {
                    $project: {
                        main : "$DecksData.main"
                    }
                },

                // Stage 5
                {
                    $unwind: {
                        path : "$main",
                    }
                },

                // Stage 6
                {
                    $group: {
                        _id : {DecksArchetypes_id : "$_id", Cards_id : "$main.Cards_id"},
                        qty : {$sum : 1}
                    }
                },

                // Stage 7
                {
                    $sort: {
                        qty : -1
                    }
                },

                // Stage 8
                {
                    $group: {
                        _id : "$_id.DecksArchetypes_id",
                        cards : {$push : {name : "$_id.name", qty : "$qty"}}
                    }
                },

            ]
        );

        allArchetypesCards.forEach((archetype)=>{
            DecksArchetypes.update({_id : archetype._id},
                {
                    $set : {"manual.cards" : archetype.cards, "manual.decksQty" : archetype.cards[0].qty}
                })
        })

        logFunctionsEnd("CreateCardListMethod");
    },
    addArchetypeMethod(form) {
        logFunctionsStart("addArchetype");
            form.name = form.name.toTitleCase();
            form.link = form.name.replace(/\s/g, "")
            DecksArchetypes.update(form,
                {
                    $set : form
                },
                {
                    upsert : true
                })
        logFunctionsEnd("addArchetype");
        return {confirm : true, response : ""}
    },
    getSideboardMethods({DecksArchetypes_id}) {
        var foundArchetype = DecksArchetypes.find({_id : DecksArchetypes_id}, {fields : {sideboardCards : 1}, limit : 1}).fetch();
        if(foundArchetype){
            return foundArchetype[0].sideboardCards;
        }
    },
    updateDeckArchetype(form){
        if(Roles.userIsInRole(Meteor.user(), ['admin'])){
            DecksArchetypes.update(  {_id : form._id},
                {
                    $set : form
                }
            )
        };
    },

    removeDecksArchetypes({DecksArchetypes_id}){
        if(Roles.userIsInRole(Meteor.user(), ['admin'])){
            DecksData.update({DecksArchetypes_id : DecksArchetypes_id},
                {
                    $set : {state : "nameRemoved"},
                    $unset : {DecksArchetypes_id : ""}
                },
                {
                    multi : true
                }
            )
            DecksDataUniqueWithoutQty.remove({DecksArchetypes_id : DecksArchetypes_id});
            DecksArchetypes.remove({_id : DecksArchetypes_id});
        };
    },
    findAllCardsMethodNonLands({DecksData_id}){
        console.log("findAllCardsMethodNonLands");
        var foundDeck = DecksData.findOne({_id : DecksData_id});

        var foundCards = DecksData.aggregate(
            [
                {
                    $match: {
                        _id : DecksData_id
                    }
                },
                {
                    $project: {
                        card : {
                            $map : {
                                input : "$main",
                                as : "card",
                                in :  "$$card.Cards_id"
                            }
                        }
                    }
                },
                {
                    $unwind: {
                        path : "$card",
                    }
                },
                {
                    $lookup: {
                        "from" : "CardsSimple",
                        "localField" : "card",
                        "foreignField" : "_id",
                        "as" : "info"
                    }
                },
                {
                    $match: {
                        "info.types" : {$ne : "land"}
                    }
                },
                {
                    $group: {
                        _id : "$_id",
                        cards : {$addToSet : "$card"}
                    }
                },
            ]
        );

        var foundArchetypes = DecksArchetypes.find({Formats_id : foundDeck.Formats_id, cards : {$exists : true}}, {fields : {cards : 1, name : 1, decksQty : 1}}).fetch();

        for(var i = 0; i < foundArchetypes.length; i++){
            if(foundArchetypes[i].cards){
                foundArchetypes[i].cardQty = foundArchetypes[i].cards.length;
                foundArchetypes[i].cards = foundArchetypes[i].cards.filter((card)=>{
                                            var index = foundCards[0].cards.findIndex((foundCard)=>{
                                                return foundCard == card.Cards_id;
                                            })
                                            if(index != -1){
                                                    // if(foundArchetypes[i].decksQty > 5){
                                                    //     if(foundArchetypes[i].cards[index].qty/foundArchetypes[i].decksQty > 0.5){
                                                            return true;
                                                        // }
                                                    // }
                                            }
                                            return false;
                                            })
            }
        }

        var result = [];



        for(var i = 0 ; i < foundArchetypes.length; i++){

            var foundQty = foundArchetypes[i].cards ? foundArchetypes[i].cards.length : 0;
            result.push({
                foundQty : foundQty,
                cardsQty : foundCards[0].cards.length,
                percentage : foundQty/foundCards[0].cards.length,
                name : foundArchetypes[i].name,
                DecksArchetypes_id : foundArchetypes[i]._id,
            })
        }

        result = result.sort((a, b)=>{
            return b.percentage - a.percentage;
        })

        return result[0];
    },
    findAllCardsMethodWithLands({DecksData_id}){
        console.log("findAllCardsMethodWithLands");
        var foundDeck = DecksData.findOne({_id : DecksData_id});

        var foundCards = DecksData.aggregate(
            [
                {$match: {_id : DecksData_id}},
                {
                    $project: {
                        card : {
                            $map : {
                                input : "$main",
                                as : "card",
                                in :  "$$card.Cards_id"
                            }
                        }
                    }
                },
                {$group: {_id : "$_id", cards : {$first : "$card"}}},
            ]
        );
        var foundArchetypes = DecksArchetypes.find({Formats_id : foundDeck.Formats_id, cards : {$exists : true}}, {fields : {cards : 1, name : 1, decksQty : 1}}).fetch();

        for(var i = 0; i < foundArchetypes.length; i++){
            if(foundArchetypes[i].cards){
                foundArchetypes[i].cards = foundArchetypes[i].cards.filter((card)=>{
                    var index = foundCards[0].cards.findIndex((foundCard)=>{
                        return foundCard == card.Cards_id;
                    })
                    if(index != -1){
                        // if(foundArchetypes[i].decksQty > 5){
                        //     if(foundArchetypes[i].cards[index].qty/foundArchetypes[i].decksQty > 0.5){
                        return true;
                        // }
                        // }
                    }
                    return false;
                })
            }
        }

        var result = [];

        for(var i = 0 ; i < foundArchetypes.length; i++){
            var foundQty = foundArchetypes[i].cards ? foundArchetypes[i].cards.length : 0;
            result.push({
                foundQty : foundQty,
                cardsQty : foundCards[0].cards.length,
                percentage : foundQty/foundCards[0].cards.length,
                name : foundArchetypes[i].name,
                DecksArchetypes_id : foundArchetypes[i]._id
            })
        }

        result = result.sort((a, b)=>{
            return b.percentage - a.percentage;
        })

        return result[0];
    },
    AllArchetypesCardsMethod(){
        logFunctionsStart("AllArchetypesCards");

        var allCardsPerDeck = DecksArchetypes.aggregate(

            // Pipeline
            [
                // Stage 1
                {
                    $lookup: {
                        "from" : "DecksData",
                        "localField" : "_id",
                        "foreignField" : "DecksArchetypes_id",
                        "as" : "DecksData"
                    }
                },

                // Stage 2
                {
                    $unwind: "$DecksData"
                },

                // Stage 3
                {
                    $match: {
                        "DecksData.state" : "manual"
                    }
                },

                // Stage 4
                {
                    $group: {
                        _id : "$_id",
                        DecksData : {$push : "$DecksData"},
                        qty : {$sum : 1}
                    }
                },

                // Stage 5
                {
                    $match: {
                        qty : {$gte : 5},
                    }
                },

                // Stage 6
                {
                    $unwind: "$DecksData"
                },

                // Stage 7
                {
                    $project: {
                        main : "$DecksData.main"
                    }
                },

                // Stage 8
                {
                    $unwind: "$main"
                },

                // Stage 9
                {
                    $lookup: {
                        "from" : "CardsSimple",
                        "localField" : "main.Cards_id",
                        "foreignField" : "_id",
                        "as" : "info"
                    }
                },

                // Stage 10
                {
                    $match: {
                        "info.types" : {$ne : "land"}
                    }
                },

                // Stage 11
                {
                    $group: {
                        _id : {_id : "$_id", "name" : "$main.Cards_id"},
                        qty : {$sum : 1}
                    }
                },

                // Stage 12
                {
                    $sort: {
                        qty : -1
                    }
                },

                // Stage 13
                {
                    $group: {
                        _id : "$_id._id",
                        cards : {$push : {name : "$_id.name", qty : "$qty"}}
                    }
                },

            ]

        );

        allCardsPerDeck.forEach((aggregate)=>{
          var cards = [];
          var top = aggregate.cards[0].qty;
          for(var i = 0; i < aggregate.cards.length; i++){
              if(aggregate.cards[i].qty < top){
                if(cards.length > 5){
                    break;
                }
              }
              cards.push(aggregate.cards[i].name);
          }
        })
    },
    importFromDecksArchetypesMethod({DecksArchetypes_id, percentageMain, percentageSide}){


        var foundArchetype = DecksArchetypes.findOne({_id : DecksArchetypes_id});


        var main = foundArchetype.mainCards.sort((a, b)=>{
            return b.qty - a.qty;
        })

        var sideboard = foundArchetype.sideboardCards.sort((a, b)=>{
            return b.qty - a.qty;
        })

        var response = {main : [], sideboard : []};

        console.log(main);
        console.log(sideboard);

        for(var i = 0; i < main.length; i++){
            if(main[i].qty/main[0].qty > percentageMain/100){
                response.main.push({Cards_id : main[i].Cards_id, qty : main[i].avg});
            }
        }

        for(var i = 0; i < sideboard.length; i++){
            if(sideboard[i].qty/sideboard[0].qty > percentageSide/100){
                response.sideboard.push({Cards_id : sideboard[i].Cards_id, qty : sideboard[i].avg});
            }
        }

        console.log(response.main);
        console.log(response.sideboard);
        return response;
    }

})


createAllInfoForAllDecksArchetypes = ()=>{
    logFunctionsStart("createAllInfoForAllDecksArchetypes");
    DecksArchetypes.find({}).forEach((DeckArchetype)=>{
        createDecksArchetypesMainCards({DecksArchetypes_id : DeckArchetype._id});
        createDecksArchetypesSideboardCards({DecksArchetypes_id : DeckArchetype._id});
        createCardsDecksData_ids({DecksArchetypes_id : DeckArchetype._id});
        createArchetypesDecksQty({DecksArchetypes_id : DeckArchetype._id});
    })
    logFunctionsEnd("createAllInfoForAllDecksArchetypes");
}

createDecksArchetypesMainCards = ({DecksArchetypes_id})=>{
    var decksArchetypesCards = DecksData.aggregate(
        [
            {
                $match: {
                    DecksArchetypes_id : DecksArchetypes_id
                }
            },
            {
                $project: {
                    main : 1
                }
            },
            {
                $unwind: "$main"
            },
            {
                $group: {
                    _id : "$main.Cards_id",
                    qty : {$sum : 1},
                    avg : {$avg : "$main.qty"},
                    totalQty : {$avg : "$main.qty"}
                }
            },
            {
                $sort: {
                    qty : -1
                }
            },
            {
                $project: {
                    _id : 0,
                    Cards_id : "$_id",
                    qty : 1,
                    avg : 1,
                    totalQty : 1
                }
            }
        ]
    );

    DecksArchetypes.update({_id : DecksArchetypes_id},
        {
            $set : {mainCards : decksArchetypesCards}
        })
}


createDecksArchetypesSideboardCards = ({DecksArchetypes_id})=>{
    logFunctionsStart("DecksArchetypesSideboard");

    var sideboardCards = DecksData.aggregate(
        [
            {
                $match: {
                    DecksArchetypes_id : DecksArchetypes_id
                }
            },
            {
                $project: {
                    sideboard : 1
                }
            },
            {
                $unwind: {
                    path : "$sideboard"
                }
            },
            {
                $group: {
                    _id : "$sideboard.Cards_id",
                    qty : {$sum : 1},
                    avg : {$avg : "$sideboard.qty"},
                    totalQty : {$sum : "$sideboard.qty"}
                }
            },
            {
                $sort: {
                    qty : -1
                }
            },
            {
                $project: {
                    _id : 0,
                    Cards_id : "$_id",
                    qty : 1,
                    avg : 1,
                    totalQty : 1
                }
            }

        ]
    );

    DecksArchetypes.update({_id : DecksArchetypes_id},
        {
            $set : {sideboardCards : sideboardCards}
        })

    logFunctionsEnd("DecksArchetypesSideboard");

}

createCardsDecksData_ids = ({DecksArchetypes_id})=>{
    logFunctionsStart("createCardsDecksData_ids");
    var allCards = DecksData.aggregate([
        {
            $match : {
                DecksArchetypes_id : DecksArchetypes_id
            }
        },
        {
            $project : {
                main : 1
            }
        },
        {
            $unwind : "$main"
        },
        {
            $group : {
                _id : "$main.Cards_id",
                Cards_id : {$first : "$main.Cards_id"},
                DecksData_ids : {$push : "$_id"},
            }
        },
        {
            $project : {
                _id : 0,
                Cards_id : 1,
                DecksData_ids : 1
            }
        }
    ])


    allCards = allCards.sort((a, b)=>{
        return b.length - a.length;
    })

    DecksArchetypes.update({_id : DecksArchetypes_id},
        {
            $set : {CardsDecksData_ids : allCards}
        })
    logFunctionsEnd("createCardsDecksData_ids");
}

createArchetypesDecksQty = ({DecksArchetypes_id})=>{
    logFunctionsEnd("createArchetypesDecksQty");
        DecksArchetypes.update({_id : DecksArchetypes_id},
            {
                $set : {decksQty : DecksData.find({DecksArchetypes_id : DecksArchetypes_id}).count()}
            })
    logFunctionsEnd("createArchetypesDecksQty");
}