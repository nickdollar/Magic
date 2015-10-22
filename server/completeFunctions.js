function getLastEvents(){

    //request("http://magic.wizards.com/en/content/deck-lists-magic-online-products-game-info", Meteor.bindEnvironment(function(error, response, body) {
    //    if (!error && response.statusCode == 200) {

    var result = request.getSync("http://magic.wizards.com/en/content/deck-lists-magic-online-products-game-info", {
        encoding: null
    });
    buffer = result.body;
    var $ = cheerio.load(buffer);
    fields = $('.article-item');

    var events = [];
    //download the data of each deck
    fields.each(function(i, elem){
        var httpAddress = "http://magic.wizards.com" + $(elem).find('.title a').attr('href');
        var event = $(elem).find('.title a').html();
        var dateAndNumber = $(elem).find('.section a').html();
        var eventInfo = {};
        eventInfo = getEventsInformation(event, httpAddress, dateAndNumber);
        events.push(eventInfo);
    });

    //check if the event already exists and store if not
    for(var i = 0; i < events.length; i++){
        if(_Event.find({_eventNumber : events[i]._eventNumber}, {limit : 1}).count()===0){
            if(events[i].type === "sealed") {
                _Event.insert({
                    _eventNumber: events[i]._eventNumber,
                    date: events[i].date,
                    _eventNumber: events[i]._eventNumber,
                    format : events[i].format,
                    eventType: events[i].eventType,
                    set: events[i].eventType,
                    boosterQuantity: events[i].eventType,
                    httpAddress : events[i].httpAddress
                });
            }else{
                _Event.insert({
                    _eventNumber: events[i]._eventNumber,
                    date: events[i].date,
                    _eventNumber: events[i]._eventNumber,
                    format : events[i].format,
                    eventType: events[i].eventType,
                    httpAddress : events[i].httpAddress
                });
            }
        }else{
            console.log("found it");
        }
    }
}

function makeMeta(){
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

    var _MetaDateID = "";

    if(_MetaDate.find({date : {$gte: startDate, $lt : dateMidnight}}).count() > 0){
        _MetaDateID = _MetaDate.findOne({date : {$gte: startDate, $lt : dateMidnight}, format : format})._id;
    }else{
        _MetaDateID = _MetaDate.insert({date : startDate});

        var names = _DeckNames.find({format : format}).fetch();
        var decksCount = _Deck.find({format : format}).count();

        for(var i = 0; i < names.length; i++){
            var metaInfo = {};
            var name = names[i].name;
            var deckCount = _Deck.find({format : format, name : name}).count();
            metaInfo._MetaDateID = _MetaDateID;
            metaInfo.percent = formatNum(deckCount/decksCount);
            metaInfo.name = name;
            metaInfo.format = format;

            _MetaValues.insert(metaInfo);
        }
    }
}

