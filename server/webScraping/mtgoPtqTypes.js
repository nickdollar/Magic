import cheerio from "cheerio";

getMTGOPtqEventsOLD = function(format, days){
    if(format == null || days == null){
        return;
    }

    if(mtgoPtqTypes[format] == null){
        console.log("Invalid Format")
        return;
    }


    var event = Events.findOne({format : format, type : "MTGOPTQ"}, {sort : {date : 1}, limit : 1});

    var date = null;
    if(event==null){
        date = new Date();
    }else{
        date = new Date(event.date);
        date.setDate(date.getDate() - 1);
    }
    date.setHours(0,0,0,0);

    for(var i = 0; i < days ; i++){
        var day = pad(date.getDate());
        var month = pad(date.getMonth()+1);
        var year = date.getYear() + 1900;
        var url = "http://magic.wizards.com/en/articles/archive/mtgo-standings/" + mtgoPtqTypes[format] + "-" + year + "-" + month + "-" + day;
        var res = Meteor.http.get(url);

        Events.update(
            {type : "MTGOPTQ", date : date, format : format},
            {
                $setOnInsert : {
                    date: date,
                    format : format,
                    venue : "MTGO",
                    name : mtgoPtqTypes[format],
                    type: "MTGOPTQ",
                    url : url,
                    state: "startProduction"
                }
            },
            {upsert : true}
        );


        if (res.statusCode == 200) {
            var buffer = res.content;
            var $ = cheerio.load(buffer);

            var deckMeta = $('#main-content');
            var state = "notFound";
            if(deckMeta.length == 0){
                console.log("Page Doesn't exists");
            }else{
                console.log("page exists");
                state = "exists";
            }
            
            Events.update(
                {type : "MTGOPTQ", date : date, format : format},
                {
                    $set : {
                        state : state
                    }
                }
            );
        }
        date = new Date(date.setDate(date.getDate() - 1));
    }
}

notFoundEventMTGOPTQ = function(Events_id) {
    console.log("START: notFoundEventMTGOPTQ");
    var eventNotFound = Events.findOne({type: "EventsExists", _id: Events_id, state: "notFound"});

    if (!eventNotFound) {
        return
    }
    ;
    var res = Meteor.http.get(eventNotFound.url);

    if (res.statusCode == 200) {
        var buffer = res.content;
        var $ = cheerio.load(buffer);
        var deckMeta = $('#main-content');
        if (deckMeta.length == 0) {
            console.log("Page Doesn't exists");
        } else {
            console.log("page exists");
            Events.update(
                {_id: eventNotFound._id},
                {
                    $set: {

                        state: "exists"
                    }
                }
            );
        }
    } else {
        var days = 10 * 24 * 60 * 60 * 1000;
        if ((new Date) - Events.findOne({_id: Events_id}).date > days) {
            console.log("GGGGGGGGGGGGGGGG");
            Events.update(
                {_id: Event_id},
                {
                    $set: {
                        state: "notFoundOld"
                    }
                }
            );
        }
    }

    console.log("END: notFoundEventMTGOPTQ");
}

eventExistsMTGOPTQ = function(_id){
    
    var event = Events.findOne({type : "MTGOPTQ", _id : _id, state : "exists"});

    if(event == null) {
        return;
    }

    var res = Meteor.http.get(event.url);


    if (res.statusCode == 200) {
        var buffer = res.content;
        var $ = cheerio.load(buffer);
        var deckMeta = $('#main-content');
        if(deckMeta.length == 0){
            console.log("Events not found");
            Events.update(
                {_id : _id},
                {
                    $set : {
                        state : "HTMLFail"
                    }
                }
            );
        }else{
            console.log("Events found");
            EventsHtmls.update(
                {Events_id : _id},
                {
                    $set : {
                        html : $(deckMeta).html(),
                    }
                },
                {upsert : true}
            );

            Events.update(
                {_id : _id},
                {
                    $set : {
                        state : "HTML"
                    }
                }
            );
        }
    }
};

