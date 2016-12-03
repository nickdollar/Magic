

import cheerio from "cheerio";

var monthValues = { jan : 0, january : 0, feb : 1, february : 1, mar : 2, march : 2, apr : 3, april : 3, may : 4, jun : 5, june : 5,
                        jul : 6, july : 6, aug : 7, august : 7, sep : 8, september : 8, oct : 9, october : 9, nov : 10, november : 10, dec : 11, december : 11
                    }





getGPLinks = function(){

    var res = Meteor.http.get("http://magic.wizards.com/en/events/coverage");

    if(res.statusCode == 200){
        var buffer = res.content;
        var $ = cheerio.load(buffer);
        var html = $('#2016-2017-season h4:contains(Grand Prix) + p a');
        var events = [];
        for(var i = 0; i < html.length; i++){

            var event = {};
            var eventCorrected = {};
            if($(html[i]).html() != null && $(html[i]).html() != ""){
                event.city = $(html[i]).html();
                event.DateFormat = $(html[i])[0].nextSibling.nodeValue;

            }else{
                continue;
            }

            // if($(html[i]).next()[0].nextSibling.nodeValue != null){
            //     event.date += $(html[i]).next()[0].nextSibling.nodeValue;
            // }

            if($(html[i]).next().html() != null && $(html[i]).next().html() != ""){
                event.edition = $(html[i]).next().html();
            }


            if(event.edition != null){
                continue;
            }


            console.log(event);
            if(!/(modern|legacy|standard|vintage)/i.test(event.DateFormat)){
                continue;
            }


            if(event.city != null && event.city != ""){
                eventCorrected.city = event.city;
            }

            console.log(eventCorrected);


            if(event.DateFormat != null && event.DateFormat != ""){
                var month = event.DateFormat.match(/\b(?:jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|september|oct|october|nov|november|dec|december)\b/i)[0];
                var day = event.DateFormat.match(/(?:\d{1,2})\b/i)[0];
                var year = event.DateFormat.match(/(?:20\d{1,2})\b/i)[0];
                eventCorrected.date = new Date(parseInt(year), monthValues[month.toLowerCase()],parseInt(day));
                eventCorrected.format = event.DateFormat.match(/(?:modern|legacy|standard|limited|vintage)/i)[0];
                eventCorrected.format = eventCorrected.format.toLowerCase();
            }

            // if(event.edition != null && event.edition != ""){
            //     eventCorrected.edition = event.edition;
            // }

            eventCorrected.url = "http://magic.wizards.com" + $(html[i]).attr("href");
            eventCorrected.eventType = "GP";

            console.log(eventCorrected.url);

            var eventRes = Meteor.http.get(eventCorrected.url);

            console.log(eventRes.statusCode);

            if (eventRes.statusCode == 200) {
                var $htmlEvent = cheerio.load(eventRes.content);
                var htmlEvent = $htmlEvent('#content');
                var upsert = false;
                if (htmlEvent.length == 0) {
                    console.log("Page Doesn't exists");
                } else {
                    upsert = true;
                    console.log("Page exists");
                }
            }

            eventCorrected.validation = {exists : upsert};

            Events.update(
                {city : eventCorrected.city, date : eventCorrected.date},
                {
                    $set : eventCorrected,
                },
                {upsert : true}
            )
            console.log("end");
        }
    }
}

eventGPMainDownloadHTML = function(_id){
    var event = Events.findOne({eventType : {eventType : "GP"}, _id : _id, "validation.exists" : true, $or : [{"validation.htmlDownloaded" : {$exists : false}}, {"validation.htmlDownloaded" : false}]});

    if(event == null) {
        return;
    }

    var res = Meteor.http.get(event.url);


    if (res.statusCode == 200) {
        var buffer = res.content;
        var $ = cheerio.load(buffer);
        var deckMeta = $('#main-content');
        if(deckMeta.length == 0){
            console.log("event not found");
            Events.update(
                {_id : _id},
                {
                    $set : {
                        "validation.htmlDownloaded" : false
                    }
                }
            );
        }else{
            console.log("event found");
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
                        "validation.htmlDownloaded" : true
                    }
                }
            );
        }
    }
};


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

/*
TOP 8 DECKS
TOP 8 DECKLISTS
FINALS DECKLISTS
TOP 16 DECKLISTS
TOP 9-32 DECKLISTS
9-32 DECKLISTS
9-64 DECKLISTS
9TH TO 64TH DECKLISTS
9TH-32ND DECKS
9TH-32ND DECKLISTS
9TH - 32ND DECKLISTS
9TH TO 16TH DECKLISTS
TOP 32 DECKLISTS
33-64 DECKLISTS
33RD-64TH DECKLISTS
33RD - 64TH DECKLISTS
 TOP 64 DECKLISTS

*/

