import cheerio from "cheerio";
import Moment from "moment";
import Entities from "entities";
import Fuse from "fuse.js";


var monthValues = { jan : 0, january : 0, feb : 1, february : 1, mar : 2, march : 2, apr : 3, april : 3, may : 4, jun : 5, june : 5,
                        jul : 6, july : 6, aug : 7, august : 7, sep : 8, september : 8, oct : 9, october : 9, nov : 10, november : 10, dec : 11, december : 11
                    }

//Download Events And Decks
getGpEventsAndDecks = ()=>{
    logFunctionsStart("getGpEventsProTourNew");
    Meteor.http.get("http://magic.wizards.com/en/events/coverage", (err, response)=>{
        if(response.statusCode == 200) {
            var $GPsPage = cheerio.load(response.content);
            var gpsLink = $GPsPage('#2016-2017-season h4:contains(Grand Prix) + p a');
            for(var i = 1; i < gpsLink.length; i++) {
                var info = `${$GPsPage(gpsLink[i]).text()}${$GPsPage(gpsLink[i])[0].nextSibling.nodeValue}`;
                var linkRegex = /(.+) \(:?(\w+) (\d+).*?(\d+)\) - .*(Standard|Modern|Legacy)/i;
                var infoMatch = info.match(linkRegex);
                if(infoMatch){
                    var eventType = EventsTypes.findOne({names : "GP"});
                    var month = monthValues[infoMatch[2].toLowerCase()];
                    var date = Moment(`${month}/${infoMatch[3]}/${infoMatch[4]}`, "M/DD/YYYY").toDate();
                    var url = $GPsPage(gpsLink[i]).attr("href");
                    var completedURL = `http://magic.wizards.com${url}`;

                    var formatQuery = Formats.findOne({names : {$regex : infoMatch[5], $options : "i"}})

                    Events.update({url : completedURL},
                        {
                            $setOnInsert : { date : date, EventsTypes_id: eventType._id,Formats_id : formatQuery._id, state : 'created', url : completedURL}
                        },
                        {
                            upsert : true
                        })
                    var eventQuery = Events.findOne({url : completedURL});
                    if(eventQuery.state != "created"){
                        continue;
                    };
                    webScrapingQueue.add({func : getGpEventsAndDecksHTTPRequest, args : {event : eventQuery}, wait : httpRequestTime})
                }
            }
        }
    });
}

getGpEventsAndDecksHTTPRequest = ({event})=>{
    logFunctionsStart("getGpEventsAndDecksHTTPRequest");
    Meteor.http.get(event.url, (err, response)=>{
        if(response.statusCode == 200) {
            var $GPPage = cheerio.load(response.content);
            var finalStanding = $GPPage(".final a");
            if(finalStanding.length){
                Events.update({ _id : event._id},
                    {
                        $set : {state : 'finalStanding', finalStanding_url : `${$GPPage(finalStanding).attr("href")}`}
                    },
                    {
                        upsert : true
                    })

                var links = $GPPage("#content a");
                var linksMatch = [];
                for(var i = 0; i < links.length; i++){
                    linksMatch.push(`http://magic.wizards.com${$GPPage(links[i]).attr("href")}`);
                }
                var filterLinks = linksMatch.filter((link)=>{
                    return link.match(/top-8-decks|decklist|finishers/i);
                }).filter(function(link) {
                    return !link.match(/undefeated|trial|-0-/i);
                }).filter(function(elem, index, self) {
                    return index == self.indexOf(elem);
                })

                DecksData.remove({Events_id : event._id});
                for(var i = 0; i < filterLinks.length; i++){
                    webScrapingQueue.add({func : getGPDecksHTTPRequest, args : {url : filterLinks[i], event : event}, wait : httpRequestTime})
                }
            }
        }
    });
}

