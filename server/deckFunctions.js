getEvents = function(format, deckSelected){
    var events = {dailies : [], ptq : [], others : []};

    var decksDailies = _Deck.find({format : format, name : deckSelected.replace("-", " "), eventType : "daily"},
                            { limit : 5, sort : {date : 1}}).fetch();


    decksDailies.forEach(function(deck){
        var dateString =(deck.date.getMonth() + 1) + '/' + deck.date.getDate() + '/' +  deck.date.getFullYear();

        var event = _Event.findOne({_id : deck._eventID});
        var deckInformation = {player : deck.player, url : event.httpAddress, score : deck.victory + "-" + deck.loss, date : dateString};
        events.dailies.push(deckInformation);
    });

    var decksPtq = _Deck.find({format : format, name : deckSelected.replace("-", " "), eventType : "ptq"},
        { limit : 5, sort : {date : 1}}).fetch();

    decksPtq.forEach(function(deck){
        var dateString =(deck.date.getMonth() + 1) + '/' + deck.date.getDate() + '/' +  deck.date.getFullYear();
        var event = _Event.findOne({_id : deck._eventID});
        var deckInformation = {player : deck.player, url : event.httpAddress, position : deck.position, date : dateString};
        events.ptq.push(deckInformation);
    });
    return events;
};