simplifyData = function(){
    metaValue();
    lastCardValues();
    lastEvents();
    lastCardDecks();
}


metaValue = function() {

    var formats = ["modern", "standard", "legacy", "vintage"];
        for (var a = 0; a < formats.length; a++) {
            var deckNames = _DeckNames.find({format : formats[a]}).map(function(deckName){ return deckName.name});
            var date = getWeekStartAndEnd();
            var weekStart = new Date(date.weekStart);
            var weekEnd = new Date(date.weekEnd);

            var metaValues = _MetaValues.find({format: formats[a]}, {sort: {weekDate: 1}}).fetch();
            metaValues.pop();
            var weeksTotal = [];
            var total = 0;
            var total2 = 0;

            for(var i = 0; i < metaValues.length; i++) {
                if (metaValues[i].type.hasOwnProperty("daily3_1")) {
                    total += metaValues[i].type.daily3_1.deckTotal;
                }
                if (metaValues[i].type.hasOwnProperty("daily4_0")) {
                    total += metaValues[i].type.daily4_0.deckTotal;
                }
                if (metaValues[i].type.hasOwnProperty("ptqTop8")) {
                    total += metaValues[i].type.ptqTop8.deckTotal;
                }
                if (metaValues[i].type.hasOwnProperty("ptqTop9_16")) {
                    total += metaValues[i].type.ptqTop9_16.deckTotal;
                }
                if (metaValues[i].type.hasOwnProperty("ptqTop17_32")) {
                    total += metaValues[i].type.ptqTop17_32.deckTotal;
                }
                weeksTotal.push(total);
                if(i > metaValues.length -3 && total2 == 0){
                    total2 = total;
                }
            }

            var results2 = [];
            var results = [];
            for(var i = 0; i < deckNames.length; i++){
                var quantity = 0;
                var quantity2 = 0;
                var bars = [];
                for(var j = 0; j < metaValues.length; j++) {
                    if (metaValues[j].type.hasOwnProperty("daily3_1")) {
                        if(metaValues[j].type.daily3_1.decks.hasOwnProperty(deckNames[i])) {
                            quantity += metaValues[j].type.daily3_1.decks[deckNames[i]];
                        }
                    }
                    if (metaValues[j].type.hasOwnProperty("daily4_0")) {
                        if(metaValues[j].type.daily4_0.decks.hasOwnProperty(deckNames[i])) {
                            quantity += metaValues[j].type.daily4_0.decks[deckNames[i]];
                        }
                    }
                    if (metaValues[j].type.hasOwnProperty("ptqTop8")) {
                        if(metaValues[j].type.ptqTop8.decks.hasOwnProperty(deckNames[i])) {
                            quantity += metaValues[j].type.ptqTop8.decks[deckNames[i]];
                        }
                    }
                    if (metaValues[j].type.hasOwnProperty("ptqTop9_16")) {
                        if(metaValues[j].type.ptqTop9_16.decks.hasOwnProperty(deckNames[i])){
                            quantity += metaValues[j].type.ptqTop9_16.decks[deckNames[i]];
                        }
                    }
                    if (metaValues[j].type.hasOwnProperty("ptqTop17_32")) {
                        if(metaValues[j].type.ptqTop17_32.decks.hasOwnProperty(deckNames[i])) {
                            quantity += metaValues[j].type.ptqTop17_32.decks[deckNames[i]];
                        }
                    }
                    bars.push({percent : prettifyPercentage((quantity/weeksTotal[j]), 2), week : metaValues[j].weekDate});
                }

                bars = bars.slice(bars.length-6,bars.length);
                var barColors = [];

                for(var k = 0; k < bars.length -1; k++){
                    var change = (bars[k+1].percent - bars[k].percent).toFixed(2);
                    var item = {};
                    item.week = bars[k+1].week;
                    item.change = change;
                    item.value = bars[k+1].percent;
                    if(change < 0){
                        item.color = "red";
                    }else if(change > 0){
                        item.color = "green";
                    }else{
                        item.value = 0;
                        item.color = "gray";
                    }
                    barColors.push(item);
                }
                var weekChange = (bars[bars.length-1].percent - bars[bars.length-2].percent).toFixed(2);
                results.push({name : deckNames[i], percent : parseFloat(
                    prettifyPercentage((quantity/total), 2)), weekChange : weekChange});
                results2.push({name : deckNames[i], percent : parseFloat(
                    prettifyPercentage((quantity2/total2), 2))});
            }
            weekStart.setDate(weekStart.getDate() - 7);
            weekEnd.setDate(weekEnd.getDate() - 7);

            results.sort(function(a, b){return b.percent - a.percent});
            results2.sort(function(a, b){return b.percent - a.percent});

            var oldPosition = {};
            for(var i = 0; i < results2.length; i++){
                oldPosition[results2[i].name] = i;
            }

            for(var i = 0; i < results.length; i++){
                var change = oldPosition[results[i].name] - i;

                if(change > 0){
                    results[i].upDown = "up";
                }else if(change < 0){
                    results[i].upDown = "down";
                }else{
                    results[i].upDown = "neutral";
                }
                results[i].change = Math.abs(change);
            }
            results.sort(function(a, b){return Math.abs(b.weekChange) - Math.abs(a.weekChange)});
            results = results.splice(0, 20);

            _simplifiedTables.update(
                { format : formats[a]},
                {
                    $set : {decks : results},
                    $setOnInsert : {decks : results}
                },
                {upsert : true}
            );
    }
}