getGPDecksHTTPRequest = ({url, event})=>{
    logFunctionsStart("getGPDecks");
    Meteor.http.get(url, (err, response)=> {
        if(response.statusCode == 200) {
            var $DecksPages = cheerio.load(response.content);
            var decks = $DecksPages('.bean--wiz-content-deck-list');
            for (var i = 0; i < decks.length; i++) {
                var information = Entities.decodeHTML($DecksPages(decks[i]).find('.deck-meta').text());
                var namesRegex = /(\w.+)'s?|(\b.+?\b), (\b.+?\b)/i;
                var positionRegex = /(\d+?)(?:st|nd|th)/i;

                var informationMatch = information.match(namesRegex);
                var position = information.match(positionRegex);

                var player = information;
                if(informationMatch){
                    if (informationMatch[1]) {
                        player = informationMatch[1];
                    } else {
                        player = `${informationMatch[3]} ${informationMatch[2]}`;
                    }
                }else{
                    Errors.insert({Events_id : event._id, type : "no regex match", id : player, description : information})
                }

                var data = {};
                var fieldOptions = [
                    {key : "main", css : ".sorted-by-overview-container .row"},
                    {key : "sideboard", css : ".sorted-by-sideboard-container .row"},
                ]

                for(var j = 0; j < fieldOptions.length; j++){
                    var cardsExtracted = $DecksPages(decks[i]).find(fieldOptions[j].css);
                    var cardsFixed = [];
                    for(var k = 0; k < cardsExtracted.length; k++){
                        var qty = parseInt($DecksPages(cardsExtracted[k]).find('.card-count').text());
                        var name = $DecksPages(cardsExtracted[k]).find('.card-name').text();
                        name = fixCards(name);
                        cardsFixed.push({name : name, qty : qty });
                    }
                    data[fieldOptions[j].key] = cardsFixed;
                }

                Object.assign(data, {
                    Events_id : event._id,
                    date : event.date,
                    EventsTypes_id : event.EventsTypes_id,
                    player : player,
                    Formats_id : event.Formats_id,
                    state : "pending"
                })


                if(position){
                    Object.assign(data, {position : parseInt(position[1])})
                }
                DecksData.insert(data);
            }
        }
    })
}

//Give Position to missing Decks

getGPPosition = ()=> {
    var events = Events.find({EventsTypes_id: {$in : ["MTGGP", "MTGPT"]}, state : "finalStanding"}).fetch();
    for (var i = 0; i < events.length; i++) {
        webScrapingQueue.add({func : getGPPositionHTTPRequest, args:{event : events[i]}, wait : httpRequestTime})
    }
}

getGPPositionHTTPRequest = ({event})=>{
    Meteor.http.get(event.finalStanding_url, (err, response) => {
        if (response.statusCode == 200) {
            var $RankingPage = cheerio.load(response.content);
            var players = $RankingPage("tbody tr");


            var allDecksData = DecksData.find({Events_id : event._id, position : {$exists : false}}, {fields : {player : 1}}).fetch();
            var options = {
                keys : ["player"],
                id : "player",
                threshold: 0.6,
                maxPatternLength: 100,
                tokenize: true,
            }



            var fuse = new Fuse(allDecksData, options);
            for (var i = 1; i < players.length; i++) {
                if(i > 64){ break; }
                var regex = /(\w.+?), (\w.+) \[/i;
                $RankingPage(players[i]).find("td:nth-child(1)").text();
                var regexMatch = $RankingPage(players[i]).find("td:nth-child(2)").text().match(regex)
                if(regexMatch){

                    var rightName = fuse.search(escapeRegExp(`${regexMatch[2]} ${regexMatch[1]}`));
                    var position = parseInt($RankingPage(players[i]).find("td:nth-child(1)").text());
                    if(isNaN(position)){
                        position = 1000 + i;
                        Errors.insert({Events_id : event._id, type : "no regex position match", id : position, description : $RankingPage(players[i]).find("td:nth-child(1)").text()})
                    }
                    if(rightName[0]){
                        DecksData.update({Events_id : event._id, player : rightName[0], position : {$exists : false}},
                            {
                                $set : { position : position}
                            })
                    }
                    if(rightName[1]){
                        DecksData.update({Events_id : event._id, player : rightName[1], position : {$exists : false}},
                            {
                                $set : { position : position}
                            })
                    }
                }else{
                    Errors.insert({Events_id : event._id, type : "name regex didn't match", id : i, description : $RankingPage(players[i]).find("td:nth-child(1)").text()})
                }
            }
            var decksDataWithoutId = DecksData.find({Events_id : event._id, position : {$exists : false}}).map(deckData => deckData._id);

            if(decksDataWithoutId.length){
                Errors.insert({Events_id : event._id, type : "missing position", id : decksDataWithoutId, description : ""})
            }

            var decksQty = DecksData.find({Events_id : event._id}).count();

            Events.update({_id : event._id},
                {
                    $set : {state : "pending", decksQty : decksQty}
                })
        }
    })
}