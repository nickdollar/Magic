makeDeck = function(){
    console.log("Make meta start");
    var decksQuery = _Deck.find({}).fetch();

    decksQuery.forEach(function(decksObj){
        var totalMain = 0;
        var totalSideboard = 0;
        var mainDeckQuery = _DeckCards.find({_deckID : decksObj._id, sideboard : false}).map(function(deckCardsObj){
            totalMain += parseInt(deckCardsObj.quantity);
            return {name : deckCardsObj.name, quantity : parseInt(deckCardsObj.quantity)};
        });
        var sideboardsQuery = _DeckCards.find({_deckID : decksObj._id, sideboard : true}).map(function(deckCardsObj){
            totalSideboard += parseInt(deckCardsObj.quantity);
            return {name : deckCardsObj.name, quantity : parseInt(deckCardsObj.quantity)};
        });

        var baseId = {_eventID : decksObj._eventID, date : decksObj.date, player : decksObj.player, eventType : decksObj.eventType };
        var results = {
            format : decksObj.format, colors : decksObj.colors, name : decksObj.name, totalMain : totalMain,
            totalSideboard: totalSideboard, main : mainDeckQuery, sideboard : sideboardsQuery
        };
        var allResults = {};
        for(var key in baseId){
            allResults[key] = baseId[key];
        }

        for(var key in results){
            allResults[key] = results[key];
        }

        if(typeof decksObj.position !== "undefined"){
            results["position"] = decksObj.position;
        }else{
            results["victory"] = decksObj.victory;
            results["draw"] = decksObj.draw;
            results["loss"] = decksObj.loss;
        }
        _eventDecks.update(baseId,
            {
                $set : results,
                $setOnInsert : allResults
            },
            {
                upsert : true
            }
        );
    });
};

weeklyCardChange = function(){

    console.log("WeeklyDeckChange Start");
    var options = {types : ["daily4_0", "daily3_1", "ptqTop8", "ptqTop9_16", "ptqTop17_32"], dates : ["twoWeeks", "sixWeeks", "year"]},
        typesCombinations = positionCombinationsOptions(options.types),
        dates = getDateSyntax(options.dates),
        format = "modern";

    dates.forEach(function(datesObj){
        typesCombinations.forEach(function(typesCombinationsObj){
            var allDecksQuery = _eventDecks.find({format : format, $or : typesCombinationsObj.values, date : {$gte : datesObj.date }}).fetch();
            var cardsValueMainboard = [];
            var cardsValueSideboard = [];
            allDecksQuery.forEach(function(allDecksObj){
                allDecksObj.main.forEach(function(mainObj){
                    var card = cardsValueMainboard.find(function(mainObjObj){
                        return mainObjObj.name === mainObj.name;
                    });
                    if(card == null){
                        cardsValueMainboard.push({name : mainObj.name, quantity : mainObj.quantity, inDecks : 1});
                    }else{
                        card.quantity += mainObj.quantity;
                        card.inDecks += 1;
                    }
                });

                allDecksObj.sideboard.forEach(function(mainObj){
                    var card = cardsValueMainboard.find(function(mainObjObj){
                        return mainObjObj.name === mainObj.name;
                    });
                    if(card == null){
                        cardsValueMainboard.push({name : mainObj.name, quantity : mainObj.quantity, inDecks : 1});
                    }else{
                        card.quantity += mainObj.quantity;
                        card.inDecks += 1;
                    }
                });

            });




            cardsValueMainboard.forEach(function(cardsValueMainboardObj){
                cardsValueMainboardObj.percentage = cardsValueMainboardObj.inDecks/allDecksQuery.length;
                cardsValueMainboardObj.perDeck = cardsValueMainboardObj.quantity/cardsValueMainboardObj.inDecks;
            });


            cardsValueSideboard.forEach(function(cardsValueSideboardObj){
                cardsValueSideboardObj.percentage = cardsValueSideboardObj.inDecks/allDecksQuery.length;
                cardsValueSideboardObj.perDeck = cardsValueSideboardObj.quantity/cardsValueSideboardObj.inDecks;
            });

            cardsValueMainboard.sort(function(a,b){
                return b.percentage - a.percentage;
            });

            cardsValueSideboard.sort(function(a,b){
                return b.percentage - a.percentage;
            });


            var base = 999;
            var position = 0;
            cardsValueMainboard.forEach(function(cardsValuesMinaboardObj){
                var percentage = cardsValuesMinaboardObj.percentage;
                if(percentage < base){
                    position++;
                    cardsValuesMinaboardObj.position = position;
                    base = percentage

                }else if(percentage == base){
                    cardsValuesMinaboardObj.position = position;
                }
            });

            base = 999;
            position = 0;
            cardsValueSideboard.forEach(function(cardsValueSideboardObj){
                var percentage = cardsValueSideboardObj.percentage;
                if(percentage < base){
                    position++;
                    cardsValueSideboardObj.position = position;
                    base = percentage

                }else if(percentage == base){
                    cardsValueSideboardObj.position = position;
                }
            });


            var baseId = {date : datesObj.type, typesCombinations : typesCombinationsObj.toString, format : format};
            var results = {
                decksQuantity : allDecksQuery.length, mainboard : cardsValueMainboard, sideboard : cardsValueSideboard
            };
            var allResults = {};
            for(var key in baseId){
                allResults[key] = baseId[key];
            }

            for(var key in results){
                allResults[key] = results[key];
            }

            _metaCards.update(baseId,
                {
                    $set : results,
                    $setOnInsert : allResults
                },
                {
                    upsert : true
                }
            );
        });
    });
    console.log("WeeklyDeckChange End");

};

