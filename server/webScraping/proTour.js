/*
TOP 8 DECKLISTS
DECKLISTS 9-16
(?:TOP|FINALS|DECKLISTS)? ?(?:\d{0,2}(?:TH|ND)? ?(?:TO|-)? ?\d{0,2}(?:TH|ND)?)? ?(?:DECKLISTS|DECKS|)?$

TOP 9-32 DECKLISTS
33-64 DECKLISTS
9TH-32ND DECKS
TOP 8 DECKS
9TH TO 16TH DECKLISTS
9-32 DECKLISTS
TOP 32 DECKLISTS
FINALS DECKLISTS
9TH-32ND DECKLISTS
*/

import cheerio from "cheerio";

var monthValues = { jan : 0, january : 0, feb : 1, february : 1, mar : 2, march : 2, apr : 3, april : 3, may : 4, jun : 5, june : 5,
                        jul : 6, july : 6, aug : 7, august : 7, sep : 8, september : 8, oct : 9, october : 9, nov : 10, november : 10, dec : 11, december : 11
                    }

getProTourLinks = function(){
    var res = request.getSync("http://magic.wizards.com/en/events/coverage", {
        encoding: null
    });
    if(res.response.statusCode == 200){
        var buffer = res.body;
        var $ = cheerio.load(buffer);
        var html = $('#2015-2016-season h4:contains(Grand Prix) + p a');
        var events = [];
        for(var i = 0; i < html.length; i++){
            var event = {};
            var eventCorrected = {};
            if($(html[i]).html() != null && $(html[i]).html() != ""){
                event.city = $(html[i]).html();
                event.value = $(html[i])[0].nextSibling.nodeValue;
            }else{
                continue;
            }

            if($(html[i]).next()[0].nextSibling.nodeValue != null){
                event.value += $(html[i]).next()[0].nextSibling.nodeValue;
            }
            if($(html[i]).next().html() != null && $(html[i]).next().html() != ""){
                event.edition = $(html[i]).next().html();
            }


            if(event.city != null && event.city != ""){
                eventCorrected.city = event.city;
            }

            if(event.value != null && event.value != ""){
                var month = event.value.match(/\b(?:jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|september|oct|october|nov|november|dec|december)\b/i)[0];
                var day = event.value.match(/(?:\d{1,2})\b/i)[0];
                var year = event.value.match(/(?:20\d{1,2})\b/i)[0];
                eventCorrected.date = new Date(parseInt(year), monthValues[month.toLowerCase()],parseInt(day));
                eventCorrected.format = event.value.match(/(?:modern|legacy|standard|limited|vintage)/i)[0];
            }
            if(event.edition != null && event.edition != ""){
                eventCorrected.edition = event.edition;
            }

            eventCorrected.url = "http://magic.wizards.com" + $(html[i]).attr("href");
            eventCorrected.eventType = "GP";

            Events.update(
                {city : eventCorrected.city, date : event.date},
                {
                    $set : eventCorrected,
                    $setOnInsert : eventCorrected
                },
                {upsert : true}
            )
        }
    }
}



getProTourHtml = function() {
    var gp = Events.findOne({});
    var res = request.getSync(gp.url, {
        encoding: null
    });

    if (res.response.statusCode == 200) {
        var $ = cheerio.load(res.body);
        var html = $('#content');
        if (html.length == 0) {
            console.log("Page Doesn't exists");
        } else {
            console.log("Page exists");
            Events.update(
                {city: gp.city, date: gp.date},
                {
                    $set : {html : $(html).html()}
                },
                {upsert: true}
            );
        }
    }
}


/*
TOP 8 DECKS
FINALS DECKLISTS
TOP 9-32 DECKLISTS
9-32 DECKLISTS
9TH-32ND DECKS
9TH TO 16TH DECKLISTS
9TH-32ND DECKLISTS
TOP 32 DECKLISTS
33-64 DECKLISTS
*/

