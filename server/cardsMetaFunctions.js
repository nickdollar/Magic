addAllCardsOnModernPerWeek  = function(){

    var options = [];

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

    var formats = ["standard", "modern", "legacy", "vintage"];
    for(var a = 0; a < formats.length; a++){
        var firstDate = _Deck.findOne({format : formats[a]}, {sort : {date: 1}}).date;
        firstDate = getWeekStartAndEnd(firstDate).weekStart;
        var date = getWeekStartAndEnd();
        var weekStart = new Date(date.weekStart);
        var weekEnd = new Date(date.weekEnd);

        while(firstDate <= weekStart)
        {
            var values = {weekDate : weekStart, format : formats[a]};
            for(var k = 0; k < options.length; k++){
                var _decksIDs = _Deck.find({date : {$gte : weekStart, $lte : weekEnd}, format : formats[a], $and : [options[k].options]}).map(function(deck){ return deck._id});
                if(_decksIDs.length != 0){
                    values[options[k].type +"Total"] = _decksIDs.length;
                    var cardsValues = {};
                    for(var i = 0; i < _decksIDs.length; ++i) {
                        var cards = _DeckCards.find({_deckID: _decksIDs[i]}).fetch();
                        for (var j = 0; j < cards.length; ++j) {
                            var cardName = cards[j].name;
                            if(!cardsValues.hasOwnProperty(cardName)) cardsValues[cardName] = {};

                            cardsValues[cardName]["total"] ? cardsValues[cardName].total += 1 : cardsValues[cardName] = {total: 1};

                            if (cards[j].sideboard == false) {
                                cardsValues[cardName]["inDecks"] ? cardsValues[cardName].inDecks += 1 : cardsValues[cardName]['inDecks'] = 1;
                                cardsValues[cardName]["totalMain"] ? cardsValues[cardName].totalMain += parseInt(cards[j].quantity) : cardsValues[cardName]['totalMain'] = parseInt(cards[j].quantity)
                            } else {
                                cardsValues[cardName]["inDecksSideboard"] ? cardsValues[cardName].inDecksSideboard += 1 : cardsValues[cardName]['inDecksSideboard'] = 1;
                                cardsValues[cardName]["totalSideboard"] ? cardsValues[cardName].totalSideboard += parseInt(cards[j].quantity) : cardsValues[cardName]['totalSideboard'] = parseInt(cards[j].quantity);
                            }
                        }
                    }
                    values[options[k].type] = cardsValues;
                }


            }
            _cardWeekQuantity.insert(values);
            weekStart.setDate(weekStart.getDate() - 7);
            weekEnd.setDate(weekEnd.getDate() - 7);
        }
    }
}

addAllCardsOnModern = function(){
    var format = "modern";
    var date = getWeekStartAndEnd();
    var weekStart = new Date(date.weekStart);
    var weekEnd = new Date(date.weekEnd);
    var options = [];

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

    for(var k = 0; k < options.length; k++){
        var _decksIDs = _Deck.find({format : "modern", $and : [options[k].options]}).map(function(deck){ return deck._id});
        for(var i = 0; i < _decksIDs.length; ++i) {
            var cards = _DeckCards.find({_deckID: _decksIDs[i]}).fetch();
            for (var j = 0; j < cards.length; ++j) {
                var tempOptions = {};
                var totalOptions = {};
                totalOptions[options[k].type+ ".total"] = 1;

                _cardsMetaValues.update({name: cards[j].name},
                    {
                        $inc: totalOptions,
                        $setOnInsert: {
                            name: cards[j].name,
                            format: format
                        }
                    },
                    {upsert: true}
                )

                if (cards[j].sideboard == false) {
                    tempOptions[options[k].type+ ".inDecks"] = 1;
                    tempOptions[options[k].type+ ".totalMain"] = parseInt(cards[j].quantity);
                    _cardsMetaValues.update({name: cards[j].name},
                        {
                            $inc: tempOptions,
                            $setOnInsert: {
                                name: cards[j].name,
                                format: format
                            }
                        },
                        {upsert: true}
                    )
                } else {
                    tempOptions[options[k].type+ ".inDecksSideboard"] = 1;
                    tempOptions[options[k].type+ ".totalSideboard"] = parseInt(cards[j].quantity);
                    _cardsMetaValues.update({name: cards[j].name},
                        {
                            $inc: tempOptions,
                            $setOnInsert: {
                                name: cards[j].name,
                                format: format
                            }
                        },
                        {upsert: true}
                    )
                }
            }
        }
    }
}



function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

//getTheCardsMeta
metaPerWeek = function(options) {

    if(options == null){
        options = {types : ["daily3_1", "daily4_0", "ptqTop8", "ptqTop9_16", "ptqTop17_32"], pagination : 0};
    }

    var weeksDate = _cardWeekQuantity.find({format : "modern"}).fetch();

    var numberTypes = ["total", "inDecks", "totalMain", "inDecksSideboard", "totalSideboard"];
    var totalDecks = 0;
    var cards = {};
    for(var i = 0; i < weeksDate.length; i++) {
        for (var j = 0; j < options.types.length; j++) {
            if (weeksDate[i].hasOwnProperty(options.types[j] + "Total")) {
                totalDecks += weeksDate[i][options.types[j] + "Total"];

                for (var cardName in weeksDate[i][options.types[j]]) {
                    if (!cards.hasOwnProperty(cardName)) cards[cardName] = {};

                    for (var k = 0; k < numberTypes.length; k++) {
                        if (weeksDate[i][options.types[j]][cardName].hasOwnProperty(numberTypes[k])) {
                            var value = weeksDate[i][options.types[j]][cardName][numberTypes[k]];
                            cards[cardName][numberTypes[k]] ? cards[cardName][numberTypes[k]] += value : cards[cardName][numberTypes[k]] = value;
                        }
                    }
                }
            }
        }
    }

    var cardsValues = [];

    for (var cardName in cards) {
        if(cards[cardName].hasOwnProperty("inDecks")){
            var card = {name : cardName, percent : prettifyPercentage(cards[cardName].inDecks/totalDecks,2), avg : (cards[cardName].totalMain/cards[cardName].inDecks).toFixed(2)};
            cardsValues.push(card);
        }
    }

    cardsValues.sort(function(a, b){return b.percent - a.percent});
        //.splice(options.pagination, 10);
    var cardsQuantity = cardsValues.length;

    var values = {list : cardsValues, pagination : cardsQuantity};
    return values;
}