lastCardValues = function(){

    var daily3_1 = {type : "daily3_1", options : { victory : 3, loss : 1, eventType : "daily"}};
    var daily4_0 = {type : "daily4_0", options : { victory : 4, loss : 0, eventType : "daily"}};
    var ptqTop8 = {type : "ptqTop8", options : { position : {$gte : 1, $lte : 8}, eventType : "ptq"}};
    var ptqTop9_16 = {type : "ptqTop9_16", options : { position : {$gte : 9, $lte : 16}, eventType : "ptq"}};
    var ptqTop17_32 = {type : "ptqTop17_32", options : { position : {$gte : 17, $lte : 32}, eventType : "ptq"}};

    var options = ["daily3_1", "daily4_0", "ptqTop8", "ptqTop9_16", "ptqTop17_32"];

    var formats = ["modern", "standard", "legacy", "vintage"];

    for(var a = 0; a< formats.length; a++) {
        var weeks = _cardWeekQuantity.find({format : formats[a]}, {sort : {weekDate : 1}}).fetch();
        var cards = {};
        var cardsWeekBefore = {};
        for (var i = 0; i < weeks.length - 1; i++) {
            for (var j = 0; j < options.length; j++) {
                for (var cardName in weeks[i][options[j]]) {
                    if (!cards.hasOwnProperty(cardName)) {
                        cards[cardName] = {
                            "total": 0,
                            "inDecks": 0,
                            "totalMain": 0,
                            "inDecksSideboard": 0,
                            "totalSideboard": 0
                        };
                    }

                    for (var cardValues in weeks[i][options[j]][cardName]) {
                        cards[cardName][cardValues] += weeks[i][options[j]][cardName][cardValues];
                    }
                }
            }
            if (i == weeks.length - 3) {
                cardsWeekBefore = JSON.parse(JSON.stringify(cards));
            }
        }

        var total = 0;
        var totalWeekBefore = 0;
        for (var i = 0; i < weeks.length - 1; i++) {
            total += weeks[i]["daily3_1Total"] + weeks[i]["daily4_0Total"] + weeks[i]["ptqTop8Total"] + weeks[i]["ptqTop9_16Total"] + weeks[i]["ptqTop17_32Total"];
            if (i == weeks.length - 3) {
                totalWeekBefore = total;
            }
        }

        var percentage = {};
        for (var cardName in cards) {
            percentage[cardName] = cards[cardName].inDecks / total;
        }

        var percentageWeekBefore = {};
        for (var cardName in cardsWeekBefore) {
            percentageWeekBefore[cardName] = cardsWeekBefore[cardName].inDecks / totalWeekBefore;
        }


        var finalChange = [];
        for (var cardName in percentageWeekBefore) {
            finalChange.push({name: cardName, change: prettifyPercentage(percentage[cardName] - percentageWeekBefore[cardName], 2)});
        }

        finalChange.sort(function (a, b) {
            return Math.abs(b.change) - Math.abs(a.change)
        });
        finalChange = finalChange.splice(0, 20);
        _simplifiedTables.update({format: formats[a]},
            {
                $set: {cards: finalChange},
                $setOnInsert: {
                    cards: finalChange
                }
            },
            {upsert: true}
        )
    }
}

lastEvents = function(){
    var date = new Date();
    date.setDate(date.getDate - 13);

    var formats = ["modern", "standard", "legacy", "vintage"];

    for(var a = 0; a< formats.length; a++) {
        var ptq = _Event.find({format: formats[a], eventType: "ptq", date: {$gte: date}}, {sort: {date: -1}}).fetch();
        var daily = _Event.find({format: formats[a], eventType: "daily", date: {$gte: date}}, {limit: 15, sort: {date: -1}}).fetch();
        var events = ptq.concat(daily);

        _simplifiedTables.update({format: formats[a]},
            {
                $set: {events: events},
                $setOnInsert: {
                    events: events
                }
            },
            {upsert: true}
        )
    }
}

lastCardDecks = function(){
    var date = new Date();
    date.setDate(date.getDate - 13);

    var formats = ["modern", "standard", "legacy", "vintage"];

    for(var a = 0; a< formats.length; a++){
        var newDecks = _DeckNames.find({format : formats[a], date : {$gte : date }}, {sort : {date : -1}}).fetch();
        var newCards = _formatsCards.find({format : formats[a], date : {$gte : date }}, {sort : {date : -1}}).fetch();

        _simplifiedTables.update({format : formats[a]},
            {
                $set : {newDecks : newDecks},
                $setOnInsert: {
                    newDecks : newDecks
                }
            },
            {upsert: true}
        )

        _simplifiedTables.update({format : formats[a]},
            {
                $set : {newCards : newCards},
                $setOnInsert: {
                    newCards : newCards
                }
            },
            {upsert: true}
        )
    }
}

