import cheerio from "cheerio";
import Moment from "moment";

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
    webScrapingQueue.add({func : getSCGEventsAndDecksConfirmation, args : {}, wait : 0});

    logFunctionsEnd("getSCGEventsAndDecks");
}

getSCGEventsAndDecksConfirmation = ()=>{
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    DailyProcessConfirmation.update({date : date},
        {
            $set : {getSCGEventsAndDecks : true}
        },
        {
            upsert : 1
        })
}

getSCGEventsAndDecksHTTPRequest = ({endDate, startDate, event, start_num})=>{
    var url = `http://sales.starcitygames.com/deckdatabase/deckshow.php?&event_ID=${event.id}&start_date=${startDate}&end_date=${endDate}&start_num=${start_num}&limit=100`;

    console.log(url);
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

                        Events.update({EventsTypes_id : EventsTypeQuery._id, date : date, location : location, Formats_id : FormatTypeQuery._id},
                            {
                                $setOnInsert : {EventsTypes_id : EventsTypeQuery._id, date : date, location : location, Formats_id : FormatTypeQuery._id, state : "SCGCreated"}
                            },
                            {
                                upsert : true
                            })
                        var eventQuery = Events.findOne({EventsTypes_id : EventsTypeQuery._id, date : date, location : {$regex : location, $options : "i"}, Formats_id : FormatTypeQuery._id})

                        DecksData.update({EventsTypes_id : EventsTypeQuery._id, player : player, Events_id : eventQuery._id, date : date, Formats_id : FormatTypeQuery._id},
                            {
                                $setOnInsert : {EventsTypes_id : EventsTypeQuery._id, player : player, Events_id : eventQuery._id, date : date, Formats_id : FormatTypeQuery._id, position : position, state : "SCGCreated", deckUrl : deckUrl}
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
    webScrapingQueue.add({func : getSCGDecksCardsConfirmation, args : {}, wait : httpRequestTime });
    logFunctionsEnd("decksDownloadDecks");
}

getSCGDecksCardsConfirmation = ()=>{
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    DailyProcessConfirmation.update({date},
        {
            $set : {getSCGDecksCards : true}
        },
        {
            upsert : 1
        })
}

getSCGDecksCardsHTTPRequest = ({deckData})=>{
    Meteor.http.get(deckData.deckUrl, {},(err, response)=>{
        if (response.statusCode == 200) {
            var $decksBlocks = cheerio.load(response.content, {decodeEntities : false});

            var cardPattern = /(\d+) (.*)/i;

            var data = {main : [], sideboard : [], state : "scraped"};
            var fieldOptions = [
                {key : "main", css : ".decklist_heading+ ul li"},
                {key : "sideboard", css : ".deck_sideboard li"},
            ]
            for(var i = 0; i < fieldOptions.length; i++){
                var cardsExtracted = $decksBlocks(fieldOptions[i].css);
                var cardsFixed = [];
                for(var j = 0; j < cardsExtracted.length; j++){
                        var regexResult = $decksBlocks(cardsExtracted[j]).text().match(cardPattern);
                        var qty = parseInt(regexResult[1]);
                        var cardName = fixCards(regexResult[2]);
                        cardsFixed.push({ name : cardName, qty : qty });
                }
                data[fieldOptions[i].key] = cardsFixed;
            }
            DecksData.update({_id : deckData._id},
                {
                    $set : data
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

getFindEqualsEvents = ()=>{
    logFunctionsStart("getFindEqualsEvents");

    var SCGEventsProblems = Events.aggregate({
            $group : {
                _id : {
                    EventsTypes_id : "$EventsTypes_id",
                    date : "$date",
                    location : "$location",
                    Formats_id : "$Formats_id",
                    state : "$state"
                },
               qty : {$sum : 1},
               _ids : {$addToSet : "$id"}
            },
            $match : {
                qty : {$gte : 2}
            }
    });

    if(SCGEventsProblems.length){
        Errors.insert({type : "Equal Events", description : SCGEventsProblems})
    }

    logFunctionsEnd("getFindEqualsEvents");
}