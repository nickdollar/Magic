import cheerio from "cheerio";
import moment from "moment";

getStarCityGamesEvents = function(format) {
    console.log("START: getStarCityGamesEvents");
    var url = "http://www.starcitygames.com/";
    var resMainPage = Meteor.http.get(url);
    if (resMainPage.statusCode == 200) {
        var $resMainPage = cheerio.load(resMainPage.content, {decodeEntities : false});
        var eventsLinks = $resMainPage("#content_decks_" + format + " li a");

        for(var i = 0; i < eventsLinks.length; i++){
            console.log($resMainPage(eventsLinks[i]).html());

            var eventPattern = /(\d+\/\d+) (SCG Super IQ|Invi Qualifier|SCG Invitational|SCG Classic|SCG Open|Grand Prix|Legacy Champs|World Magic Cup) (.*), (\w\w)/i;
            var eventPatternMatch = $resMainPage(eventsLinks[i]).html().match(eventPattern);
            var event = {};
            if(eventPatternMatch == null){
                continue
            };
            event.date = new Date(eventPatternMatch[1] + "/2016");
            event.eventType = eventPatternMatch[2].replace(/\s/g, "");
            event.city = eventPatternMatch[3];
            event.country = eventPatternMatch[4];
            event.url = $resMainPage(eventsLinks[i]).attr("href").replace(/limit=\d{1,3}/i, "limit=100");
            event.validation = {};
            var resEventPage = Meteor.http.get(event.url);
            if(resEventPage.statusCode == 200){

                var $resEventPage = cheerio.load(resEventPage.content, {decodeEntities : false});
                var decksLinks = $resEventPage('a[href*="DeckID"]');
                var exists = false;
                if(decksLinks.length){
                    exists = true;
                }
                event.validation.exists = exists;

                Events.update({city : event.city, event : event.date, format : format, eventType : event.eventType},
                    {$set : event},
                    {upsert : true}
                );
            }
        }
    }
    console.log("END: getStarCityGamesEvents");
}

getStarCityGamesEventsDownloadHTMLS = function(_id) {
    console.log("START: getStarCityGamesEventsDownloadHTMLS");

    var event = Events.findOne({_id : _id});

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
            var decksLinks = $resEventPage('a[href*="DeckID"]');
            var html = "";
            var urls = [];
            var urlChecked = false;
            for(var j = 0; j < decksLinks.length; j++){
                var resDeckHTML = Meteor.http.get($resEventPage(decksLinks[j]).attr("href"));

                if (resDeckHTML.statusCode == 200) {
                    var $resDeckHTML = cheerio.load(resDeckHTML.content, {decodeEntities : false});
                    var deckListing = $resDeckHTML("#content");
                    if(deckListing.length){
                        html += $resDeckHTML(deckListing[0]).html();
                        urlChecked = true;
                    }
                }
                urls.push({url : $resEventPage(decksLinks[j]).attr("href"), worked : urlChecked });
            }
            Events.update({_id : _id},
                          {$set :   {
                                      "validation.htmlDownloaded" : true,
                                      urls : urls
                                    }
                          }
            )
            EventsHtmls.insert({Events_id : _id, html : html})
        }
    }
    console.log("END: getStarCityGamesEventsDownloadHTMLS");
}

getStarCityGamesExtractDecks = function(_id){
    DecksData.remove({Events_id : _id});
    var event = Events.findOne({_id : _id});
    var html = EventsHtmls.findOne({Events_id : _id}).html;

    var $decksBlocks = cheerio.load(html, {decodeEntities : false});
    var decks = $decksBlocks("#article_content");


    for(var i = 0; i < decks.length; i++){
        var positionPatt = /\d+(?=st|nd|rd|th)/i;

        var data = {
            Events_id : _id,
            date : event.date,
            eventType : event.eventType,
            player : $decksBlocks(decks[i]).find(".player_name a").html(),
            format : event.format,
            position :$decksBlocks(decks[i]).find(".deck_played_placed").html().match(positionPatt)[0]
        }
        var mainCards = $decksBlocks(decks[i]).find(".decklist_heading+ ul li");
        var sideboardCards = $decksBlocks(decks[i]).find(".deck_sideboard li");

        tempCollection.insert({html : $decksBlocks(decks[i]).html()});
        var cardPattern = /(\d+) (.*)/i;
        var main = [];
        var totalMain = 0;
        for(var j = 0; j < mainCards.length; j++){
            var regexResult = $decksBlocks(mainCards[j]).text().match(cardPattern);
            var quantity = parseInt(regexResult[1]);
            var cardName = regexResult[2].toTitleCase();
            totalMain += quantity;
            if(CardsFullData.find({name : cardName}).count()) {
                main.push({name : cardName, quantity : quantity});
            }else{
                main.push({name : cardName, quantity : quantity, wrongName : true});
            }

        }

        var sideboard = [];
        var totalSideboard = 0;
        for(var j = 0; j < sideboardCards.length; j++){
            var regexResult = $decksBlocks(sideboardCards[j]).text().match(cardPattern);
            var quantity = parseInt(regexResult[1]);
            var cardName = regexResult[2].toTitleCase();
            totalSideboard += quantity;

            if(CardsFullData.find({name : cardName}).count()) {
                sideboard.push({name : cardName, quantity : quantity});
            }else{
                sideboard.push({name : cardName, quantity : quantity, wrongName : true});
            }
        }
        data.totalMain = totalMain;
        data.main = main;
        data.totalSideboard = totalSideboard;
        data.sideboard = sideboard;
        DecksData.insert(data);

    }
}