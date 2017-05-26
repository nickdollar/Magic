Meteor.methods({
    downloadAllDecksMethods(){
        logFunctionsStart("downloadAllDecksMethods");
        webScrapingQueue.add({func : getSCGEventsAndDecks, args : {}, wait : httpRequestTime});
        webScrapingQueue.add({func : getSCGDecksCards, args : {}, wait : httpRequestTime});
        getMTGOPTQEventsAndDecks({Formats_id : "sta", days : 15, dateType : "current"});
        getMTGOPTQEventsAndDecks({Formats_id : "mod", days : 15, dateType : "current"});
        getMTGOPTQEventsAndDecks({Formats_id : "leg", days : 15, dateType : "current"});
        getMTGOPTQEventsAndDecks({Formats_id : "vin", days : 15, dateType : "current"});
        getLeagueEventsAndDecks({Formats_id : "sta", days : 15, dateType : "current"});
        getLeagueEventsAndDecks({Formats_id : "mod", days : 15, dateType : "current"});
        getLeagueEventsAndDecks({Formats_id : "leg", days : 15, dateType : "current"});
        getLeagueEventsAndDecks({Formats_id : "vin", days : 15, dateType : "current"});
        webScrapingQueue.add({func : createMetaLastAddition, args : {}, wait : 1});
        webScrapingQueue.add({func : createMetaLastDaysAdditions, args : {}, wait : 1});
        logFunctionsEnd("downloadAllDecksMethods");
    }
});