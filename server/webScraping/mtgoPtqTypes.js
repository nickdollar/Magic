import cheerio from "cheerio";

var mtgoPtqTypes = {
    modern : "modern-ptq",
    standard : "standard-ptq",
    pauper : "pauper-ptq",
    vintage : "vintage-ptq",
    legacy : "legacy-ptq"
}

getMTGOPTQEventsAndDecks = function({format, days, dateType}){
    console.log("START: eventMTGOPTQGetInfoOldStartNew");
    if(format == null || days == null){
        console.log("format null or days");
        return;
    }
    if(leagueTypes.hasOwnProperty(format)==false){
        console.log("format doesn't exists");
        return;
    }

    var eventType = EventsTypes.findOne({names : {$regex : "MTGOPTQ", $options : "i"}});

    var date = new Date();
    if(dateType=="oldDays"){
        var event = Events.findOne({format : format, EventsTypes_id : eventType._id}, {sort : {date : 1}, limit : 1});
        if(event){
            date = new Date(event.date);
            date.setDate(date.getDate() - 1);
        }
    }
    date.setHours(0,0,0,0);
    for(var i = 0; i < days ; i++){
        var day = pad(date.getDate());
        var month = pad(date.getMonth()+1);
        var year = date.getYear() + 1900;
        var url = "http://magic.wizards.com/en/articles/archive/mtgo-standings/" + mtgoPtqTypes[format] + "-" + year + "-" + month + "-" + day;
        if(Events.find({EventsTypes_id : eventType._id, date : date, format : format}, {limit : 1}).count()){
            return;
        }
        webScrapingQueue.add({func : getMTGOPTQEventsAndDecksHTTP, args : {date : date, format : format, url : url, eventType : eventType}, wait : httpRequestTime});
        date = new Date(date.setDate(date.getDate() - 1));
    }
}

getMTGOPTQEventsAndDecksHTTP = ({date, format, url, eventType})=>{
    Meteor.http.get(url, (err, response)=>{
        if (response.statusCode == 200) {
            var $ = cheerio.load(response.content);
            var decks = $('.bean--wiz-content-deck-list');
            if(decks.length){
                Events.update(
                    {EventsTypes_id : eventType._id, date : date, format : format},
                    {
                        $setOnInsert : {
                            date: date,
                            format : format,
                            EventsTypes_id : eventType._id,
                            url : url,
                            state : "decks"
                        }
                    },
                    {upsert : true}
                );

                var eventQuery = Events.findOne({EventsTypes_id : eventType._id, date : date, format : format});
                for(var i = 0 ; i < decks.length; i++){
                    var informationRegex = /(.+?)\s+?\((\d+)(?:st|nd|rd|th)/i;
                    var informationMatch = $(decks[i]).find('h4').text().match(informationRegex);
                    var player = "(NULL)";
                    var position = 1000 + i;
                    if(informationMatch){
                        player = informationMatch[1];
                        position = parseInt(informationMatch[2]);
                        if(isNaN(position)){
                            position = 999;
                        }
                    }else{
                        console.log($(decks[i]).find('h4').text());
                    }

                    var data = {
                        Events_id : eventQuery._id,
                        date : eventQuery.date,
                        EventsType : eventQuery.EventsTypes_id,
                        player : player,
                        format : eventQuery.format,
                        position : position,
                    };

                    var mainCards = $(decks[i]).find('.sorted-by-overview-container .row');
                    var main = [];
                    for(var j = 0; j < mainCards.length; j++){
                        var quantity = parseInt($(mainCards[j]).find('.card-count').text());
                        var name = $(mainCards[j]).find('.card-name').text();
                        name = fixCards(name);
                        if(CardsData.find({ name : name}, {limit : 1}).count()){
                            main.push(
                                {
                                    name : name,
                                    quantity : quantity
                                }
                            );
                        }
                    }

                    var sideboardCards = $(decks[i]).find('.sorted-by-sideboard-container .row');
                    var sideboard = [];
                    for(j = 0; j < sideboardCards.length; j++){
                        var quantity = parseInt($(sideboardCards[j]).find('.card-count').text());
                        var name = $(sideboardCards[j]).find('.card-name').text();
                        name = fixCards(name);
                        sideboard.push(
                            {
                                name : name,
                                quantity : quantity
                            }
                        );
                    }
                    data.main = main;
                    data.sideboard = sideboard;
                    data.state = "scraped";
                    DecksData.insert(data);

                }
                var totalDecks = DecksData.find({Events_id : eventQuery._id}).count();

                Events.update({_id : eventQuery._id},
                                {
                                    $set : {decksQty : totalDecks}
                                },
                );
            }

        }
    });
}

var leagueTypes = {
    modern : "competitive-modern-constructed-league",
    standard : "competitive-standard-constructed-league",
    pauper : "pauper-constructed-league",
    legacy : "competitive-legacy-constructed-league",
    vintage : "vintage-daily",
}
