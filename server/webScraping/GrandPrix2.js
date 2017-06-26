import cheerio from "cheerio";
import Moment from "moment";
import Entities from "entities";
import Fuse from "fuse.js";


var monthValues = { jan : 0, january : 0, feb : 1, february : 1, mar : 2, march : 2, apr : 3, april : 3, may : 4, jun : 5, june : 5,
    jul : 6, july : 6, aug : 7, august : 7, sep : 8, september : 8, oct : 9, october : 9, nov : 10, november : 10, dec : 11, december : 11
}

var eventsGP = [
    {
        ready : true,
        url : "http://magic.wizards.com/en/events/coverage/gpams17",
        date : Moment("06/03/2017", "MM/DD/YYYY").toDate(),
        location : "Amsterdam",
        Formats_id : "sta",
        EventsTypes_id : "MTGGP",
        links : [
            {
                min : 1,
                max : 8,
                url : "http://magic.wizards.com/en/events/coverage/gpams17/top-8-decklists-grand-prix-amsterdam-2017-06-04",
                order : false
            },
            {
                min : 9,
                max : 32,
                url : "http://magic.wizards.com/en/events/coverage/gpams17/9th-32nd-decklists-2017-06-04",
                order : true
            }
        ]
    },
    {
        ready : true,
        url : "http://magic.wizards.com/en/events/coverage/gpoma17",
        date : Moment("06/03/2017", "MM/DD/YYYY").toDate(),
        location : "Omaha",
        Formats_id : "sta",
        EventsTypes_id : "MTGGP",
        links : [
            {
                min : 1,
                max : 8,
                url : "http://magic.wizards.com/en/events/coverage/gpoma17/top-8-decklists-2017-06-04",
                order : false
            }
        ]
    },
    {
        ready : true,
        url : "http://magic.wizards.com/en/events/coverage/gpoma17",
        date : Moment("06/03/2017", "MM/DD/YYYY").toDate(),
        location : "Omaha",
        Formats_id : "sta",
        EventsTypes_id : "MTGPT",
        links : [
            {
                min : 24,
                max : 27,
                url : "http://magic.wizards.com/en/events/coverage/ptakh/24-27-point-standard-decklists-2017-05-14",
                order : false
            },
            {
                min : 21,
                max : 23,
                url : "http://magic.wizards.com/en/events/coverage/ptakh/21-23-point-standard-decklists-2017-05-14",
                order : false
            },
            {
                min : 18,
                max : 20,
                url : "http://magic.wizards.com/en/events/coverage/ptakh/18-20-point-standard-decklists-2017-05-14",
                order : false
            }
        ]
    }
]

//Download Events And Decks
getGpEventsAndDecks2 = ()=>{
    logFunctionsStart("getGpEventsAndDecks2");
            for(var i =0; i < eventsGP.length; i++) {
                Events.update({location : eventsGP[i].location, date : eventsGP[i].date},
                    {
                        $setOnInsert : Object.assign(eventsGP[i], {state : "created"})
                    },
                    {
                        upsert : true
                    })
                var eventQuery = Events.findOne({location : eventsGP[i].location, date : eventsGP[i].date});


                if(eventQuery.state != "created"){
                    continue;
                };

                if(eventsGP[i].ready) {
                    console.log("ready");
                    for(var j = 0; j < eventsGP[i].links.length; j++) {
                        webScrapingQueue.add({func : getGPDecksHTTPRequest2, args : {event : eventQuery, link : eventsGP[i].links[j]}, wait : httpRequestTime})
                    }
                }
        }
}

getGPDecksHTTPRequest2 = ({event, link})=>{
    logFunctionsStart("getGPDecks");
    Meteor.http.get(link.url, (err, response)=> {
        if(response.statusCode == 200) {
            var $DecksPages = cheerio.load(response.content);
            var decks = $DecksPages('.bean--wiz-content-deck-list');
            var position = link.min;
            for (var i = 0; i < decks.length; i++) {
                var information = Entities.decodeHTML($DecksPages(decks[i]).find('.deck-meta').text());
                var namesRegex = /(\w.+)'s?|(\b.+?\b), (\b.+?\b)/i;

                var informationMatch = information.match(namesRegex);

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
                })


                if(link.order){
                    Object.assign(data, {position : position + i, state : "scraped"})
                }else{
                    Object.assign(data, {position : `${link.min}-${link.max}`, state : "missingPosition"})
                }
                DecksData.insert(data);
            }

            Events.update({_id : event._id},
                {
                    $set : {state : "position"}
                })
        }
    })
}