eventHTMLMTGOPTQ = function(_id){
    var event = Events.findOne({_id : _id, state : "HTML"});
    DecksData.remove({Events_id : event._id});

    if(event == null) return;

    var eventHtml = EventsHtmls.findOne({Events_id : _id});
    var $ = cheerio.load(eventHtml.html);
    var decks = $('.bean--wiz-content-deck-list');

    var rows = $(".even, .odd");
    var options = $("thead th");

    for(var i = 0 ; i < decks.length; i++){
        var information = getDeckInfoFromTop8($(decks[i]).find('h4').html());
        var data = {
            Events_id : event._id,
            date : event.date,
            type : event.type,
            player : information.player,
            format : event.format,
            position : information.position,
        };

        var cards = $(decks[i]).find('.sorted-by-overview-container .row');
        var deckCards = {main : [], sideboard : []};
        var mainDeckQuantity = 0;
        for(var j = 0; j < cards.length; j++){
            var quantity = parseInt($(cards[j]).find('.card-count').text());
            mainDeckQuantity += quantity;
            var name = $(cards[j]).find('.card-name').text();
            name = fixCards(name);

            if(CardsData.find({ name : name}).count()){
                deckCards.main.push(
                    {
                        name : name,
                        quantity : quantity
                    }
                );
            }else{
                deckCards.main.push(
                    {
                        name : name,
                        quantity : quantity,
                        wrongName : true
                    }
                );
            }
        }

        var sideboard = $(decks[i]).find('.sorted-by-sideboard-container .row');
        var sideboardQuantity = 0;
        for(j = 0; j < sideboard.length; j++){
            var quantity = parseInt($(sideboard[j]).find('.card-count').text());
            sideboardQuantity += quantity;
            var name = $(sideboard[j]).find('.card-name').text();
            name = fixCards(name);

            if(CardsData.find({ name : name}).count()){
                deckCards.sideboard.push(
                    {
                        name : name,
                        quantity : quantity
                    }
                );
            }else{
                deckCards.sideboard.push(
                    {
                        name : name,
                        quantity : quantity,
                        wrongName : true
                    }
                );
            }

        }

        data.totalMain = mainDeckQuantity;
        data.main = deckCards.main;
        data.totalSideboard = sideboardQuantity;
        data.sideboard = deckCards.sideboard;
        var colors = setUpColorForDeckName(deckCards.main);
        data.colors = colors;
        data.state = "scraped";
        DecksData.insert(data);

        var cardsOnMain = [];

        data.main.forEach(function(obj){
            cardsOnMain.push(obj.name)
        });

        var nonLandsCards = CardsData.find({name : {$in : cardsOnMain}, land : false}).map(function(obj){
            return obj.name;
        });


        if(!DecksDataUniqueWithoutQuantity.find({format : data.format, nonLandMain : {$size : nonLandsCards.length, $all : nonLandsCards}}).count()){
            console.log("EQUAL");
        }

        DecksDataUniqueWithoutQuantity.update({format : data.format, nonLandMain : {$size : nonLandsCards.length, $all : nonLandsCards}},
            {$set : {format : data.format, nonLandMain : nonLandsCards}},
            {
                upsert : true
            });

    }

    Events.update(
        {_id : event._id},
        {
            $set : {
                state : "decks", decks : decks.length
            }
        }
    );
}

var mtgoPtqTypes = {
    modern : "modern-ptq",
    standard : "standard-ptq",
    pauper : "pauper-ptq",
    vintage : "vintage-ptq",
    legacy : "legacy-ptq"

}


getTop8Bracket = function($, top8Table){
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

getDeckInfoFromTop8 = function(information){
    console.log("START: getDeckInfoFromTop8");
    console.log(information);

    var playerPatt = /^.+(?=(?: \())/i;
    var positionPatt = /\d*(?=(?:ST|RD|ND|TH) )/i;
    var temp = {};

    temp.player = information.match(playerPatt)[0];
    temp.position = parseInt(information.match(positionPatt)[0]);

    console.log(temp);
    return temp;
}

getInfoFromPlayerTop8Loser = function(line){
    var positionPatt = new RegExp(/\d+(?=\))/);
    var namePatt = new RegExp(/(?! )(?=[a-zA-Z]).*?(?=\s*?$)/i);
    var information = {};

    information.position = positionPatt.exec(line)[0];
    information.name = namePatt.exec(line)[0];
    return information;
}

getInfoFromPlayerTop8Winner = function(line){
    console.log("Line");
    var positionPatt = new RegExp(/(?=\d\) )\d/i);
    var scoreWinPatt = new RegExp(/\d(?=-\d$)/i);
    var scoreLosePatt = new RegExp(/\d$/i);
    var namePatt = new RegExp(/(?=(?:[a-zA-Z0-9][a-zA-Z0-9 ])).*(?=,)/i);

    var information = {};

    information.name = line.match(namePatt)[0];
    information.wins = line.match(scoreWinPatt)[0];
    information.losses = line.match(scoreLosePatt)[0];
    information.position = line.match(positionPatt)[0];

    console.log(information);
    return information;
}