getProTourDeckLinks = function(){
    var gp = Events.findOne({html : {$exists : true}});
    var $ = cheerio.load(gp.html);
    var allDecksExists = false;
    //Get Deck HTML
    var htmlDecksLinkQuery = $("#full-coverage-archive a:icontains(TOP 8 DECKS), #full-coverage-archive a:icontains(FINALS DECKLISTS), #full-coverage-archive a:icontains(TOP 9-32 DECKLISTS), " +
                 "#full-coverage-archive a:icontains(9-32 DECKLISTS), #full-coverage-archive a:icontains(9TH-32ND DECKS), #full-coverage-archive a:icontains(9TH-32ND DECKLISTS), " +
                 "#full-coverage-archive a:icontains(TOP 32 DECKLISTS), #full-coverage-archive a:icontains(33-64 DECKLISTS)"
                );
    if(htmlDecksLinkQuery.length){
        allDecksExists = true;
    }
    var alldecksHtmls = "";
    var allDecksUrls = [];
    for(var i = 0; i<htmlDecksLinkQuery.length; i++){
        var res = request.getSync("http://magic.wizards.com" + $(htmlDecksLinkQuery[i]).attr("href"), {
            encoding: null
        });
        allDecksUrls.push($(htmlDecksLinkQuery[i]).attr("href"));
        var $deckHtml = cheerio.load(res.body);
        alldecksHtmls += $deckHtml("#main-content");
    }

    Events.update(
        {city: gp.city, date: gp.date},
        {
            $set : {allDecksUrls : allDecksUrls, alldecksHtmls : alldecksHtmls, allDecksExists : allDecksExists}
        },
        {upsert: true}
    );
}

getProTourRankingsTableHtml = function(){
    var gp = Events.findOne({html : {$exists : true}});
    var $ = cheerio.load(gp.html);
    var finalRanksExists = false;

    //Get Final Ranks HTML
    var standing = $(".final a")

    var res = request.getSync($(standing).attr("href"), {
        encoding: null
    });
    var $finalRanksHtml = cheerio.load(res.body);
    var finalRankingsTableHtml = $finalRanksHtml("#content-detail-page-of-an-article table");



    if(finalRankingsTableHtml.length){
        finalRanksExists = true;
    }

    Events.update(
        {city: gp.city, date: gp.date},
        {
            $set : {finalRanksUrl : $(".final a").attr("href"),finalRanksHtml : $finalRanksHtml(finalRankingsTableHtml).html(), finalRanksExists : finalRanksExists}
        },
        {upsert: true}
    );
}


getProTourRankings = function(){
    var gp = Events.findOne({html : {$exists : true}});

    if(!gp.finalRanksExists){
        return;
    }


    var $ = cheerio.load(gp.finalRanksHtml);

    var headerColumns = $("tr").first().find("td");
    var options = [];
    for(var i = 0; i < headerColumns.length; i++){
        options.push($(headerColumns[i]).text());
    }

    var rows = $("tr");
    var rankings = [];
    for(var i = 1; i < rows.length; i++){
        var column = $(rows[i]).find("td");
        var player = {};
        options.forEach(function(obj, j){
            if(isNaN(parseFloat($(column[j]).text()))){
                player[obj] = $(column[j]).text();
            }else{
                player[obj] = parseFloat($(column[j]).text());
            }
        });
        rankings.push(player);
    }

    Events.update(
        {city: gp.city, date: gp.date},
        {
            $set : {rankings : rankings}
        },
        {upsert: true}
    );
}

