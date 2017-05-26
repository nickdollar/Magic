import cheerio from "cheerio";

var mtgoPtqTypes = {
    sta : "standard-ptq",
    mod : "modern-ptq",
    pau : "pauper-ptq",
    vin : "vintage-ptq",
    leg : "legacy-ptq"
}

getMTGOPTQEventsAndDecks = function({Formats_id, days, dateType}){
    logFunctionsStart("eventMTGOPTQGetInfoOldStartNew");
    if(Formats_id == null || days == null){
        logErrorMessage("format null or days");
        return;
    }
    if(mtgoPtqTypes.hasOwnProperty(Formats_id)==false){
        logErrorMessage("format doesn't exists");
        return;
    }

    var eventType = EventsTypes.findOne({names : {$regex : "MTGOPTQ", $options : "i"}});

    var date = new Date();
    if(dateType=="oldDays"){
        var event = Events.findOne({Formats_id : Formats_id, EventsTypes_id : eventType._id}, {sort : {date : 1}, limit : 1});
        if(event){
            date = new Date(event.date);
            date.setDate(date.getDate() - 1);
        }
    }
    date.setHours(0,0,0,0);
    for(var i = 0; i < days ; i++){
        var actualDay = date.addDays(-i);
        var day = pad(actualDay.getDate());
        var month = pad(actualDay.getMonth()+1);
        var year = actualDay.getYear() + 1900;
        var url = "http://magic.wizards.com/en/articles/archive/mtgo-standings/" + mtgoPtqTypes[Formats_id] + "-" + year + "-" + month + "-" + day;
        if(Events.find({EventsTypes_id : eventType._id, date : actualDay, Formats_id : Formats_id}, {limit : 1}).count()){
            continue;
        }
        webScrapingQueue.add({func : getMTGOPTQEventsAndDecksHTTP, args : {date : actualDay, Formats_id : Formats_id, url : url, eventType : eventType}, wait : httpRequestTime});
    }
}

getMTGOPTQEventsAndDecksHTTP = ({date, Formats_id, url, eventType})=>{
    Meteor.http.get(url, (err, response)=>{
        if (response.statusCode == 200) {
            var $ = cheerio.load(response.content);
            var decks = $('.bean--wiz-content-deck-list');
            if(decks.length){
                Events.update(
                    {EventsTypes_id : eventType._id, date : date, Formats_id : Formats_id},
                    {
                        $setOnInsert : {
                            date: date,
                            Formats_id : Formats_id,
                            EventsTypes_id : eventType._id,
                            url : url,
                            state : "decks"
                        }
                    },
                    {upsert : true}
                );

                var eventQuery = Events.findOne({EventsTypes_id : eventType._id, date : date, Formats_id : Formats_id});
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
                        EventsTypes_id : eventQuery.EventsTypes_id,
                        player : player,
                        Formats_id : eventQuery.Formats_id,
                        position : position,
                    };

                    var mainCards = $(decks[i]).find('.sorted-by-overview-container .row');
                    var main = [];
                    for(var j = 0; j < mainCards.length; j++){
                        var qty = parseInt($(mainCards[j]).find('.card-count').text());
                        var name = $(mainCards[j]).find('.card-name').text();
                        name = fixCards(name);
                        if(Cards.find({ _id : name}, {limit : 1}).count()){
                            main.push(
                                {
                                    name : name,
                                    qty : qty
                                }
                            );
                        }
                    }

                    var sideboardCards = $(decks[i]).find('.sorted-by-sideboard-container .row');
                    var sideboard = [];
                    for(j = 0; j < sideboardCards.length; j++){
                        var qty = parseInt($(sideboardCards[j]).find('.card-count').text());
                        var name = $(sideboardCards[j]).find('.card-name').text();
                        name = fixCards(name);
                        sideboard.push(
                            {
                                name : name,
                                qty : qty
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
