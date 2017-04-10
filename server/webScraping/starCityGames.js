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

getSCGEventsAndDecks = function(){
    logFunctionsStart("getSCGEventsAndDecks");
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    var startDate = Moment(new Date(date.getTime() - 1000*60*60*24*30)).format("MM/DD/YYYY");
    var endDate = Moment(date).format("MM/DD/YYYY");
    endDate = endDate.replace(/\//g, "%2F");
    startDate = startDate.replace(/\//g, "%2F");
    for(var i = 0; i < eventsArray.length; i++) {
        webScrapingQueue.add({func : getSCGEventsAndDecksHTTPRequest, args :{endDate : endDate, startDate: startDate, event : eventsArray[i], start_num : 0}, wait : httpRequestTime});
    }
    logFunctionsEnd("getSCGEventsAndDecks");

}

getSCGEventsAndDecksHTTPRequest = ({endDate, startDate, event, start_num})=>{
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
                        var FormatTypeQuery = Formats.findOne({names : {$regex : format, $options : "i"}}, {limit : 1});



                        Events.update({EventsTypes_id : EventsTypeQuery._id, date : date, location : location, Formats_id : FormatTypeQuery._id, state : "SCGCreated"},
                            {
                                $setOnInsert : {EventsTypes_id : EventsTypeQuery._id, date : date, location : location, Formats_id : FormatTypeQuery._id, state : "SCGCreated"}
                            },
                            {
                                upsert : true
                            })
                        var eventQuery = Events.findOne({EventsTypes_id : EventsTypeQuery._id, date : date, location : {$regex : location, $options : "i"}, Formats_id : FormatTypeQuery._id})
                        DecksData.update({EventsTypes_id : EventsTypeQuery._id, player : player, Events_id : eventQuery._id, date : date, Formats_id : FormatTypeQuery._id},
                            {
                                $setOnInsert : {EventsTypes_id : EventsTypeQuery._id, player : player, Events_id : eventQuery._id, date : date, position : position, Formats_id : FormatTypeQuery._id, state : "SCGCreated", deckUrl : deckUrl}
                            },
                            {
                                upsert : true
                            }
                        )
                    }
                }

                for(var i = 100 + start_num; i < qty; i += 100){
                    webScrapingQueue.add({func : getSCGEventsAndDecksHTTPRequest, args :{endDate : endDate, startDate: startDate, event : event, start_num : i}, wait : httpRequestTime});
                }
            }
        }
    });
}


getSCGDecksCards = ()=>{
    logFunctionsStart("decksDownloadDecks");
    var DecksDataQuery = DecksData.find({state : "SCGCreated"}).fetch();

    for(var i = 0 ; i < DecksDataQuery.length; i++){
        webScrapingQueue.add({func : getSCGDecksCardsHTTPRequest, args : {deckData : DecksDataQuery[i]}, wait : httpRequestTime });
    }
    webScrapingQueue.add({func : getSCGDecksQTY, args : {}, wait : httpRequestTime });
    logFunctionsEnd("decksDownloadDecks");
}

getSCGDecksCardsHTTPRequest = ({deckData})=>{
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
                    $set : {main : main, sideboard : sideboard, state : "scraped"}
                })
        }
    });
}

getSCGDecksQTY = ()=>{
    logFunctionsStart("getSCGDecksQTY");
    var eventsTypes = EventsTypes.find({venue : "SCG"}).map(type => type._id);
    var events = Events.find({EventsTypes_id : {$in : eventsTypes}, state : {$ne : "decks"}}).fetch();
    for(var i = 0; i < events.length; i++){
        var decksQty = DecksData.find({Events_id : events[i]._id}).count();

        Events.update({_id : events[i]._id },
            {
                $set : {decksQty : decksQty, state : "decks"}
            })
    }
    logFunctionsEnd("getSCGDecksQTY");
}