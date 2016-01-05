downloadEvents = function(eventType){
    _Event.find({eventType : eventType, deckStored : {$exists : false}}).forEach(function(event){
        if(!event.hasOwnProperty('deckStored')){
            console.log("Added Event");
            getEventDeckInformation(event);
            _Event.update({ _id : event._id},
                {
                    $set : {
                        deckStored : true
                    }
                });
        } else{
            console.log("DownloadEvents Events Exists");
        };
    });
}

getTheEvents = function(format, type, days){
    var date = new Date();
    for(var i = 0; i < days ; i++){
        var day = pad(date.getDate());
        var month = pad(date.getMonth()+1);
        var year = date.getYear() + 1900;
        var url = "http://magic.wizards.com/en/articles/archive/mtgo-standings/" + format +"-" + type + "-"+year + "-" + month + "-" + day;

        var res = request.getSync(url, {
            encoding : null
        });
        if (res.response.statusCode == 200) {
            var buffer = res.body;
            var $ = cheerio.load(buffer);
            var deckMeta = $('.deck-meta h5');

            if(deckMeta.length == 0){
                console.log("Page Doesn't exists");
            }else{
                var rows = $('tbody tr');

                if(_Event.find({httpAddress : url}, {limit : 1}).count() == 0){
                    var eventInformation = getTheEventNumberAndDate($(deckMeta[0]).text());
                    _Event.insert({
                        date: eventInformation.date,
                        _eventNumber: eventInformation._eventNumber,
                        format : format,
                        eventType: type,
                        players : rows.length,
                        httpAddress : url
                    });
                }else{
                    console.log("event Exist Already");
                }
            }
        }

        date = new Date(date.setDate(date.getDate() - 1));
    }
}

getEventQuantityOfBooters = function(address, callback){
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

getEventDeckInformation = function(event){
    if(event.eventType === "ptq" | event.eventType === "premier" | event.eventType === "mocs"){
        getTop8(event);
    }else{
        getDaily(event);
    }
}

getTop8 = function(event){
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
            eventType : event.eventType,
            format : event.format,
            player : information.player,
            position : information.position
        };

        var _deckID = _Deck.insert(data);

        var cards = $(decks[i]).find('.sorted-by-overview-container .row');
        for(var j = 0; j < cards.length; j++){
            var quantity = $(cards[j]).find('.card-count').text();
            var name = $(cards[j]).find('.card-name').text();


            name = fixCards(name);
            _DeckCards.insert({
                _deckID : _deckID,
                name : name,
                quantity : quantity,
                sideboard : false
            });
        }
        var colors = setUpColorForDeckName(_deckID);

        _Deck.update({_id : _deckID},{
            $set : {colors : colors}
        });

        var sideboard = $(decks[i]).find('.sorted-by-sideboard-container .row');
        for(j = 0; j < sideboard.length; j++){
            var quantity = $(sideboard[j]).find('.card-count').text();
            var name = $(sideboard[j]).find('.card-name').text();
            name = fixCards(name);
            _DeckCards.insert({
                _deckID : _deckID,
                name : name,
                quantity : quantity,
                sideboard : true
            });
        }
    }
}

getTop8Table = function($, top8Table){
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

    return top8;
}

getInfoFromPlayerTop8Loser = function(line){
    var positionPatt = new RegExp(/\d/);
    var scoreWinPatt = new RegExp(/(?:\(\d\)\s)[^, ]+(?:, )(\d)/);
    var scoreLosePatt = new RegExp(/(?:\(\d\)\s)[^, ]+(?:, )\d-(\d)/);
    var namePatt = new RegExp(/(?:\(\d\)\s)([^, ]+)/);
    var information = {};
    //information.position = positionPatt.exec(line)[0];
    information.name = namePatt.exec(line)[1];
    return information;
}

