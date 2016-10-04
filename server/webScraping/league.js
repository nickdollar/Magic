import cheerio from "cheerio";

fixAllEvents = function(){
    var decksWithoutHtml = Events.find({$or : [{"validation.htmlDownloaded" : {$exists : false}}, {"validation.htmlDownloaded" : false}]});

    decksWithoutHtml.forEach(function(obj){
        eventLeagueDownloadHTML(obj._id);
    });

    var decksWithoutDecks = Events.find({"validation.htmlDownloaded" : true, $or : [{"validation.extractDecks" : {$exists : false}}, {"validation.extractDecks" : false}]});

    decksWithoutDecks.forEach(function(obj){
        eventLeagueExtractDecks(obj._id);
    });
};


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

    var event = Events.findOne({eventType : "league"}, {sort : {date : 1}, limit : 1});
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
        var res = Meteor.http.get(url)

        Events.update(
            {type : "league", date : date, format : format},
            {
                $setOnInsert : {
                    date: date,
                    format : format,
                    eventName : leagueTypes[format],
                    eventType: "league",
                    url : url
                }
            },
            {upsert : true}
        );

        if (res.statusCode == 200) {
            var buffer = res.content;
            var $ = cheerio.load(buffer);
            var deckMeta = $('#main-content');
            var upsert = false;
            if(deckMeta.length == 0){
                console.log("Page Doesn't exists");
            }else{
                upsert = true;
            }
            console.log("page exists");
        }
        Events.update(
            {eventType : "league", date : date, format : format},
            {
                $set : {
                    "validation.exists" : upsert
                }
            }
        );
        date = new Date(date.setDate(date.getDate() - 1));
    }
}

eventLeagueGetInfoNew = function(format){
    if(format == null){
        console.log("format null");
        return;
    }

    if(leagueTypes.hasOwnProperty(format)==false){
        console.log("format doesn't exists");
        return;
    }


    var event = Events.findOne({eventType : "league"}, {sort : {date : -1}, limit : 1});
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
            {type : "league", date : date, format : format},
            {
                $setOnInsert : {
                    date: date,
                    format : format,
                    eventName : leagueTypes[format],
                    eventType: "league",
                    url : url
                }
            },
            {upsert : true}
        );

        if (res.statusCode == 200) {
            var buffer = res.content;
            var $ = cheerio.load(buffer);
            var deckMeta = $('#main-content');
            var upsert = false;
            if(deckMeta.length == 0){
                console.log("Page Doesn't exists");
            }else{
                upsert = true;
            }
                console.log("page exists");
            }
            Events.update(
                {eventType : "league", date : date, format : format},
                {
                    $set : {
                        "validation.exists" : upsert
                    }
                }
            );
            date = new Date(date.setDate(date.getDate() + 1));
        }
}

eventLeagueDownloadHTML = function(_id){
    var event = Events.findOne({_id : _id, "validation.exists" : true, $or : [{"validation.htmlDownloaded" : {$exists : false}}, {"validation.htmlDownloaded" : false}]});

    if(event == null) {
        return;
    }

    var res = Meteor.http.get(event.url);


    if (res.statusCode == 200) {
        var buffer = res.content;
        var $ = cheerio.load(buffer);
        var deckMeta = $('#main-content');
        if(deckMeta.length == 0){
            console.log("event not found");
            Events.update(
                {type : "league", date : event.date, format : event.format},
                {
                    $set : {
                        "validation.htmlDownloaded" : false
                    }
                }
            );
        }else{
            console.log("event found");
            Events.update(
                {type : "league", date : event.date, format : event.format},
                {
                    $set : {
                        html : $(deckMeta).html(),
                        "validation.htmlDownloaded" : true
                    }
                }
            );
        }
    }
};

eventLeagueExtractDecks = function(_id){
    var event = Events.findOne({_id : _id, "validation.exists" : true, "validation.htmlDownloaded" : true, $or : [{"validation.extractDecks" : {$exists : false}}, {"validation.extractDecks" : false}]});
    if(event == null) return;
    var $ = cheerio.load(event.html);
    var decks = $('.bean--wiz-content-deck-list');

    for(var i = 0 ; i < decks.length; i++){
        var information = getDeckInfo($(decks[i]).find('h4').html());
        var data = {
            Events_id : event._id,
            date : event.date,
            eventType : event.eventType,
            player : information.player,
            format : event.format,
            victory : information.score.victory,
            loss : information.score.loss,
            draw : information.score.draw
        };

        var cards = $(decks[i]).find('.sorted-by-overview-container .row');
        var deckCards = {main : [], sideboard : []};
        var mainDeckQuantity = 0;
        for(var j = 0; j < cards.length; j++){
            var quantity = parseInt($(cards[j]).find('.card-count').text());
            mainDeckQuantity += quantity; 
            var name = $(cards[j]).find('.card-name').text();
            name = fixCards(name);
            deckCards.main.push(
                {
                    name : name,
                    quantity : quantity
                }
            );
        }

        var sideboard = $(decks[i]).find('.sorted-by-sideboard-container .row');
        var sideboardQuantity = 0;
        for(j = 0; j < sideboard.length; j++){
            var quantity = parseInt($(sideboard[j]).find('.card-count').text());
            sideboardQuantity += quantity;
            var name = $(sideboard[j]).find('.card-name').text();
            name = fixCards(name);
            deckCards.sideboard.push(
                {
                    name : name,
                    quantity : quantity
                }
            );
        }
        data.totalMain = mainDeckQuantity;
        data.main = deckCards.main;
        data.totalSideboard = sideboardQuantity;
        data.sideboard = deckCards.sideboard;
        var colors = setUpColorForDeckName(deckCards);
        data.colors = colors;
        DecksData.update(
            {Events_id : data.Events_id, player : data.player},
            {
                $setOnInsert : data,
                $set : data
            },
            {upsert : true}
        );
    }

    Events.update(
        {type : "league", date : event.date, format : event.format},
        {
            $set : {
                "validation.extractDecks" : true
            }
        }
    );
}

var leagueTypes = {
    modern : "competitive-modern-constructed-league",
    standard : "competitive-standard-constructed-league",
    pauper : "pauper-constructed-league",
    vintage : "vintage-daily",
    legacy : "vintage-daily"
}