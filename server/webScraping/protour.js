var PTs = [
    {
        url : "http://magic.wizards.com/en/events/coverage/ptakh",
        date : new Date(2017, 4,12),
        EventsTypes_id :"MTGPT",
        Formats_id : "sta",
    }
]

var monthValues = { jan : 0, january : 0, feb : 1, february : 1, mar : 2, march : 2, apr : 3, april : 3, may : 4, jun : 5, june : 5,
    jul : 6, july : 6, aug : 7, august : 7, sep : 8, september : 8, oct : 9, october : 9, nov : 10, november : 10, dec : 11, december : 11
}

//Download Events And Decks
getPTEventsAndDecks = ()=>{
    logFunctionsStart("getPTEventsAndDecks");
    for(var i = 0; i < PTs.length; i++) {
        Events.update({url : PTs[i].url},
            {
                $setOnInsert : { date : PTs[i].date, EventsTypes_id: PTs[i].EventsTypes_id, Formats_id : PTs[i].Formats_id, state : 'created'}
            },
            {
                upsert : true
            })
        var eventQuery = Events.findOne({url : PTs[i].url});
        if(eventQuery.state != "created"){
            continue;
        };
        webScrapingQueue.add({func : getGpEventsAndDecksHTTPRequest, args : {event : eventQuery}, wait : httpRequestTime})
    }
}