getInfoFromPlayerTop8Winner = function(line){
    var scoreWinPatt = new RegExp(/(?:\(\d\)\s)[^, ]+(?:, )(\d)/);
    var scoreLosePatt = new RegExp(/(?:\(\d\)\s)[^, ]+(?:, )\d-(\d)/);
    var namePatt = new RegExp(/(?:\(\d\)\s)([^, ]+)(?:, )/);

    var information = {};
    information.name = namePatt.exec(line)[1];
    information.wins = scoreWinPatt.exec(line)[1];
    information.losses = scoreLosePatt.exec(line)[1];


    return information;
}


getDaily = function(event){
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
            eventType : event.eventType,
            player : information.player,
            format : event.format,
            victory : information.victory,
            draw : information.draw,
            loss : information.loss
        };


        var _deckID = _Deck.insert(data);

        var cards = $(decks[i]).find('.sorted-by-overview-container .row');
        var mainDeckQuantity = 0;
        for(var j = 0; j < cards.length; j++){
            var quantity = parseInt($(cards[j]).find('.card-count').text());
            mainDeckQuantity += quantity;
            var name = $(cards[j]).find('.card-name').text();
            name = fixCards(name);

            _DeckCards.insert({
                _deckID : _deckID,
                name : name,
                quantity : quantity,
                sideboard : false
            });
        }


        var colors = setUpColorForDeckName(_deckID);

        _Deck.update({_id : _deckID},{
            $set : {colors : colors}
        });

        var sideboard = $(decks[i]).find('.sorted-by-sideboard-container .row');
        var sideboardQuantity = 0;
        for(j = 0; j < sideboard.length; j++){
            var quantity = parseInt($(sideboard[j]).find('.card-count').text());
            sideboardQuantity += quantity;
            var name = $(sideboard[j]).find('.card-name').text();
            name = fixCards(name);
            _DeckCards.insert({
                _deckID : _deckID,
                name : name,
                quantity : quantity,
                sideboard : true
            });
        }

        if(mainDeckQuantity < 60){
            console.log("Deck With less than 60: " + _deckID + " " + mainDeckQuantity);
            console.log(event.httpAddress);
            console.log(information.player);
            _Deck.update({_id : _deckID}, {$set : {missingCards : true}});
        }
        if(sideboardQuantity < 15){
            console.log("Deck With less than 15: " + _deckID + " " + sideboardQuantity);
            console.log(event.httpAddress);
            console.log(information.player);
        }
    }
}

fixCards = function (card) {
    card = card.replace("\xC6", "Ae");
    card = card.replace("\xE9", "e");
    card = _.capitalize(card);
    return card;
}

getDeckInfoFromTop8 = function(information){
    var playerPatt = /^(.*?) \(/;
    var positionPatt = /(?:.+\()(\d+?)(?=\D)/;
    var temp = {};
    temp.player = information.match(playerPatt)[1];
    temp.position = parseInt(information.match(positionPatt)[1]);
    return temp;
}


getDeckInfo = function(information){
    var scorePatt = /([0-9]{1,2}-){1,3}[0-9]{1,2}/;
    var playerPatt = /^(.*?) \(/;
    var digitPatt = /\d+/g;
    var temp = {};
    var score = information.match(scorePatt)[0];
    var results = score.match(digitPatt);
    temp.player = information.match(playerPatt)[1];


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


function getTheEventNumberAndDate(information){
    var _eventNumberPatt = /(#[0-9]*)/;
    var datePatt = /(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/;

    var eventInformation = {};

    eventInformation._eventNumber = information.match(_eventNumberPatt)[0];
    eventInformation.date = new Date(information.match(datePatt)[0]);

    return eventInformation;
}

getInfoFromEvent = function(information){
    var _eventNumberPatt = /#[0-9]*/;
    var dataPatt = /(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/;
    var eventInformation = {};
    eventInformation._eventNumber = information.match(_eventNumberPatt)[0];
    eventInformation.date = information.match(dataPatt)[0];
    return eventInformation;
}