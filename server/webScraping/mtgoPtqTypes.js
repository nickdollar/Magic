getMtgoPtqEvents = function(format, days){
    var date = new Date();
    var type = "ptq";
    date.setHours(0,0,0,0);
    if(format == null || days == null){
        return;
    }

    if(mtgoPtqTypes[format] == null){
        console.log("Invalid Format")
        return;
    }
    for(var i = 0; i < days ; i++){
        var day = pad(date.getDate());
        var month = pad(date.getMonth()+1);
        var year = date.getYear() + 1900;
        var url = "http://magic.wizards.com/en/articles/archive/mtgo-standings/" + mtgoPtqTypes[format] + "-" + year + "-" + month + "-" + day;
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
                Events.update(
                    {type : type, date : date},
                    {
                        $setOnInsert : {
                            type : type,
                            date: date,
                            format : format,
                            eventName : mtgoPtqTypes[format],
                            eventType: type,
                            players : decks.length,
                            url : url,
                            html : $(deckMeta).html()
                        },
                        $set : {
                            format : format,
                            eventName : mtgoPtqTypes[format],
                            eventType: type,
                            players : decks.length,
                            url : url,
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

getMtgoPtq8 = function(event){

    var event = Events.findOne({});
    var $ = cheerio.load(event.html);
    var decks = $('.bean--wiz-content-deck-list');

    var rows = $(".even, .odd");
    var options = $("thead th");
    var rankingsTable = [];

    for(var i = 0 ; i < rows.length; i++) {
        var columns = $(rows[i]).find("td");
        var table = {};
        for(var j = 0; j < options.length; j++){
            table[$(options[j]).html()] = $(columns[j]).html();
        }
        rankingsTable.push(table);
    }

    var top8Table = $(".top-bracket-slider");

    var top8Bracket = getTop8Bracket($, top8Table);

    Events.update({_id : event._id},{
        $set : {top8Bracket : top8Bracket, rankingsTable : rankingsTable}
    });

    for(var i = 0 ; i < decks.length; i++){
        var information = getDeckInfoFromTop8($(decks[i]).find('h4').html());
        var data = {
            Events_id : event._id,
            date : event.date,
            eventType : event.eventType,
            player : information.player,
            format : event.format
        };

        var cards = $(decks[i]).find('.sorted-by-overview-container .row');
        var mainDeckQuantity = 0;
        var deckCards = {main : [], sideboard : []};
        for(var j = 0; j < cards.length; j++){
            var quantity = parseInt($(cards[j]).find('.card-count').text());
            mainDeckQuantity += quantity;
            var name = $(cards[j]).find('.card-name').text();
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
        data.colors = setUpColorForDeckName(deckCards);
        DecksData.update(
            {Events_id : data.Events_id, player : data.player},
            {
                $setOnInsert : data,
                $set : data
            },
            {upsert : true}
        );
    }
}

var mtgoPtqTypes = {
    modern : "modern-ptq",
    standard : "standard-ptq",
    pauper : "pauper-ptq",
    vintage : "vintage-ptq",
    legacy : "legacy-ptq"

}