import cheerio from "cheerio";
import Moment from "moment";
import Entities from "entities";
import Fuse from "fuse.js";


var eventsArray = [
    {name : "Power 9 Tournament", id : "19"},
    {name : "Classic", id : "36"},
    {name : "Elite IQ", id : "35"},
    {name : "Invitational", id : "21"},
    {name : "Invitational Qualifier", id : "29"},
    {name : "Legacy Open", id : "20"},
    {name : "Modern Open", id : "47"},
    {name : "Players' Championship", id : "48"},
    {name : "Premier IQ", id : "45"},
    {name : "Sealed Open", id : "39"},
    {name : "Standard Open", id : "19"},
    {name : "Super IQ", id : "33"},
    {name : "Team Constructed Open", id : "49"},
    {name : "States", id : "10"},
    {name : "Regionals", id : "7"},
]

var SCGFormats = [
    {name : "standard", id : 1},
    {name : "modern", id : 28},
    {name : "legacy", id : 3},
    {name : "standard", id : 4},
]

// http://sales.starcitygames.com/deckdatabase/deckshow.php?t_all=All&event_ID=36&feedin=&start_date=01%2F01%2F2017&end_date=03%2F26%2F2017&city=&state=&country=&start=&finish=&exp=&p_first=&p_last=&simple_card_name%5B1%5D=&simple_card_name%5B2%5D=&simple_card_name%5B3%5D=&simple_card_name%5B4%5D=&simple_card_name%5B5%5D=&w_perc=0&g_perc=0&r_perc=0&b_perc=0&u_perc=0&a_perc=0&comparison%5B1%5D=%3E%3D&card_qty%5B1%5D=1&card_name%5B1%5D=&comparison%5B2%5D=%3E%3D&card_qty%5B2%5D=1&card_name%5B2%5D=&comparison%5B3%5D=%3E%3D&card_qty%5B3%5D=1&card_name%5B3%5D=&comparison%5B4%5D=%3E%3D&card_qty%5B4%5D=1&card_name%5B4%5D=&comparison%5B5%5D=%3E%3D&card_qty%5B5%5D=1&card_name%5B5%5D=&sb_comparison%5B1%5D=%3E%3D&sb_card_qty%5B1%5D=1&sb_card_name%5B1%5D=&sb_comparison%5B2%5D=%3E%3D&sb_card_qty%5B2%5D=1&sb_card_name%5B2%5D=&card_not%5B1%5D=&card_not%5B2%5D=&card_not%5B3%5D=&card_not%5B4%5D=&card_not%5B5%5D=&order_1=finish&order_2=&limit=25&action=Show+Decks&p=1
//http://sales.starcitygames.com/deckdatabase/deckshow.php?

// t%5BT1%5D=
// &event_ID=
// &start_date=
// &end_date=
// &limit=25&action=Show+Decks&p=1

