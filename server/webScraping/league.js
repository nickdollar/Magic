import cheerio from "cheerio";

getLeagueEventsAndDecks = function({Formats_id, days, dateType}){
    if(Formats_id == null || days == null){
        console.log("Formats_id null or days");
        return;
    }

    if(leagueTypes.hasOwnProperty(Formats_id)==false){
        console.log("Formats_id doesn't exists");
        return;
    }

    var type = "";

    if(Formats_id == 'vnt'){
        type = "daily";
    }else{
        type = "league";
    }

    var eventType = EventsTypes.findOne({names : {$regex : type, $options : "i"}});

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
        var url = "http://magic.wizards.com/en/articles/archive/mtgo-standings/" + leagueTypes[Formats_id] + "-" + year + "-" + month + "-" + day;
        if(Events.find({EventsTypes_id : eventType._id, date : actualDay, Formats_id : Formats_id}, {limit : 1}).count()){
            continue;
        }
        webScrapingQueue.add({func : getLeagueEventsAndDecksHTTPRequest, args : {date : actualDay, Formats_id : Formats_id, url : url, eventType : eventType}, wait : httpRequestTime});
    }
}

getLeagueEventsAndDecksHTTPRequest = ({date, Formats_id, url, eventType})=>{
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
                    var information = getDeckInfo($(decks[i]).find('h4').html());
                    var data = {
                        Events_id : eventQuery._id,
                        date : eventQuery.date,
                        EventsTypes_id : eventQuery.EventsTypes_id,
                        player : information.player,
                        Formats_id : eventQuery.Formats_id,
                        victory : information.score.victory,
                        loss : information.score.loss,
                        draw : information.score.draw
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

                var decksQty = DecksData.find({Events_id : eventQuery._id}).count();
                Events.update({_id : eventQuery._id},
                    {$set : {decksQty : decksQty}}
                )
            }

        }
    });
}


var leagueTypes = {
    mod : "competitive-modern-constructed-league",
    std : "competitive-standard-constructed-league",
    pau : "pauper-constructed-league",
    leg : "competitive-legacy-constructed-league",
    vnt : "vintage-daily",
}


getDeckInfo = (information)=>{
    var scorePatt = /([0-9]{1,2}-){1,3}[0-9]{1,2}/;
    var playerPatt = /^(.*?) \(/;
    var digitPatt = /\d+/g;
    var temp = {};
    var score = information.match(scorePatt)[0];
    var results = score.match(digitPatt);
    temp.player = information.match(playerPatt)[1];

    if(results.length==2){
        temp.score = {victory : parseInt(results[0]), loss : parseInt(results[1]), draw : 0}
    }else if(results.length==3){
        temp.score = {victory : parseInt(results[0]), draw : parseInt(results[1]), loss : parseInt(results[2])}
    }
    return temp;
}