function getEventsInformation(event, httpAddress, dateAndNumber){
    //Patterns
    var _eventNumberPatt = /#[0-9]*/;
    var dataPatt = /(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/;
    var formatPatt = /standard|pauper|modern|legacy|vintage|sealed/i;
    var eventTypePatt = /daily|ptq|judge open|champs|champs|premier/i;
    var setPatt = /(?:\S+\s+){1}(\S+)/i;

    var eventInformation = {};

    eventInformation.format = event.match(formatPatt)[0].toLowerCase();
    eventInformation.eventType = event.match(eventTypePatt)[0].toLowerCase();
    eventInformation._eventNumber = dateAndNumber.match(_eventNumberPatt)[0];
    eventInformation.date = new Date(dateAndNumber.match(dataPatt)[0]);
    eventInformation.httpAddress = httpAddress;
    if( eventInformation.format == "sealed"){
        eventInformation.set = event.match(setPatt)[1];
        eventInformation.boosterQuantity = getEventQunantityOfBooters(httpAddress);
    }

    return eventInformation;


}

function getEventQunantityOfBooters(address, callback){

    var result = request.getSync(address, {
        encoding: null
    });

    var buffer = result.body;
    var $ = cheerio.load(buffer);
    var field = $($('h5')[0]).html();
    var quantityPatt = /x\d/i;
    var xQuantityPatt = /\d/i;
    var quantity = field.match(quantityPatt)[0].match(xQuantityPatt)[0];
    return quantity;
}

function formatNum(n) {
    return Math.round(n * 1e4) / 1e2;
}


function getEventDeckInformation(event){

    if(event.eventType === "ptq"){
        getTop8(event);
    }else{
        getDaily(event);
    }
}

function getTop8(event){
    var result = request.getSync(event.httpAddress, {
        encoding: null
    });

    var buffer = result.body;
    var $ = cheerio.load(buffer);

    var decks = $('.bean--wiz-content-deck-list');

    var rows = $(".even, .odd");
    var options = $("thead th");
    var tableInformation = [];

    var top8TableInformation = [];

    var top8Table = $(".top-bracket-slider");

    var top8Information = getTop8Table($, top8Table);


    _Event.update({_id : event._id},{
        $set : {top8Table : top8Information}
    });

    for(var i = 0 ; i < decks.length; i++){

        var information = getDeckInfoFromTop8($(decks[i]).find('h4').html());
        var data = {
            _eventID : event._id,
            date : event.date,
            format : event._format,
            player : information.player,
            position : information.position


        };

        var deckID = _Deck.insert( data );

        var cards = $(decks[i]).find('.sorted-by-overview-container .row');
        for(var j = 0; j < cards.length; j++){
            var quantity = $(cards[j]).find('.card-count').text();
            var name = $(cards[j]).find('.card-name').text();

            _DeckCards.insert({
                _deckID : deckID,
                name : name,
                quantity : quantity,
                sideboard : false

            });
        }

        var sideboard = $(decks[i]).find('.sorted-by-sideboard-container .row');
        for(j = 0; j < sideboard.length; j++){
            var quantity = $(sideboard[j]).find('.card-count').text();
            var name = $(sideboard[j]).find('.card-name').text();
            _DeckCards.insert({
                _deckID : deckID,
                name : name,
                quantity : quantity,
                sideboard : true
            });
        }
    }
}

function getTop8Table($, top8Table){
    var quarterFinalsPlayers = {};
    var semiFinalsPlayers = {};
    var finalsPlayers = {};

    quarterFinalsPlayers.winners = top8Table.find(".quarterfinals .dual-players strong");
    quarterFinalsPlayers.losers = top8Table.find(" .quarterfinals .dual-players .player + .player p");
    semiFinalsPlayers.winners = top8Table.find(".semifinals .dual-players strong");
    semiFinalsPlayers.losers = top8Table.find(".semifinals .dual-players .player + .player p");
    finalsPlayers.winners = top8Table.find(".finals .dual-players strong");
    finalsPlayers.losers = top8Table.find(".finals .dual-players .player + .player p");


    var top8 = {quarterFinals : [], semiFinals : [], finals : []};


    for(var i = 0; i<quarterFinalsPlayers.winners.length; i++){
        top8.quarterFinals.push(
            {
                winner : getInfoFromPlayerTop8Winner($(quarterFinalsPlayers.winners[i]).html()),
                loser : getInfoFromPlayerTop8Loser($(quarterFinalsPlayers.losers[i]).html())
            });

    }

    for(var i = 0; i<semiFinalsPlayers.winners.length; i++){
        top8.semiFinals.push(
            {
                winner : getInfoFromPlayerTop8Winner($(semiFinalsPlayers.winners[i]).html()),
                loser : getInfoFromPlayerTop8Loser($(semiFinalsPlayers.losers[i]).html())
            });
    }

    for(var i = 0; i<finalsPlayers.winners.length; i++){
        top8.finals.push(
            {
                winner : getInfoFromPlayerTop8Winner($(finalsPlayers.winners[i]).html()),
                loser : getInfoFromPlayerTop8Loser($(finalsPlayers.losers[i]).html())
            });
    }


    //for(var i = 0; i<top8.quarterFinals.length; i++){
    //    console.log(top8.quarterFinals[i]);
    //}
    //
    //for(var i = 0; i<top8.semiFinals.length; i++){
    //    console.log(top8.semiFinals[i]);
    //}
    //
    //for(var i = 0; i<top8.finals.length; i++){
    //    console.log(top8.finals[i]);
    //}

    return top8;
}

function getInfoFromPlayerTop8Loser(line){
    var positionPatt = new RegExp(/\d/);
    var scoreWinPatt = new RegExp(/(?:\(\d\)\s)[^, ]+(?:, )(\d)/);
    var scoreLosePatt = new RegExp(/(?:\(\d\)\s)[^, ]+(?:, )\d-(\d)/);
    var namePatt = new RegExp(/(?:\(\d\)\s)([^, ]+)/);
    var information = {};
    //information.position = positionPatt.exec(line)[0];
    information.name = namePatt.exec(line)[1];
    return information;
}

function getInfoFromPlayerTop8Winner(line){
    var scoreWinPatt = new RegExp(/(?:\(\d\)\s)[^, ]+(?:, )(\d)/);
    var scoreLosePatt = new RegExp(/(?:\(\d\)\s)[^, ]+(?:, )\d-(\d)/);
    var namePatt = new RegExp(/(?:\(\d\)\s)([^, ]+)(?:, )/);

    var information = {};
    information.name = namePatt.exec(line)[1];
    information.wins = scoreWinPatt.exec(line)[1];
    information.losses = scoreLosePatt.exec(line)[1];


    return information;
}

function getDaily(event){

    var result = request.getSync(event.httpAddress, {
        encoding: null
    });

    var buffer = result.body;
    var $ = cheerio.load(buffer);
    var decks = $('.bean--wiz-content-deck-list');

    var rows = $(".even, .odd");
    var options = $("thead th");
    var tableInformation = [];

    for(var i = 0 ; i < rows.length; i++) {
        var columns = $(rows[i]).find("td");
        var table = {};
        for(var j = 0; j < options.length; j++){
            table[$(options[j]).html()] = $(columns[j]).html();
        }
        tableInformation.push(table);
    }

    for(var i = 0 ; i < decks.length; i++){
        //var deckNumbers = tableInformation[i];

        var information = getDeckInfo($(decks[i]).find('h4').html());
        var data = {
            _eventID : event._id,
            date : event.date,
            player : information.player,
            format : event.format,
            victory : information.victory,
            draw : information.draw,
            loss : information.loss
        };

        //for (var attr in deckNumbers) { data[attr] = deckNumbers[attr]; }

        var deckID = _Deck.insert(data);

        var cards = $(decks[i]).find('.sorted-by-overview-container .row');
        for(var j = 0; j < cards.length; j++){
            var quantity = $(cards[j]).find('.card-count').text();
            var name = $(cards[j]).find('.card-name').text();

            _DeckCards.insert({
                _deckID : deckID,
                name : name,
                quantity : quantity,
                sideboard : false

            });
        }

        var sideboard = $(decks[i]).find('.sorted-by-sideboard-container .row');
        for(j = 0; j < sideboard.length; j++){
            var quantity = $(sideboard[j]).find('.card-count').text();
            var name = $(sideboard[j]).find('.card-name').text();
            _DeckCards.insert({
                _deckID : deckID,
                name : name,
                quantity : quantity,
                sideboard : true
            });
        }
    }
}



function getDeckInfoFromTop8(information){
    var playerPatt = /.+?(?= \()/;
    var positionPatt = /(?:.+\()(\d+?)(?=\D)/;
    var temp = {};
    temp.player = information.match(playerPatt)[0];
    temp.position = information.match(positionPatt)[1];
    return temp;
}



function getDeckInfo(information){
    console.log(information);
    var scorePatt = /([0-9]{1,2}-){1,3}[0-9]{1,2}/;
    var playerPatt = /([^\s]+)/;
    var digitPatt = /\d+/g;
    var temp = {};
    var score = information.match(scorePatt)[0];
    var results = score.match(digitPatt);
    temp.player = information.match(playerPatt)[0];

    if(results.length==2){
        temp.victory = parseInt(results[0]);
        temp.loss = parseInt(results[1]);
        temp.draw = 0;
    }else if(results.length==3){
        temp.victory = parseInt(results[0]);
        temp.draw = parseInt(results[1]);
        temp.loss = parseInt(results[2]);
    }
    return temp;
}

function setUpColorForDeckName(_deckNameID){
    var manaRegex = new RegExp("\{([a-zA-Z])\}", 'g');

    var cards = _DeckNamesCards.find({_deckNameID : _deckNameID}).fetch();

    for(var i = 0; i < cards.length ; i++){
        console.log(cards[i].name);
    }

    var tempMana = {"B" : false, "G" : false, "R" : false, "U" : false, "W" : false};
    cards.forEach(function(card){
        //console.log(card.name);
        if(_CardDatabase.findOne({name : card.name}) != null ){
            var mana = _CardDatabase.findOne({name : card.name}).manacost;
            var result;
            while((result = manaRegex.exec(mana)) !== null) {
                if(result[1] == "B") { tempMana["B"] = true; }
                else if (result[1] == "G") { tempMana["G"] = true}
                else if (result[1] == "R") { tempMana["R"] = true}
                else if (result[1] == "U") { tempMana["U"] = true}
                else if (result[1] == "W") { tempMana["W"] = true}
            }
        }
    });
    var colors = "";
    for(var key in tempMana ){
        if(tempMana[key] == true){
            colors += key;
        }
    }
    console.log(colors);
    return colors;
}

function addDeckName(_selectedDeckID, name){

    var format = _Deck.findOne({_id : _selectedDeckID}).format;

    var cards = [];

    _DeckCards.find({_deckID : _selectedDeckID, sideboard : false}).forEach(function(card){
        cards.push(card.name);
    });

    var _deckNameID = _DeckNames.insert({
        format : format,
        name : name
    });

    _CardDatabase.find(
        {name : {$in : cards},
            land : false
        }).forEach(function(card){
            _DeckNamesCards.insert({ _deckNameID : _deckNameID,
                name : card.name
            });
        });

    _Deck.update({_id : _selectedDeckID},{
        $set : {name : name}
    });
}

function makeCardDatabase(){
    myobject = JSON.parse(Assets.getText('AllCards.json'));

    for (var key in myobject) {

        var obj = myobject[key];
        var data = {};

        if(obj.hasOwnProperty('name')){
            obj.name = obj.name.replace("\xC6", "Ae");
            data.name = obj.name;
        }

        if(obj.hasOwnProperty('type')){
            obj.type = obj.type.replace("—", "-");
            data.type = obj.type;
        }

        if(obj.hasOwnProperty('types')){
            var types = {
                artifact : false,
                creature : false,
                enchantment : false,
                instant : false,
                land : false,
                planeswalker : false,
                sorcery : false,
                tribal : false
            };

            for(var i = 0; i<obj.types.length; i++){
                types[obj.types[i].toLowerCase()] = true;
            }

            data.artifact = types.artifact;
            data.creature = types.creature;
            data.enchantment = types.enchantment;
            data.instant = types.instant;
            data.land = types.land;
            data.planeswalker = types.planeswalker;
            data.sorcery = types.sorcery;
            data.tribal = types.tribal
        };



        if(obj.hasOwnProperty('cmc')){
            data.cmc = obj.cmc;
        }

        if(obj.hasOwnProperty('manaCost')){
            data.manacost = obj.manaCost;
        }

        if(obj.hasOwnProperty('toughness')){
            data.toughness = obj.toughness;
        }

        if(obj.hasOwnProperty('power')){
            data.power = obj.power;
        }

        _CardDatabase.insert(data);
    }
};


function getDeckRanks(){
    var _deckNames = _DeckNames.find({}).fetch();
    var _deckWithoutNames = _Deck.find({$or : [{title: ""}, {title : null}]}).fetch();
    var finalResults = [];
    for(var i = 0; i < _deckWithoutNames.length; i++){
        var _deckWithoutNameID = _deckWithoutNames[i]._id;
        var results = [];
        for(var j = 0; j < _deckNames.length; j++)
        {
            var _deckNameID = _deckNames[j]._id;

            //get the list of cards
            var cardDeckNames = [];
            _DeckNamesCards.find({deckName_id : _deckNameID}).forEach(function(card){
                cardDeckNames.push(card.name);
            });

            var matches = getMatchesAndNonMatches(_deckWithoutNameID, cardDeckNames, _deckNameID);
            var value = formatNum((matches.positive.length)/cardDeckNames.length);
            var deckName = _DeckNames.findOne({deckName_id : _deckNameID}).name;
            if(value!==0){
                results.push({
                    value : value,
                    deckName : deckName,
                    deckNameID : _deckNameID._id,
                    matches : matches
                });
            }
        }

        results.sort(function(a, b){return b.value - a.value});
        results = results.slice(0,4);
        finalResults.push({id : _deckWithoutNameID, results : results});
    }
    return finalResults;
}

function getCardFromArrayWithoutLands(cardList){
    var resultWithoutLands = [];
    _CardDatabase.find(
        {name : {$in : cardList},
            land : false
        }).forEach(function(card){
            resultWithoutLands.push(card.name);
        });
    return resultWithoutLands;
}


function getInfoFromEvent(information){
    var _eventNumberPatt = /#[0-9]*/;
    var dataPatt = /(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/;
    var eventInformation = {};
    eventInformation._eventNumber = information.match(_eventNumberPatt)[0];
    eventInformation.date = information.match(dataPatt)[0];
    return eventInformation;

}