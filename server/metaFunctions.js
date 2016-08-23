updateMeta = function(){
    var formats = ["standard", "modern", "legacy", "vintage"];

    var options = [];
    var league = {type : "league", options : { victory : 5, loss : 0, eventType : "league"}};
    var daily3_1 = {type : "daily3_1", options : { victory : 3, loss : 1, eventType : "daily"}};
    var daily4_0 = {type : "daily4_0", options : { victory : 4, loss : 0, eventType : "daily"}};
    var ptqTop8 = {type : "ptqTop8", options : { position : {$gte : 1, $lte : 8}, eventType : "ptq"}};
    var ptqTop9_16 = {type : "ptqTop9_16", options : { position : {$gte : 9, $lte : 16}, eventType : "ptq"}};
    var ptqTop17_32 = {type : "ptqTop17_32", options : { position : {$gte : 17, $lte : 32}, eventType : "ptq"}};

    options.push(daily3_1);
    options.push(daily4_0);
    options.push(ptqTop8);
    options.push(ptqTop9_16);
    options.push(ptqTop17_32);


    for(var a = 0; a < formats.length ; a++){
        var date = getWeekStartAndEnd();
        var weekStart = new Date(date.weekStart);
        var weekEnd = new Date(date.weekEnd);

        var startDate = new Date();
        startDate.setSeconds(0);
        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setMilliseconds(0);

        var dateMidnight = new Date(startDate);
        dateMidnight.setHours(23);
        dateMidnight.setMinutes(59);
        dateMidnight.setSeconds(59);
        dateMidnight.setMilliseconds(999);

        var names = _DeckNames.find({format : formats[a] }).fetch();

        var metaTest = {};
        metaTest.format = formats[a];
        metaTest.type = {};
        var firstDate = _Deck.findOne({}, {sort : {date: 1}}).date;
        firstDate = getWeekStartAndEnd(firstDate).weekStart;
        while(firstDate <= weekStart){
            metaTest.weekDate = weekStart;
            for(var j = 0; j < options.length; j++)
            {
                var deckTotal = _Deck.find({format : formats[a], name : {$exists : true}, date : {$gte : weekStart, $lte : weekEnd}, $and : [options[j].options]}).count();
                if(deckTotal == 0) {
                    continue;
                }
                metaTest.type[options[j].type] = {};
                metaTest.type[options[j].type].deckTotal = deckTotal;
                metaTest.type[options[j].type].decks = {};

                for(var i = 0; i < names.length; i++) {
                    var name = names[i].name;
                    metaTest.type[options[j].type].decks[name] = {};
                    var count = _Deck.find({format: formats[a], date : {$gte : weekStart, $lte : weekEnd}, name: name, $and : [options[j].options]}).count();
                    if(count != 0){
                        metaTest.type[options[j].type].decks[name] = count;
                    }else{
                        delete metaTest.type[options[j].type].decks[name];
                    }
                }
            }
            _MetaValues.update({
                format : metaTest.format,
                weekDate : weekStart
            },
            {
                $set : metaTest,
                $setOnInsert : metaTest
            },
                {upsert : true}
            )
            weekStart.setDate(weekStart.getDate() - 7);
            weekEnd.setDate(weekEnd.getDate() - 7);
        }
    }
}

cardsPercentageValues = function(format, deckName, numOfWeeks){
    var date = getWeekStartAndEnd();
    var weekStart = new Date(date.weekStart);
    var weekEnd = new Date(date.weekEnd);

    for(var k = 0; k < numOfWeeks; k++)
    {
        var decks = _Deck.find({format : format, name : deckName, date : {$gte : weekStart, $lt : weekEnd}}).fetch();
        var cardValues = {};

        for(var i = 0; i < decks.length; i++){
            _DeckCards.find({_deckID : decks[i]._id, sideboard: false}).forEach(function(card){

                if(cardValues.hasOwnProperty(card.name) == false){
                    var cardTemp =_CardDatabase.findOne({name : card.name});
                    cardValues[card.name] = {total : 0, land : cardTemp.land, sideboard : card.sideboard};
                }
                cardValues[card.name].total += parseInt(card.quantity);
            });
        }

        for(var key in cardValues){
            cardValues[key].total = parseFloat((cardValues[key].total/decks.length).toFixed(2));

            _deckCardsWeekChange.update({format : format, deckName : deckName, cardName : key},
                {
                    $set : { weekTotal : cardValues[key].total},
                    $setOnInsert : {format: format, deckName : deckName, sideboard : cardValues[key].sideboard, cardName : key, land : cardValues[key].land}
                },
                {upsert: true}
            );

            _deckCardsWeekChange.update({
                    name : key,
                    deckName : deckName,
                    date : weekStart
                },
                {
                    $set : {quantity : cardValues[key].total},
                    $setOnInsert : {name : key,
                        deckName : deckName,
                        date : weekStart,
                        quantity : cardValues[key].total
                    }
                },
                {upsert: true}
            );
        }

        var cardValues = {};

        for(var i = 0; i < decks.length; i++){
            _DeckCards.find({_deckID : decks[i]._id, sideboard: true}).forEach(function(card){

                if(cardValues.hasOwnProperty(card.name) == false){
                    var cardTemp =_CardDatabase.findOne({name : card.name});
                    cardValues[card.name] = {total : 0, land : cardTemp.land, sideboard : card.sideboard};
                }
                cardValues[card.name].total += parseInt(card.quantity);
            });
        }

        for(var key in cardValues){
            cardValues[key].total = parseFloat((cardValues[key].total/decks.length).toFixed(2));

            _deckCardsWeekChange.update({format : format, deckName : deckName, cardName : key},
                {
                    $set : { weekTotal : cardValues[key].total},
                    $setOnInsert : {format: format, deckName : deckName, sideboard : cardValues[key].sideboard, cardName : key, land : cardValues[key].land}
                },
                {upsert: true}
            );

            _deckCardsWeekChange.update({
                    name : key,
                    deckName : deckName,
                    date : weekStart
                },
                {
                    $set : {quantity : cardValues[key].total},
                    $setOnInsert : {name : key,
                        deckName : deckName,
                        date : weekStart,
                        quantity : cardValues[key].total
                    }
                },
                {upsert: true}
            );
        }

        weekStart.setDate(weekStart.getDate() - 7);
        weekEnd.setDate(weekEnd.getDate() - 7);
    }
}
















