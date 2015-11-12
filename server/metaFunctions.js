//MTGO4-0, 3-1, top8, top16, top32
//SCG TOP8

updateMeta = function(){
    var format = 'modern';

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

    _MetaDate.update({
        date : startDate,
        format : format
    },
    {
        $setOnInsert :  {
                        date : startDate,
                        format : format
                        }
    },
        {upsert : true}
    );

    var _metaDateID = _MetaDate.findOne({
        date : startDate,
        format : format
    })._id;


    var names = _DeckNames.find({format : format}).fetch();
    var decksCount = _Deck.find({format : format}).count();

    for(var i = 0; i < names.length; i++) {
        var metaInfo = {};
        var name = names[i].name;
        var deckCount = _Deck.find({format: format, name: name}).count();
        metaInfo._metaDateID = _metaDateID;
        metaInfo.percent = parseFloat(prettifyPercentage(deckCount / decksCount, 2));
        metaInfo.name = name;
        metaInfo.format = format;

        _MetaValues.update({
            _metaDateID : metaInfo._metaDateID,
            name : metaInfo.name,
            format : metaInfo.format
            },
            {
                $set : {percent : metaInfo.percent},
                $setOnInsert : metaInfo
            },
            {upsert : true}
        );
    }
}

updateMeta2 = function(){
    var format = 'modern';

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

    var names = _DeckNames.find({format : format }).fetch();

    var metaTest = {};
    metaTest.format = format;
    metaTest.type = {};
    var firstDate = _Deck.findOne({}, {sort : {date: 1}}).date;
    firstDate = getWeekStartAndEnd(firstDate).weekStart;
    while(firstDate <= weekStart){
        metaTest.weekDate = weekStart;
        for(var j = 0; j < options.length; j++)
        {
            metaTest.type[options[j].type] = {};

            var deckTotal = _Deck.find({format : format, date : {$gte : weekStart, $lte : weekEnd}, $and : [options[j].options]}).count();
            metaTest.type[options[j].type].deckTotal = deckTotal;
            metaTest.type[options[j].type].decks = {};

            for(var i = 0; i < names.length; i++) {
                var name = names[i].name;
                metaTest.type[options[j].type].decks[name] = {};
                var count = _Deck.find({format: format, date : {$gte : weekStart, $lte : weekEnd}, name: name, $and : [options[j].options]}).count();
                metaTest.type[options[j].type].decks[name] = count;
            }
        }

        _MetaValues.update({
            format : metaTest.format,
                weekDate : weekStart
        },
        {
            $setOnInsert : metaTest
        },
            {upsert : true}
        )
        weekStart.setDate(weekStart.getDate() - 7);
        weekEnd.setDate(weekEnd.getDate() - 7);
    }
    console.log("END");
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

                if(!cardValues.hasOwnProperty(card.name)){
                    var cardTemp =_CardDatabase.findOne({name : card.name});
                    console.log(cardTemp);
                    cardValues[card.name] = {total : 0, land : cardTemp.land};
                }
                cardValues[card.name].total += parseInt(card.quantity);
            });
        }

        for(var key in cardValues){
            cardValues[key].total = parseFloat((cardValues[key].total/decks.length).toFixed(2));

            _cardBreakDownCards.update({format : format, deckName : deckName, cardName : key},
                {
                    $set : { weekTotal : cardValues[key].total},
                    $setOnInsert : {format: format, deckName : deckName, cardName : key, type : cardValues[key].land}
                },
                {upsert: true}
            );

            _cardBreakDownDate.update({
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