getProTourHTMLS = function(_id){
    console.log("START: getProTourHTMLS");
    var gp = Events.findOne({_id : _id});
    var resMain = Meteor.http.get(gp.url);
    var $ = cheerio.load(resMain.content);
    console.log(resMain.statusCode);
    if (resMain.statusCode == 200) {

        var decksHtml = "";
        var extrasURL = [];
        var allDecksExists = false;
        var checks = true;

        //Get Deck HTML
        var htmlDecksLinkQuery = $("#full-coverage-archive a:icontains(TOP 8 DECKS), #full-coverage-archive a:icontains(TOP 8 DECKLISTS), #full-coverage-archive a:icontains(FINALS DECKLISTS), " +
            "#full-coverage-archive a:icontains(TOP 16 DECKLISTS), #full-coverage-archive a:icontains(TOP 9-32 DECKLISTS), " +
            "#full-coverage-archive a:icontains(9-32 DECKLISTS), #full-coverage-archive a:icontains(9-64 DECKLISTS),  #full-coverage-archive a:icontains(9TH TO 64TH DECKLISTS), " +
            "#full-coverage-archive a:icontains(9TH-32ND DECKS),  #full-coverage-archive a:icontains(9TH-32ND DECKLISTS), #full-coverage-archive a:icontains(9TH - 32ND DECKLISTS)," +
            "#full-coverage-archive a:icontains(9TH TO 16TH DECKLISTS)," +
            "#full-coverage-archive a:icontains(TOP 32 DECKLISTS), #full-coverage-archive a:icontains(33-64 DECKLISTS), #full-coverage-archive a:icontains(33RD-64TH DECKLISTS), " +
            "#full-coverage-archive a:icontains(33RD - 64TH DECKLISTS), #full-coverage-archive a:icontains(TOP 64 DECKLISTS)"
        );

        for(var i = 0; i < htmlDecksLinkQuery.length; i++){
            var resDecks = Meteor.http.get("http://magic.wizards.com" + $(htmlDecksLinkQuery[i]).attr("href"));
            if(resDecks.statusCode == 200){
                extrasURL.push({url : "http://magic.wizards.com" + $(htmlDecksLinkQuery[i]).attr("href"), worked : true});
                var $resDecks = cheerio.load(resDecks.content);
                decksHtml += $resDecks('#main-content').html();
            }else{
                extrasURL.push({url : "http://magic.wizards.com" + $(htmlDecksLinkQuery[i]).attr("href"), worked : false});
            }
        }


        var standingURL = $(".final a")
        var finalStandingResponse = Meteor.http.get(standingURL.attr("href"));


        console.log(standingURL.attr("href"));
        if(finalStandingResponse.statusCode == 200){
            var $finalStandingResponse = cheerio.load(finalStandingResponse.content);
            var finalStandingHTML = $finalStandingResponse('#content-detail-page-of-an-article table');
            if(finalStandingHTML.length){
                extrasURL.push({url : standingURL.attr("href"), worked : true});
                decksHtml += finalStandingHTML.html();
            }
        }else{
            checks = false;
            extrasURL.push({url : standingURL.attr("href"), worked : false});
        }


        EventsHtmls.update({Events_id : _id},
            {
                $set: {html : decksHtml}
            },
            {upsert: true}
        );

        Events.update(
            {_id : _id},
            {
                $set: {"validation.htmlDownloaded" : checks, urls : extrasURL}
            },
            {upsert: true}
        );
    }
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


eventPTExtractDecks = function(_id){
    console.log("START: eventPTExtractDecks");
    console.log(_id);

    var event = Events.findOne({_id : _id, "validation.exists" : true, "validation.htmlDownloaded" : true, $or : [{"validation.extractDecks" : {$exists : false}}, {"validation.extractDecks" : false}]});
    if(event == null) return;
    console.log("FOUND EVENT");
    DecksData.remove({Events_id : event._id});

    var html = EventsHtmls.findOne({Events_id : _id}).html;
    var $ = cheerio.load(html);
    var names = $("td:nth-child(2)");
    var rankings = [];


    var rows = $("tr");
    var rankings = [];
    for(var i = 1; i < rows.length && i < 65; i++){
        var position = parseInt($(rows[i]).find("td:nth-child(1)").html());
        var player = $(rows[i]).find("td:nth-child(2)").html();
        player = fixNames(player);
        var firstNamePatt = new RegExp(/(?:[^ ,]+ +)*?(?:\S*)(?= \[| $|$)/i);
        var secondNamePatt = new RegExp(/(?=[a-zA-Z]).*?(?=,)/i);
        var firstName = player.match(firstNamePatt)[0];
        var secondName = player.match(secondNamePatt)[0];
        var fullName = firstName + " " + secondName;
        // console.log(fullName);
        rankings.push({position : position, player : player, firstName : firstName, secondName : secondName, fullName : fullName});
    }

    var decks = $('.bean--wiz-content-deck-list');
    var count = 0;



    console.log(decks.length );
    for(var i = 0 ; i < decks.length; i++){
        var information = getPTDeckInfo($(decks[i]).find('h4').html());
        // console.log(i + " " + information.player);

        var result = rankings.filter(function(obj){
            var lastNameCheck = new RegExp("\\b" +obj.secondName+"\\b", "i");
            return lastNameCheck.test(information.player);
        });

        if(result.length > 1){
            // console.log("++++++++++++++++++++++++++++++++++++++");
                result = rankings.find(function(obj){
                var lastNameCheck = new RegExp("\\b" +obj.secondName+"\\b", "i");
                var secondCheckName = new RegExp("\\b" + obj.firstName + "\\b", "i");
                var secondCheckInitial = new RegExp("^" + obj.firstName[0], "i");
                if(lastNameCheck.test(information.player)){
                    // console.log("first check: " + lastNameCheck +" - "+ information.player + " - " + obj.fullName + " - "  + secondCheckName);

                    if(secondCheckName.test(information.player)) {
                        // console.log("second check");
                        count++;
                        return true;
                    }
                    // console.log("first check: " + lastNameCheck +" - "+ information.player + " - " + obj.fullName + " - "  + secondCheckInitial);

                    if(secondCheckInitial.test(information.player)) {
                        // console.log("second check");
                        count++;
                        return true;
                    }

                }
                return false;
            })
            // console.log("---------------------------------------");
        }else if(result.length == 1){
            count++;
            result = result[0];
        }else{
            result = null;
        }


        if( result == null){
            console.log($(decks[i]).find('h4').html());
            console.log(getPTDeckInfo($(decks[i]).find('h4').html()));

            console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");

        }
        var position = null;
        var player = null;


        if(result){
            console.log(result);
            position = result.position;
            player = result.fullName;
        }

        var data = {
            Events_id : event._id,
            date : event.date,
            eventType : event.eventType,
            player : player,
            format : event.format,
            position : position
        };


        var cards = $(decks[i]).find('.sorted-by-overview-container .row');
        var deckCards = {main : [], sideboard : []};
        var mainDeckQuantity = 0;
        for(var j = 0; j < cards.length; j++){
            var quantity = parseInt($(cards[j]).find('.card-count').text());
            mainDeckQuantity += quantity;
            var name = $(cards[j]).find('.card-name').text();
            name = fixCards(name);

            CardsData.find({ name : name});

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
        var colors = setUpColorForDeckName(deckCards);
        data.colors = colors;
        DecksData.insert(data);

        var cardsOnMain = [];

        data.main.forEach(function(obj){
            cardsOnMain.push(obj.name)
        });

    }

    Events.update(
        {_id : event._id},
        {
            $set : {
                "validation.extractDecks" : true, decks : decks.length
            }
        }
    );
    console.log(count);
}

getPTDeckInfo = function(information){
    information = fixNames(information);
    var temp = {};
    var namePatt = new RegExp(/(?:\b\S+\b +)+?\b\S+\b(?=(?:'s?| -| U\/W| R\/W))/i);
    temp.player = information.match(namePatt)[0];
    return temp;
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


fixNames = function(name){
    name = name.replace(/[^\u0000-\u007F]/g, ".");
    name = name.replace(/&apos;/ig, "'");
    name = name.replace(/&#x2013;/ig, "-");
    name = name.replace(/&#xED;/ig, "i");
    name = name.replace(/&#xE9;/ig, "e");
    name = name.replace(/&#xEB;/ig, "e");
    name = name.replace(/&#x16f;/ig, "u");
    name = name.replace(/&#xe1;/ig, "a");
    name = name.replace(/&#xc3;/ig, "a");
    name = name.replace(/&#xa9;/ig, "c");
    name = name.replace(/&#xfa;/ig, "u");

    name = name.replace(/\bninzansky\b/ig, "niznansky");
    name = name.replace(/\bdickman\b/ig, "dickmann");
    name = name.replace(/\brottman\b/ig, "Rottmann");
    name = name.replace(/\bMcgrgeor\b/ig, "mcgregor");
    name = name.replace(/\bKAKLAUSKUS\b/ig, "kaklauskas");
    name = name.replace(/\bgarrido sanchez\b/ig, "sanchez garrido");
    name = name.replace(/\bKRZYSTOF\b/ig, "krzysztof");
    name = name.replace(/\bmarek krzysztof\b/ig, "Krzysztof marek");
    name = name.replace(/\bni chang wie shen\b/ig, "wei shen ni chang");
    name = name.replace(/\bBoulinguiez Mike\b/ig, "Mike Boulinguiez");

    name = name.replace(/\broz\b/ig, "ros");
    name = name.replace(/\bmser\b/ig, "musser");
    name = name.replace(/\bpleasant\b/ig, "pleasants");
    name = name.replace(/\bMorifuji\b/ig, "Morofuji");

    name = name.replace(/\bpacrez\b/ig, "perez" );
    name = name.replace(/\bolivera\b/ig, "oliveira");
    name = name.replace(/\bgesez\b/ig, "gerez");
    name = name.replace(/\bcao\b/ig, "chao");
    name = name.replace(/\brong\b/ig, "Choong");







    name = name.toLowerCase();


    return name;
}