getPtTop8Bracket = function(){

    var gp = Events.findOne({html : {$exists : true}});

    var $ = cheerio.load(gp.html);
    var quarterFinalsPlayers = {};
    var semiFinalsPlayers = {};
    var finalsPlayers = {};

    quarterFinalsPlayers.winners = $(".quarterfinals .dual-players strong");
    quarterFinalsPlayers.losers = $(" .quarterfinals .dual-players .player p:not(:has(*))");
    semiFinalsPlayers.winners = $(".semifinals .dual-players .player p strong");
    semiFinalsPlayers.losers = $(".semifinals .dual-players .player p:not(:has(*))");
    finalsPlayers.winners = $(".finals .dual-players .player p strong");
    finalsPlayers.losers = $(".finals .dual-players .player p:not(:has(*))");

    var top8Bracket = {quarterFinals : [], semiFinals : [], finals : []};

    for(var i = 0; i<quarterFinalsPlayers.winners.length; i++){
        top8Bracket.quarterFinals.push(
            {
                winner : getInfoFromPlayerTop8Winner($(quarterFinalsPlayers.winners[i]).text().trim()),
                loser : getInfoFromPlayerTop8Loser($(quarterFinalsPlayers.losers[i]).text().trim())
            });
    }

    for(var i = 0; i<semiFinalsPlayers.winners.length; i++){
        top8Bracket.semiFinals.push(
            {
                winner : getInfoFromPlayerTop8Winner($(semiFinalsPlayers.winners[i]).text()),
                loser : getInfoFromPlayerTop8Loser($(semiFinalsPlayers.losers[i]).text())
            });
    }

    top8Bracket.finals.push(
        {
            winner : getInfoFromPlayerTop8Winner($(finalsPlayers.winners).text()),
            loser : getInfoFromPlayerTop8Loser($(finalsPlayers.losers).text())
        });

    Events.update(
        {city: gp.city, date: gp.date},
        {
            $set : {top8Bracket : top8Bracket}
        },
        {upsert: true}
    );
}


getProTourDecks = function(event){

    var gp = Events.findOne({html : {$exists : true}});
    var $ = cheerio.load(gp.alldecksHtmls);
    var decks = $('.bean--wiz-content-deck-list');

    for(var i = 0 ; i < decks.length; i++){
        var information = $(decks[i]).find('h4').html();
        var namePatt = new RegExp(/.*(?=&apos;)/i);
        var name = namePatt.exec(information)[0];

        var fullName = "";
        var deckPositionTable = gp.rankings.find(function(obj){

            var firstNamePatt = new RegExp(/\b[\w]+\b(?: .*)?(?= \[)/i);
            var secondNamePatt = new RegExp(/.*(?=,)/i);
            var firstName = firstNamePatt.exec(obj["Player Name"])[0];
            var secondName = secondNamePatt.exec(obj["Player Name"])[0];

            if(firstName == "Maxwell"){
                return name == "Max " + secondName;
            }
            fullName = firstName + " " + secondName;

            return name == fullName;
        });

        var data = {
            _eventID : gp._id,
            date : gp.date,
            eventType : gp.eventType,
            player : fullName,
            format : gp.format.toLowerCase(),
            position : deckPositionTable.Finish
        };

        var cards = $(decks[i]).find('.sorted-by-overview-container .row');
        var mainDeckQuantity = 0;
        var deckCards = {main : [], sideboard : []};
        for(var j = 0; j < cards.length; j++){
            var quantity = parseInt($(cards[j]).find('.card-count').text());
            mainDeckQuantity += quantity;
            var name = $(cards[j]).find('.card-name').text();
            deckCards.main.push(
                {
                    name : name,
                    quantity : quantity
                }
            );
        }

        var sideboard = $(decks[i]).find('.sorted-by-sideboard-container .row');
        var sideboardQuantity = 0;
        for(j = 0; j < sideboard.length; j++){
            var quantity = parseInt($(sideboard[j]).find('.card-count').text());
            sideboardQuantity += quantity;
            var name = $(sideboard[j]).find('.card-name').text();
            name = fixCards(name);
            deckCards.sideboard.push(
                {
                    name : name,
                    quantity : quantity
                }
            );
        }

        data.totalMain = mainDeckQuantity;
        data.main = deckCards.main;
        data.totalSideboard = sideboardQuantity;
        data.sideboard = deckCards.sideboard;
        data.colors = setUpColorForDeckName(deckCards);
        DecksData.update(
            {_eventID : data._eventID, player : data.player, position : data.position},
            {
                $setOnInsert : data,
                $set : data
            },
            {upsert : true}
        );
    }
}