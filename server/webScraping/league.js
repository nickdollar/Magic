import cheerio from "cheerio";



eventLeagueGetInfoOld = function(format, days){
    if(format == null){
        console.log("format null");
        return;
    }
    if(days == null){
        console.log("days null");
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

    var event = Events.findOne({format : format, type : type}, {sort : {date : 1}, limit : 1});

    var date = null;
    if(event==null){
        date = new Date();
    }else{
        date = new Date(event.date);
        date.setDate(date.getDate() - 1);

    }
    date.setHours(0,0,0,0);

    for(var i = 0; i < days ; i++){
        var day = pad(date.getDate());
        var month = pad(date.getMonth()+1);
        var year = date.getYear() + 1900;
        var url = "http://magic.wizards.com/en/articles/archive/mtgo-standings/" + leagueTypes[format] + "-" + year + "-" + month + "-" + day;
        var res = Meteor.http.get(url);

        Events.update(
            {type : type, date : date, format : format},
            {
                $setOnInsert : {
                    date: date,
                    format : format,
                    name : leagueTypes[format],
                    type: type,
                    url : url,
                    state : "startProduction",
                    venue : "mtgo"

                }
            },
            {upsert : true}
        );

        if (res.statusCode == 200) {
            var buffer = res.content;
            var $ = cheerio.load(buffer);
            var deckMeta = $('#main-content');
            var state = "notFound";
            if(deckMeta.length == 0){
                console.log("Page Doesn't exists");
            }else{
                console.log("page exists");
                state = "exists";
            }

            Events.update(
                {type : type, date : date, format : format},
                {
                    $set : {
                        state : state
                    }
                }
            );
        }

        date = new Date(date.setDate(date.getDate() - 1));
    }
}

eventLeagueGetNewEvents = function(format){
    if(format == null){
        console.log("format null");
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

    var event = Events.findOne({type : type}, {sort : {date : -1}, limit : 1});
    var date = null;
    if(event==null){
        date = new Date();
    }else{
        date = new Date(event.date);
        date.setDate(date.getDate() + 1);
    }

    date.setHours(0,0,0,0);

    while(new Date().getTime() > date.getTime()){
        var day = pad(date.getDate());
        var month = pad(date.getMonth()+1);
        var year = date.getYear() + 1900;
        var url = "http://magic.wizards.com/en/articles/archive/mtgo-standings/" + leagueTypes[format] + "-" + year + "-" + month + "-" + day;
        var res = Meteor.http.get(url);

        Events.update(
            {type : type, date : date, format : format},
            {
                $setOnInsert : {
                    date: date,
                    format : format,
                    name : leagueTypes[format],
                    type: type,
                    url : url
                }
            },
            {upsert : true}
        );

        if (res.statusCode == 200) {
            var buffer = res.content;
            var $ = cheerio.load(buffer);
            var deckMeta = $('#main-content');
            var state = "pre";
            if(deckMeta.length == 0){
                console.log("Page Doesn't exists");
            }else{
                state = "exist";
            }
                console.log("page exists");
            }
            Events.update(
                {type : type, date : date, format : format},
                {
                    $set : {
                        "state" : state
                    }
                }
            );
            date = new Date(date.setDate(date.getDate() + 1));
        }
}

notFoundEvent = function(Event_id){
    console.log("START: notFoundEvent");
    var eventNotFound = Events.findOne({_id : Event_id, state : "notFound"});

    if(!eventNotFound){return};
    var res = Meteor.http.get(eventNotFound.url);

    if (res.statusCode == 200) {
        var buffer = res.content;
        var $ = cheerio.load(buffer);
        var deckMeta = $('#main-content');
        if(deckMeta.length == 0){
            console.log("Page Doesn't exists");
        }else{
            console.log("page exists");
            Events.update(
                {_id : eventNotFound._id},
                {
                    $set : {

                        state : "exists"
                    }
                }
            );
        }


    }else{
        var days = 10*24*60*60*1000;
        if((new Date) - Events.findOne({_id : "RaXQGbAdNHkHSC7dj"}).date > days){
            Events.update(
                {_id : Event_id},
                {
                    $set : {
                        state : "notFoundOld"
                    }
                }
            );
        }
    }

    console.log("END: notFoundEvent");
}

eventLeagueDailyDownloadHTML = function(_id){
    console.log("START: eventLeagueDailyDownloadHTML");
    var event = Events.findOne({_id : _id, state : {$in : ["exists", "HTMLFail"]}});

    if(event == null) {
        return;
    }

    var res = Meteor.http.get(event.url);


    if (res.statusCode == 200) {
        var buffer = res.content;
        var $ = cheerio.load(buffer);
        var deckMeta = $('#main-content');
        if(deckMeta.length == 0){
            console.log("Events not found");
            Events.update(
                {_id : _id},
                {
                    $set : {
                        state : "HTMLFail"
                    }
                }
            );
        }else{
            EventsHtmls.update(
                {Events_id : _id},
                {
                    $set : {
                        html : $(deckMeta).html(),
                    }
                },
                {upsert : true}
            );

            Events.update(
                {_id : _id},
                {
                    $set : {
                        state : "HTML"
                    }
                }
            );
        }
    }
    console.log("END: eventLeagueDailyDownloadHTML");
};

eventLeagueDailyExtractDecks = function(_id){
    var event = Events.findOne({_id : _id, state : "HTML"});

    if(event == null) return;
    DecksData.remove({Events_id : event._id});

    var eventHtml = EventsHtmls.findOne({Events_id : _id});
    var $ = cheerio.load(eventHtml.html);
    var decks = $('.bean--wiz-content-deck-list');

    for(var i = 0 ; i < decks.length; i++){
        var information = getDeckInfo($(decks[i]).find('h4').html());
        var data = {
            Events_id : event._id,
            date : event.date,
            type : event.type,
            player : information.player,
            format : event.format,
            victory : information.score.victory,
            loss : information.score.loss,
            draw : information.score.draw
        };

        var mainCards = $(decks[i]).find('.sorted-by-overview-container .row');
        var main = [];
        var totalMain = 0;
        for(var j = 0; j < mainCards.length; j++){
            var quantity = parseInt($(mainCards[j]).find('.card-count').text());
            totalMain += quantity;
            var name = $(mainCards[j]).find('.card-name').text();
            name = fixCards(name);
            if(CardsData.find({ name : name}).count()){
                main.push(
                    {
                        name : name,
                        quantity : quantity
                    }
                );
            }else{
                main.push(
                    {
                        name : name,
                        quantity : quantity,
                        wrongName : true
                    }
                );
            }
        }

        var sideboardCards = $(decks[i]).find('.sorted-by-sideboard-container .row');
        var totalSideboard = 0;
        var sideboard = [];
        for(j = 0; j < sideboardCards.length; j++){
            var quantity = parseInt($(sideboardCards[j]).find('.card-count').text());
            totalSideboard += quantity;
            var name = $(sideboardCards[j]).find('.card-name').text();
            name = fixCards(name);
            if(CardsData.find({ name : name}).count()){
                sideboard.push(
                    {
                        name : name,
                        quantity : quantity
                    }
                );
            }else{
                sideboard.push(
                    {
                        name : name,
                        quantity : quantity,
                        wrongName : true
                    }
                );
            }
        }


        data.totalMain = totalMain;
        data.main = main;
        data.totalSideboard = totalSideboard;
        data.sideboard = sideboard;
        data.colors = setUpColorForDeckName(main);
        data.state = "scraped";
        DecksData.insert(data);
    }

    Events.update(
        {_id : event._id},
        {
            $set : {
                state : "decks",
                decks : decks.length
            }
        }
    );
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
    console.log(temp);
    return temp;
}