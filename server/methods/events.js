import cheerio from "cheerio";


Meteor.methods({
    fixAllThingsLeagueDaily: function (format) {
        var decksWithoutHtml = Events.find({
            eventType : {$in : ["league", "daily"]},
            format : format,
            "validation.exists": true,
            $or: [{"validation.htmlDownloaded": {$exists: false}}, {"validation.htmlDownloaded": false}]
        });

        decksWithoutHtml.forEach(function (obj) {
            eventLeagueDailyDownloadHTML(obj._id);
        });

        var decksWithoutDecks = Events.find({
            format : format,
            "validation.htmlDownloaded": true,
            $or: [{"validation.extractDecks": {$exists: false}}, {"validation.extractDecks": false}]
        });

        decksWithoutDecks.forEach(function (obj) {
            eventLeagueDailyExtractDecks(obj._id);
        });
    },
    fixAllMTGOPTQEvents: function (format) {

        var decksWithoutHtml = Events.find({
            format : format,
            eventType : "MTGOPTQ",
            "validation.exists": true,
            $or: [{"validation.htmlDownloaded": {$exists: false}}, {"validation.htmlDownloaded": false}]
        });
        console.log(decksWithoutHtml.fetch());

        decksWithoutHtml.forEach(function (obj) {
            eventMTGOPTQDownloadHTML(obj._id);
        });

        var decksWithoutDecks = Events.find({
            format : format,
            "validation.htmlDownloaded": true,
            $or: [{"validation.extractDecks": {$exists: false}}, {"validation.extractDecks": false}]
        });

        decksWithoutDecks.forEach(function (obj) {
            eventMTGOPTQExtractDecks(obj._id);
        });
    },
    fixAllStarCityGamesByFormat: function (format) {
        console.log("START: fixAllStarCityGamesByFormat");

        var decksWithoutHtml = Events.find({
            eventType : {$in : ["SCG Super IQ", "Invi Qualifier", "SCG Invitational", "SCG Classic", "SCG Open", "grand Prix", "Legacy Champs", "World Magic Cup"]},
            format : format,
            "validation.exists": true,
            $or: [{"validation.htmlDownloaded": {$exists: false}}, {"validation.htmlDownloaded": false}]
        });

        decksWithoutHtml.forEach(function (obj) {
            getStarCityGamesEventsDownloadHTMLS(obj._id);
        });

        var decksWithoutDecks = Events.find({
            format : format,
            eventType : {$in : ["SCG Super IQ", "Invi Qualifier", "SCG Invitational", "SCG Classic", "SCG Open", "grand Prix", "Legacy Champs", "World Magic Cup"]},
            "validation.htmlDownloaded": true,
            $or: [{"validation.extractDecks": {$exists: false}}, {"validation.extractDecks": false}]
        });

        decksWithoutDecks.forEach(function (obj) {
            getStarCityGamesExtractDecks(obj._id);
        });
        console.log("END: fixAllStarCityGamesByFormat");
    },
    fixAllGPEvents: function () {

        var decksWithoutHtml = Events.find({
            eventType : "GP",
            "validation.exists": true,
            $or: [{"validation.htmlDownloaded": {$exists: false}}, {"validation.htmlDownloaded": false}]
        });

        decksWithoutHtml.forEach(function (obj) {
            getProTourHTMLS(obj._id);
        });

        var decksWithoutDecks = Events.find({
            eventType : "GP",
            "validation.htmlDownloaded": true,
            $or: [{"validation.extractDecks": {$exists: false}}, {"validation.extractDecks": false}]
        }).fetch();

        for(var i = 0; i < decksWithoutDecks.length; i++){
            console.log("EVENT :" + i);
            console.log(decksWithoutDecks[i]);
            eventPTExtractDecks(decksWithoutDecks[i]._id);
        }
    },
    fixOldEventsWizards : function(format){
        var decksWithoutHtml = Events.find({format : format, "validation.exists": false });

        decksWithoutHtml.forEach(function(decksWithoutHtmlObj){
            var res = Meteor.http.get(decksWithoutHtmlObj.url);

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
                {_id : decksWithoutHtmlObj._id},
                {
                    $set : {
                        "validation.exists" : upsert
                    }
                }
            );
        })
    },
    
    
    getStarCityGamesEvents : function(format){
        getStarCityGamesEvents(format);
    },
    fixEventsStandard : function(){
        fixEventsStandard();
    },
    methodEventLeagueGetNewEvents : function(format){
        eventLeagueGetNewEvents(format);
    },
    methodEventLeagueGetInfoOld : function(format){
        eventLeagueGetInfoOld(format, 2);
    },
    methodEventMTGOPTQGetInfoOld : function(format){
        getMTGOPtqEventsOLD(format, 30);
    },
    methodGPGetInfoOld : function(){
        getGPLinks();
    },
})


fixEventsStandard = function(){
    console.log("START: fixEventsStandard");
    var events = Events.aggregate([
        {$match : {format : "standard"}},
        {$lookup : {
            "from" : "DecksData",
            "localField" : "_id",
            "foreignField" : "Events_id",
            "as" : "DecksData"
        }},
        {$unwind : "$DecksData"},
        {$project : {_id : "$_id", cards : {$setUnion :
            [
                {$map : {input : "$DecksData.main", as : "el", in : "$$el.name"}},
                {$map : {input : "$DecksData.sideboard", as : "el", in : "$$el.name"}}
            ]
        }}},
        {$unwind : "$cards"},
        {$group : {_id : "$_id", cards : {$addToSet : "$cards"}}}
    ]);

    for(var i = 0; i <events.length; i++){
        var cardsFound = CardsFullData.find({name : {$in : events[i].cards}}).map(function(obj){
            return obj.name;
        });

        var cardsFound2 = CardsFullData.find({name : {$in : events[i].cards}, printings : {$in : standardSets}});

        var totalDifference = Math.abs(cardsFound.length - cardsFound2.count());
        if(totalDifference > 5){
            console.log("OLD STANDARD");
            Events.update({_id : events[i]._id},
                          {
                              $set : {
                                  format : "oldStandard",
                                  totalDifference : totalDifference
                              }
                          },
            );
            console.log(events[i]._id);
            DecksData.update({Events_id :  events[i]._id},
                            {
                                $set : { format : "oldStandard"}
                            },
                            {
                                multi : true
                            }
            )
        }
    }

    console.log("END: fixEventsStandard");
}


standardSets = ["BFZ", "OGW", "SOI", "EMN", "KLD"];