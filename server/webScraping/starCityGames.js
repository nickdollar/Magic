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
            var eventPattern = /(\d+\/\d+) (?:SCG )?(Super IQ|Invi Qualifier|Invitational|Classic|Players' Championship|Open|Grand Prix|Legacy Champs|World Magic Cup) (.*), (\w\w)/i;
            var eventPatternMatch = $resMainPage(eventsLinks[i]).html().match(eventPattern);
            var event = {};
            if(eventPatternMatch == null){
                continue
            };

            if(eventPatternMatch[1].slice(0, 2)=="12" || eventPatternMatch[1].slice(0, 2)=="11" ){
                event.date = new Date(eventPatternMatch[1] + "/2016");
            }else{
                event.date = new Date(eventPatternMatch[1] + "/2017");
            }

            event.type = "SCG" + eventPatternMatch[2].replace(/\s/g, "");
            event.city = eventPatternMatch[3];
            event.country = eventPatternMatch[4];
            event.url = $resMainPage(eventsLinks[i]).attr("href").replace(/limit=\d{1,3}/i, "limit=100");
            event.state = "startProduction";
            event.venue = "SCG";

            if(Events.findOne({city : event.city, event : event.date, format : format, type : event.type}))
            {
                continue;
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
    }
    console.log("END: getStarCityGamesEvents");
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

SCGEventExists = function(_id) {
    console.log("START: SCGEventExists");

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

            var wrong = 0;
            for(var j = 0; j < decksLinks.length; j++){
                var resDeckHTML = Meteor.http.get($resEventPage(decksLinks[j]).attr("href"));

                if (resDeckHTML.statusCode == 200) {
                    var $resDeckHTML = cheerio.load(resDeckHTML.content, {decodeEntities : false});
                    var deckListing = $resDeckHTML("#content");
                    if(deckListing.length){
                        html += $resDeckHTML(deckListing[0]).html();
                        urlChecked = true;
                    }
                }else{
                    wrong ++;
                }
                urls.push({url : $resEventPage(decksLinks[j]).attr("href"), worked : urlChecked });
            }

            var state;

            if(wrong==0){
                state="HTML"
            }else{
                state="HTMLPartial"
            }

            Events.update({_id : _id},
                          {$set :   {
                                      state : state,
                                    }
                          }
            )
            EventsHtmls.insert({Events_id : _id, html : html, urls : urls})
        }
    }else{
        Events.update({_id : _id},
            {$set :   {
                state : "HTMLFail"
            }
            }
        )
    }
    console.log("END: SCGEventExists");
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

        var data = {
            Events_id : _id,
            date : event.date,
            type : event.type,
            player : $decksBlocks(decks[i]).find(".player_name a").html(),
            format : event.format,
            position : parseInt($decksBlocks(decks[i]).find(".deck_played_placed").html().match(positionPatt)[0])
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

    console.log("END: SCGEventHTML");
}