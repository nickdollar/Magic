Meteor.methods({
    addALGSDecksData: function (deck) {
        var totalMain = deck.main.reduce((a, b)=>{
            return a + b.quantity
        }, 0);

        var totalSideboard = deck.sideboard.reduce((a, b)=>{
            return a + b.quantity
        }, 0);

        var colors = setUpColorForDeckName(deck.main);

        deck.main = deck.main.map((card)=>{
            return {name : card.name, quantity : card.quantity }
        })
        deck.sideboard = deck.sideboard.map((card)=>{
            return {name : card.name, quantity : card.quantity }
        })

        // console.log(deck);
        var message = "Deck Added";
        if(DecksData.find({Events_id : deck._id, player : deck.player}, {limit : 1}).count()){
            message = "Deck Updated"
        }

        if(Events.findOne({LGS_id : deck.LGS_id, token : deck.token})){
            console.log(DecksData.update({Events_id : deck._id, player : deck.player},
                {
                    $set : {
                        Events_id : deck._id,
                        format : deck.format,
                        type : "lgs",
                        totalMain : totalMain,
                        main : deck.main,
                        colors : colors,
                        player : deck.player,
                        totalSideboard : totalSideboard,
                        sideboard : deck.sideboard,
                        date : deck.date,
                        state : "lgs"
                    }
                },
                {
                    upsert : true
                }
            ))
        }

        return message;
    },
    updateALGSDecksData: function (deck) {
        var totalMain = deck.main.reduce((a, b)=>{
            return a + b.quantity
        }, 0);

        var totalSideboard = deck.sideboard.reduce((a, b)=>{
            return a + b.quantity
        }, 0);

        var colors = setUpColorForDeckName(deck.main);

        deck.main = deck.main.map((card)=>{
            return {name : card.name, quantity : card.quantity }
        })
        deck.sideboard = deck.sideboard.map((card)=>{
            return {name : card.name, quantity : card.quantity }
        })

        if(Events.findOne({_id : deck.Events_id})){
            DecksData.update({_id : deck._id},
                {
                    $set : {
                        colors : colors,
                        totalMain : totalMain,
                        main : deck.main,
                        totalSideboard : totalSideboard,
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

            var cardResult = {name : card.name, quantity : card.quantity}
            if(!cardQuery){
                Object.assign(cardResult, {wrongName : true})
            }
            return cardResult;
        })

        var sideboard = mainSide.sideboard.map((card)=>{
            var cardQuery = CardsData.findOne({name : card.name});

            var cardResult = {name : card.name, quantity : card.quantity}
            if(!cardQuery){
                Object.assign(cardResult, {wrongName : true})
            }
            return cardResult;
        })

        var totalMain = mainSide.main.reduce((a, b)=>{
            return a + b.quantity
        }, 0);

        var totalSideboard = mainSide.sideboard.reduce((a, b)=>{
            return a + b.quantity
        }, 0);

        var colors = setUpColorForDeckName(main);
        console.log(DecksData_id);
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
        console.log(DecksData_id);
        DecksData.remove({_id : DecksData_id});
    },
    addDeckName_idToDeckData(DecksData_id, DecksNames_id){
        addNameToDeck(DecksData_id, DecksNames_id);
        DecksData.update({_id : DecksData_id},
            {
                $set : {state : "manual"}
            })
    },
    recheckDeckWithWrongCardName(format){
        var cardsWithWrongName = DecksData.aggregate([
            {
                $match : {
                    format: format,
                    type : {$in : ["league", "daily"]},
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

        cardsWithWrongName.forEach((card)=>{
            var cardQuery = CardsData.findOne({name : card._id});
            if(cardQuery){
                  DecksData.update  (  {"main.name" : cardQuery.name},
                                        {
                                            $unset : { "main.$.wrongName" : ""}
                                        },
                                        {
                                            multi : true
                                        }
                                    )

                DecksData.update  (  {"sideboard.name" : cardQuery.name},
                    {
                        $unset : { "sideboard.$.wrongName" : ""}
                    },
                    {
                        multi : true
                    }
                )
            }
        })
    }
})

