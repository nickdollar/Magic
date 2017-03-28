import cheerio from "cheerio";
import Moment from "moment";
import Entities from "entities";
import Fuse from "fuse.js";


var monthValues = { jan : 0, january : 0, feb : 1, february : 1, mar : 2, march : 2, apr : 3, april : 3, may : 4, jun : 5, june : 5,
                        jul : 6, july : 6, aug : 7, august : 7, sep : 8, september : 8, oct : 9, october : 9, nov : 10, november : 10, dec : 11, december : 11
                    }

getGpEventsProTourNew = ()=>{
    console.log("START: getGpEventsProTourNew");
    Meteor.http.get("http://magic.wizards.com/en/events/coverage", (err, response)=>{
        if(response.statusCode == 200) {
            var $GPsPage = cheerio.load(response.content);
            var gpsLink = $GPsPage('#2016-2017-season h4:contains(Grand Prix) + p a');
            var events = [];
            for (var i = 1; i < gpsLink.length; i++) {
                var info = `${$GPsPage(gpsLink[i]).text()}${$GPsPage(gpsLink[i])[0].nextSibling.nodeValue}`;
                var linkRegex = /(.+) \(:?(\w+) (\d+).*?(\d+)\) - .*(Standard|Modern|Legacy)/i;
                var infoMatch = info.match(linkRegex);
                if(infoMatch){
                    console.log(infoMatch);
                    var eventType = EventsTypes.findOne({names : "GP"});
                    var month = monthValues[infoMatch[2].toLowerCase()];
                    var date = Moment(`${month}/${infoMatch[3]}/${infoMatch[4]}`, "M/DD/YYYY").toDate();
                    var url = $GPsPage(gpsLink[i]).attr("href");
                    var completedURL = `http://magic.wizards.com${url}`;

                    Events.update({  date : date, EventsTypes_id: eventType._id, format : infoMatch[5].toLowerCase(), url : completedURL},
                        {
                            $setOnInsert : { date : date, EventsTypes_id: eventType._id,format : infoMatch[5].toLowerCase(), state : 'created', url : completedURL}
                        },
                        {
                            upsert : true
                        })

                    var event = Events.findOne({date : date, EventsTypes_id: eventType._id, format : infoMatch[5].toLowerCase(), url : completedURL});

                    console.log(event);
                    if(event.state != "created"){
                        continue;
                    };

                    webScrapingQueue.add({func : getGpEventsProTourNewEachEvent, args : {event : event}, wait : 3000})
                }
            }
        }
    });
}

getGpEventsProTourNewEachEvent = ({event})=>{
    console.log("START: getGpEventsProTourNewEachEvent");
    Meteor.http.get(event.url, (err, response)=>{
        if(response.statusCode == 200) {
            var $GPPage = cheerio.load(response.content);
            var finalStanding = $GPPage(".final a");
            if(finalStanding.length){

                Events.update({ _id : event._id},
                    {
                        $set : {state : 'finalStanding'}
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
                for(var i = 0; i < filterLinks.length; i++){
                    webScrapingQueue.add({func : getGPDecks, args : {url : filterLinks[i], event : event}, wait : 10000})
                }
            }
        }
    });
}

GPGetPosition = ()=> {
    var eventType = EventsTypes.find({names: {$regex: "GP", $options: "i"}}).fetch()[0];
    var events = Events.find({EventsTypes_id: eventType._id}).fetch();
    for (var i = 0; i < events.length; i++) {
        webScrapingQueue.add({func : getPositionHTTP, args:{event : events[i]}, wait : 1000})
    }
}

getPositionHTTP = ({event})=>{
    Meteor.http.get(event.finalStanding_url, (err, response) => {
        if (response.statusCode == 200) {
            var $RankingPage = cheerio.load(response.content);
            var players = $RankingPage("tbody tr");


            var allDecksData = DecksData.find({Events_id : event._id, position : {$exists : false}}, {fields : {player : 1}}).fetch();
            var options = {
                keys : ["player"],
                id : "player"
            }
            var fuse = new Fuse(allDecksData, options);
            for (var i = 1; i < players.length; i++) {
                if(i > 64){
                    break;
                }
                var regex = /(\w.+?), (\w.+) \[/i;
                $RankingPage(players[i]).find("td:nth-child(1)").text();
                var regexMatch = $RankingPage(players[i]).find("td:nth-child(2)").text().match(regex)
                var rightName = fuse.search(`${regexMatch[2]} ${regexMatch[1]}`);
                var position = parseInt($RankingPage(players[i]).find("td:nth-child(1)").text());
                if(isNaN(position)){
                    position = 1000
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

                DecksData.update({Events_id : event._id, player : rightName[1], position : {$exists : false}},
                    {
                        $set : { position : 999}
                    })
            }
        }

        Events.update(event,
            {
                $set : {state : "decks"}
            })
    })
}

getGPDecks = ({url, event})=>{

    console.log("START: getGPDecks");
    Meteor.http.get(url, (err, response)=> {
        if(response.statusCode == 200) {
            var $DecksPages = cheerio.load(response.content);
            var decks = $DecksPages('.bean--wiz-content-deck-list');
            DecksData.remove({Events_id : event._id});
            for (var i = 0; i < decks.length; i++) {
                var information = Entities.decodeHTML($DecksPages(decks[i]).find('.deck-meta').text());
                var namesRegex = /(\w.+)'s?|(\b.+?\b), (\b.+?\b)/i;
                var positionRegex = /(\d+?)(?:st|nd|th)/i;

                var informationMatch = information.match(namesRegex);
                var position = information.match(positionRegex);

                var player = null;
                if (informationMatch[1]) {
                    player = informationMatch[1];
                } else {
                    player = `${informationMatch[3]} ${informationMatch[2]}`;
                }

                var main = [];
                var sideboard = [];
                var mainCards = $DecksPages(decks[i]).find('.sorted-by-overview-container .row');

                for(var j = 0; j < mainCards.length; j++){
                    var quantity = parseInt($DecksPages(mainCards[j]).find('.card-count').text());
                    var name = $DecksPages(mainCards[j]).find('.card-name').text();
                    name = fixCards(name);
                    main.push({name : name, quantity : quantity});
                }

                var sideboardCards = $DecksPages(decks[i]).find('.sorted-by-sideboard-container .row');
                for(j = 0; j < sideboardCards.length; j++){
                    var quantity = parseInt($DecksPages(sideboardCards[j]).find('.card-count').text());
                    var name = $DecksPages(sideboardCards[j]).find('.card-name').text();
                    name = fixCards(name);
                    sideboard.push({name : name, quantity : quantity});
                }

                var data = {
                    Events_id : event._id,
                    date : event.date,
                    EventsTypes_id : event.EventsTypes_id,
                    player : player,
                    format : event.format,
                    main : main,
                    sideboard : sideboard,
                    state : "scraped"
                }

                if(position){
                    data = Object.assign(data, {position : parseInt(position[1])})
                }

                DecksData.insert(data);
            }
        }
    })
}