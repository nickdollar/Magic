getLeagueTheEvents = function(format, days){
    var date = new Date();
    date.setHours(0,0,0,0);
    if(format == null || days == null){
        return;
    }

    if(eventsType[format] == null){
        console.log("Invalid Format")
        return;
    }
    for(var i = 0; i < days ; i++){
        var day = pad(date.getDate());
        var month = pad(date.getMonth()+1);
        var year = date.getYear() + 1900;
        var url = "http://magic.wizards.com/en/articles/archive/mtgo-standings/" + leagueTypes[format] + "-" + year + "-" + month + "-" + day;
        var res = request.getSync(url, {
            encoding : null
        });

        if (res.response.statusCode == 200) {
            var buffer = res.body;
            var $ = cheerio.load(buffer);
            var deckMeta = $('#main-content');

            if(deckMeta.length == 0){
                console.log("Page Doesn't exists");
            }else{
                console.log("page exists");
                var decks = $('.deck-group');
                _temp.update(
                    {type : "league", date : date},
                    {
                        $setOnInsert : {
                            type : type,
                            date: date,
                            format : format,
                            eventName : leagueTypes[format],
                            eventType: "league",
                            players : decks.length,
                            httpAddress : url,
                            html : $(deckMeta).html()
                        },
                        $set : {
                            format : format,
                            eventName : leagueTypes[format],
                            eventType: "league",
                            players : decks.length,
                            httpAddress : url,
                            html : $(deckMeta).html()
                        }
                    },
                    {upsert : true}
                );
            }

        }
        date = new Date(date.setDate(date.getDate() - 1));
    }
}

extractCardsFromLeague = function(){
    var event = _temp.findOne({});
    var $ = cheerio.load(event.html);
    var decks = $('.bean--wiz-content-deck-list');

    for(var i = 0 ; i < decks.length; i++){
        var information = getDeckInfo($(decks[i]).find('h4').html());
        var data = {
            _eventID : event._id,
            date : event.date,
            eventType : event.eventType,
            player : information.player,
            format : event.format,
            victory : information.victory,
            draw : information.draw,
            loss : information.loss
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
        _temp2.update(
            {_eventID : data._eventID, player : data.player},
            {
                $setOnInsert : data,
                $set : data
            },
            {upsert : true}
        );
    }
}

var leagueTypes = {
    modern : "competitive-modern-constructed-league",
    standard : "competitive-standard-constructed-league",
    pauper : "pauper-constructed-league",
    vintage : "vintage-daily",
    legacy : "vintage-daily"

}