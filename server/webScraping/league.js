import cheerio from "cheerio";

eventLeagueGetInfoOldStartNew = function({format, days, dateType}){
    if(format == null || days == null){
        console.log("format null or days");
        return;
    }
    if(leagueTypes.hasOwnProperty(format)==false){
        console.log("format doesn't exists");
        return;
    }

    var type = "";

    if(format == 'vintage'){
        type = "daily";
    }else{
        type = "league";
    }
    var eventType = EventsTypes.findOne({names : {$regex : type, $options : "i"}});

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
        var url = "http://magic.wizards.com/en/articles/archive/mtgo-standings/" + leagueTypes[format] + "-" + year + "-" + month + "-" + day;
        if(Events.find({type : type, date : date, format : format}, {limit : 1}).count()){
            return;
        }
        webScrapingQueue.add({func : eventLeagueGetInfoOldStartNewHTTP, args : {date : date, format : format, url : url, eventType : eventType}, wait : 10000});
        date = new Date(date.setDate(date.getDate() - 1));
    }
}

eventLeagueGetInfoOldStartNewHTTP = ({date, format, url, eventType})=>{
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
                            state : "Decks"
                        }
                    },
                    {upsert : true}
                );

                var eventQuery = Events.findOne({EventsTypes_id : eventType._id, date : date, format : format});
                for(var i = 0 ; i < decks.length; i++){
                    var information = getDeckInfo($(decks[i]).find('h4').html());
                    var data = {
                        Events_id : eventQuery._id,
                        date : eventQuery.date,
                        EventsType : eventQuery.EventsTypes_id,
                        player : information.player,
                        format : eventQuery.format,
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


getDeckInfo = function(information){
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