deckMetaTest = function(options){

    if(options == null){
        options = {types : ["daily3_1", "daily4_0", "ptqTop8", "ptqTop9_16", "ptqTop17_32"], pagination : 0}
    }



    var deckNames = _DeckNames.find({format : "modern"}).map(function(deckName){ return deckName.name});
    var date = getWeekStartAndEnd();
    var weekStart = new Date(date.weekStart);
    var weekEnd = new Date(date.weekEnd);

    var metaValues = _MetaValues.find({format: "modern"}, {sort: {weekDate: 1}}).fetch();

    var weeksTotal = [];
    var total = 0;
    var total2 = 0;

    for(var i = 0; i < metaValues.length; i++) {

        for(var j = 0; j < options.types.length; j++){
            if (metaValues[i].type.hasOwnProperty(options.types[j])) {
                total += metaValues[i].type[options.types[j]].deckTotal;
            }
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

            for(var k = 0; k < options.types.length; k++) {
                if ( metaValues[j].type.hasOwnProperty(options.types[k])) {
                    if (metaValues[j].type[options.types[k]].decks.hasOwnProperty(deckNames[i])) {
                        quantity += metaValues[j].type[options.types[k]].decks[deckNames[i]];
                    }
                }
            }

            if(j > metaValues.length -3 && quantity2 == 0){
                quantity2 = quantity;
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
        results.push({name : deckNames[i], percent : parseFloat(
            prettifyPercentage((quantity/total), 2)), quantity : quantity, bars : barColors });
        results2.push({name : deckNames[i], percent : parseFloat(
            prettifyPercentage((quantity2/total2), 2)), quantity : quantity2});
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
    var deckQuantity = results.length;
    //results = results.splice(0, 20);
    console.log(deckQuantity);
    var data = {list : results, deckQuantity : deckQuantity};
    return data;
}

addArchetypeAndDeckToArchetype = function(deckName, archetype, format){
    var modifiedArchetype = [];
    modifiedArchetype.push.apply(modifiedArchetype, _deckArchetypes.find({
            format : format,
            deckNames :{ $elemMatch: {name: deckName}}
        }).map(function(t){
            return t.archetype;
        })
    );

    _deckArchetypes.update({
            format : format,
            deckNames : { $elemMatch: {name: deckName}}
        },
        {
            $pull : {deckNames : {name : deckName}}
        },
        {multi: true}
    );


    var randomPrice = getRandomInt(0, 2000);
    var deckType = "";
    if(randomPrice % 3 == 0){
        deckType = "aggro";
    }else if(randomPrice % 3 ==1) {
        deckType = "combo";
    }else if(randomPrice % 3 ==2) {
        deckType = "control";
    }

    _deckArchetypes.update(
        {
            archetype : archetype, format : format
        },
        {
            $addToSet : {deckNames : {name : deckName}},
            $setOnInsert : {archetype : archetype, type : deckType, deckNames : [{name : deckName}]}
        },
        {upsert : true}
    );

    modifiedArchetype.push.apply(modifiedArchetype, _deckArchetypes.find({archetype : archetype, format : format})
        .map(function(t){return t.archetype}));

    for(var a = 0; a < modifiedArchetype.length ; a++){
        var tempArchetype = _deckArchetypes.findOne({format : format, archetype : modifiedArchetype[a]});
        if(tempArchetype.deckNames != null){
            var decksNames = tempArchetype.deckNames.map(function(p){ return p.name });
            var colors = _DeckNames.find({name : {$in : decksNames}, format : format}).map(function(p){return p.colors});
            var prices = _DeckNames.find({name : {$in : decksNames}, format : format}).map(function(p){return p.price});
            prices.sort(function(a, b){return a-b});
            colors = colors.join("").split("").filter(function(x, n, s) { return s.indexOf(x) == n }).join("");

            var order = ["G", "B", "R", "W", "U"];
            var colorFinal = "";
            for(var i = 0; i < order.length; i++){
                if(colors.indexOf(order[i]) !== -1){
                    colorFinal += order[i];
                }
            }
        }
        _deckArchetypes.update(
            {
                archetype : tempArchetype.archetype, format : format
            },
            {
                $set : {colors : colorFinal, type : deckType, min : prices[0], max : prices[prices.length - 1]}
            }
        );
    }

    _DeckNames.update({name : deckName},{ $set : {archetype : archetype}});

}