getSCGTemp = function(){

    var date = new Date();
    date.setHours(0, 0, 0, 0);
    var startDate = Moment(new Date(date.getTime() - 1000*60*60*24*30)).format("MM/DD/YYYY");
    var endDate = Moment(date).format("MM/DD/YYYY");
    endDate = endDate.replace(/\//g, "%2F");
    startDate = startDate.replace(/\//g, "%2F");
    for(var i = 0; i < eventsArray.length; i++) {
        webScrapingQueue.add({func : getDecksList, args :{endDate : endDate, startDate: startDate, event : eventsArray[i], start_num : 0}, wait : 10000});
    }
}

getDecksList = ({endDate, startDate, event, start_num})=>{
        var url = `http://sales.starcitygames.com/deckdatabase/deckshow.php?&event_ID=${event.id}&start_date=${startDate}&end_date=${endDate}&start_num=${start_num}&limit=100`;
        Meteor.http.get(url, {},(err, response)=>{
            if (response.statusCode == 200) {
                var $resDecksPages = cheerio.load(response.content, {decodeEntities : false});
                var titleText = $resDecksPages(".titletext");
                var qty = parseInt(titleText.text().match(/\d+/));
                var rows = $resDecksPages("#content table tr");

                if(!isNaN(qty)){

                    for(var i = 0; i < rows.length; i++){
                        var deckUrl = $resDecksPages(rows[i]).find("td:nth-child(1) a").attr("href");
                        var position = $resDecksPages(rows[i]).find("td:nth-child(2)").text();
                        var player = $resDecksPages(rows[i]).find("td:nth-child(3)").text();
                        var eventType = $resDecksPages(rows[i]).find("td:nth-child(4)").text();
                        var format = $resDecksPages(rows[i]).find("td:nth-child(5)").text();
                        var dateString = $resDecksPages(rows[i]).find("td:nth-child(6)").text();
                        var location = $resDecksPages(rows[i]).find("td:nth-child(7)").text();

                        if(deckUrl && position && player){
                            position = fixHtmlFromCherrios(position);
                            player = fixHtmlFromCherrios(player);
                            var eventsTypeFixed = fixHtmlFromCherrios(eventType);
                            format = fixHtmlFromCherrios(format).toLowerCase();
                            dateString = fixHtmlFromCherrios(dateString);
                            location = fixHtmlFromCherrios(location);
                            var date = Moment(dateString, "YYYY-MM-DD").toDate();
                            position = parseInt(position.match(/\d+/));

                            var EventsTypeQuery = EventsTypes.findOne({names : {$regex : eventsTypeFixed, $options : "i"}}, {limit : 1});

                            Events.update({EventsType_id : EventsTypeQuery._id, date : date, location : location, format : format.toLowerCase(), state : "SCGCreated"},
                                {
                                    $setOnInsert : {EventsType_id : EventsTypeQuery._id, date : date, location : location, format : format.toLowerCase(), state : "SCGCreated"}
                                },
                                {
                                    upsert : true
                                })
                            var eventQuery = Events.findOne({EventsType_id : EventsTypeQuery._id, date : date, location : {$regex : location, $options : "i"}, format : format.toLowerCase()})
                            DecksData.update({EventsType_id : EventsTypeQuery._id, player : player, Events_id : eventQuery._id, date : date, format : format},
                                {
                                    $set : {EventsType_id : EventsTypeQuery._id, player : player, Events_id : eventQuery._id, date : date, position : position, format : format, state : "SCGCreated", deckUrl : deckUrl}
                                },
                                {
                                    upsert : true
                                }
                            )
                        }
                    }

                    for(var i = 100 + start_num; i < qty; i += 100){
                        webScrapingQueue.add({func : getDecksList, args :{endDate : endDate, startDate: startDate, event : event, start_num : i}, wait : 10000});
                    }
                }
            }
        });
}


decksDownloadDecks = ()=>{
    console.log("START: decksDownloadDecks");
    var DecksDataQuery = DecksData.find({state : "SCGCreated"}, {limit : 3}).fetch();

    for(var i = 0 ; i < DecksDataQuery.length; i++){
        webScrapingQueue.add({func : decksDownloadDecksHTTPRequest, args : {deckData : DecksDataQuery[i]}, wait : 10000 });
    }
    console.log("   END: decksDownloadDecks");
}

decksDownloadDecksHTTPRequest = ({deckData})=>{
    console.log(deckData);
    // console.log(deckData);
    Meteor.http.get(deckData.deckUrl, {},(err, response)=>{
        if (response.statusCode == 200) {
            var $decksBlocks = cheerio.load(response.content, {decodeEntities : false});
            var mainCards = $decksBlocks(".decklist_heading+ ul li");
            var sideboardCards = $decksBlocks(".deck_sideboard li");

            var cardPattern = /(\d+) (.*)/i;
            var main = [];
            for(var j = 0; j < mainCards.length; j++){
                var regexResult = $decksBlocks(mainCards[j]).text().match(cardPattern);
                var quantity = parseInt(regexResult[1]);
                var cardName = regexResult[2].toTitleCase();
                cardName = fixCards(cardName);
                main.push({ name : cardName, quantity : quantity });
            }

            var sideboard = [];

            for(var j = 0; j < sideboardCards.length; j++){
                var regexResult = $decksBlocks(sideboardCards[j]).text().match(cardPattern);
                var quantity = parseInt(regexResult[1]);
                var cardName = regexResult[2].toTitleCase();
                cardName = fixCards(cardName);
                sideboard.push({ name : cardName, quantity : quantity });
            }
            DecksData.update({_id : deckData._id},
                {
                    $set : {main : main, sideboard : sideboard, state : "done"}
                })
        }
    });
}


checkIfCardExists =()=>{

}


getStarCityGamesEvents = function(format) {
    console.log("START: getStarCityGamesEvents");
    var url = "http://www.starcitygames.com/";
    var resMainPage = Meteor.http.get(url);
    if (resMainPage.statusCode == 200) {
        var $resMainPage = cheerio.load(resMainPage.content, {decodeEntities : false});

        var linksContainer = $resMainPage(`#content_decks_${format}`);

        var $linksContainer = cheerio.load(linksContainer.html(), {decodeEntities : false});
        var eventsLinks = $linksContainer("li a");
        for(var i = 0; i < eventsLinks.length; i++) {
            webScrapingQueue.add({
                func: starCityGamesCheckIfEventsExists,
                args: {eventLink: eventsLinks[i], $linksContainer, format : format},
                wait: 10000
            });
        }
    }
    console.log("   END: getStarCityGamesEvents");
}


starCityGamesCheckIfEventsExists = ({eventLink, $linksContainer, format})=>{
        console.log($linksContainer(eventLink).html());

        var eventPattern = /(\d+\/\d+) (?:SCG )?(Super IQ|SCG Modern Open Dallas|Magic Online World Championship|Invi Qualifier|Invitational|Classic|Players' Championship|(?:Modern|Standard|Legacy|Vintage)? ?Open|Grand Prix|Legacy Champs|World Magic Cup) (.*), ?(?:\w\w)?/i;
        var eventPatternMatch = $linksContainer(eventLink).html().match(eventPattern);
        var event = {};
        if(eventPatternMatch == null){
            return
        };

        if(eventPatternMatch[1].slice(0, 2)=="12" || eventPatternMatch[1].slice(0, 2)=="11" ){
            event.date = new Date(eventPatternMatch[1] + "/2016");
        }else{
            event.date = new Date(eventPatternMatch[1] + "/2017");
        }

        event.type = "SCG" + eventPatternMatch[2].replace(/\s/g, "");
        event.city = eventPatternMatch[3];
        event.country = eventPatternMatch[4];
        event.url = $linksContainer(eventLink).attr("href").replace(/limit=\d{1,3}/i, "limit=100");
        event.state = "startProduction";
        event.venue = "SCG";

        if(Events.findOne({city : event.city, event : event.date, format : format, type : event.type}))
        {
            return;
        }

        Events.update({city : event.city, event : event.date, format : format, type : event.type},
            {$set : event},
            {upsert : true}
        );

        var resEventPage = Meteor.http.get(event.url);
        if(resEventPage.statusCode == 200){

            var $resEventPage = cheerio.load(resEventPage.content, {decodeEntities : false});
            var decksLinks = $resEventPage('a[href*="DeckID"]');
            var state = "notFound";
            if(decksLinks.length){
                state = "exists";
            }
            event.state = state;

            Events.update({city : event.city, event : event.date, format : format, type : event.type},
                {$set : event},
                {upsert : true}
            );
        }
}

SCGnotFound = function(Events_id){

    var event = Events.findOne({Events_id : "notFound"});

    if(!event){
        return;
    }

    var resEventPage = Meteor.http.get(event.url);

    if(resEventPage.statusCode == 200){

        var $resEventPage = cheerio.load(resEventPage.content, {decodeEntities : false});
        var decksLinks = $resEventPage('a[href*="DeckID"]');
        var state = "notFound";
        if(decksLinks.length){
            state = "exists";
        }
        event.state = state;

        Events.update({_id : Events_id},
            {$set : {}}
        );
    }
}

SCGEventExists = function(Events_id) {
    console.log("START: SCGEventExists");

    var event = Events.findOne({_id : Events_id});

    var resMainPage = Meteor.http.get(event.url);
    if (resMainPage.statusCode == 200) {
        var $resEventPage = cheerio.load(resMainPage.content, {decodeEntities : false});
        var positions = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
        var positionQuery = $resEventPage(".finish_display");
        var positonsMap = [];


        for(var j = 0; j < positionQuery.length; j++){
            positonsMap.push($resEventPage(positionQuery[j]).text());
        }

        var positionDifference = _.difference(positions, positonsMap);
        if(positionDifference.length == 0) {
            EventsHtmls.remove({Events_id : Events_id});

            var decksLinks = $resEventPage('a[href*="DeckID"]');
            for(var j = 0; j < decksLinks.length; j++){
                webScrapingQueue.add({func : SCGGetDecks, args : {decksLink : decksLinks[i], Events_id : id}, wait : 10000})
            }
            webScrapingQueue.add({func : SCGCheckIfEventIsCompleted, args : {Events_id : Events_id}, wait : 10000})
        }
    }else{
        Events.update({_id : _id},
            {$set :   {state : "HTMLFail"}}
        )
    }
    console.log("   END: SCGEventExists");
}

SCGCheckIfEventIsCompleted = (Events_id)=>{
    var urlChecked = EventsHtmls.find({Events_id : Events_id, "decks.state" : "bad"}, {limit : 1}).fetch();
    var state = "HTML";

    if(urlChecked.length){
        state = "partialDecks";
    }
    Events.update({_id : _id},
        {$set : {state : state}}
    )
}

SCGGetDecks = function({deckLink, Events_id}){
    var resDeckHTML = Meteor.http.get(deckLink).attr("href");
    var deck = {state : "bad", deckLink : deckLink};

    if (resDeckHTML.statusCode == 200) {
        var $resDeckHTML = cheerio.load(resDeckHTML.content, {decodeEntities : false});
        var deckListing = $resDeckHTML("#content");
        if(deckListing.length){
            deck.html = $resDeckHTML(deckListing[0]).html();
            deck.state = "good";
        }
    }

    EventsHtmls.update({Events_id : Events_id, decks : {$exists : false}},
        {
            $setOnInsert : {Events_id : Events_id, decks : []}
        },
        {
            upsert : true
        }
    )

    EventsHtmls.update({Events_id : Events_id},
        {
            $push : {$decks : deck}
        }
    )
}

SCGEventHTML = function(_id){
    console.log("START: SCGEventHTML");
    DecksData.remove({Events_id : _id});
    var event = Events.findOne({_id : _id, state : "HTML"});
    if(!event){
        return;
    }

    var html = EventsHtmls.findOne({Events_id : _id}).html;

    var $decksBlocks = cheerio.load(html, {decodeEntities : false});
    var decks = $decksBlocks("#article_content");


    var decksCount = 0;
    for(var i = 0; i < decks.length; i++){
        var positionPatt = /\d+(?=st|nd|rd|th)/i;

        var mainCards = $decksBlocks(decks[i]).find(".decklist_heading+ ul li");
        var sideboardCards = $decksBlocks(decks[i]).find(".deck_sideboard li");

        var cardPattern = /(\d+) (.*)/i;
        var main = [];
        var totalMain = 0;
        for(var j = 0; j < mainCards.length; j++){
            var regexResult = $decksBlocks(mainCards[j]).text().match(cardPattern);
            var quantity = parseInt(regexResult[1]);
            var cardName = regexResult[2].toTitleCase();
            totalMain += quantity;
            cardName = fixCards(cardName);

            if(CardsFullData.find({name : cardName}, {limit : 1}).count()) {
                main.push({name : cardName, quantity : quantity});
            }else{
                main.push({ name : cardName,
                            quantity : quantity,
                            wrongName : true
                });
            }

        }
        var sideboard = [];
        var totalSideboard = 0;
        for(var j = 0; j < sideboardCards.length; j++){
            var regexResult = $decksBlocks(sideboardCards[j]).text().match(cardPattern);
            var quantity = parseInt(regexResult[1]);
            var cardName = regexResult[2].toTitleCase();
            totalSideboard += quantity;
            cardName = fixCards(cardName);

            if(CardsFullData.find({name : cardName, limit : 1}).count()) {
                sideboard.push({name : cardName,
                                quantity : quantity
                });
            }else{
                sideboard.push({name : cardName,
                                quantity : quantity,
                                wrongName : true
                });
            }
        }

        data.totalMain = totalMain;
        data.main = main;
        data.totalSideboard = totalSideboard;
        data.sideboard = sideboard;
        data.colors = setUpColorForDeckName(main);

        data.state = "scraped";
        DecksData.insert(data);
        decksCount++;
    }
    if(decksCount == decks.length){
        Events.update(
            {_id : _id},
            {
                $set : {
                    state : "decks", decks : decks.length
                }
            }
        );
    }else{
        Events.update(
            {_id : _id},
            {
                $set : {
                    state : "decks", decks : decks.length
                }
            }
        );
    }

    console.log("   END: SCGEventHTML");
}