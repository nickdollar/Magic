moveHtml = function(){
    console.log("moveHtml START");
    var eventsQuery = Events.find({html : {$exists : true}});

    eventsQuery.forEach(function(eventsObj){
        EventsHtmls.update({Events_id : eventsObj._id},
            {
                $set : {html : eventsObj.html}
            },
            {upsert : true}
        )

        Events.update({_id : eventsObj._id},
            {
                $unset : {html : 1}
            },
            {multi : true},
            {upsert : true}
        )
    });
    console.log("moveHtml END");
}

fixNamesOnDecksNames = function(){
    DecksNames.find({}).forEach(function(obj){
        var name = deckNameAndArchetype(obj.name);
        DecksNames.update({_id : obj._id},
            {$set : {name : name}}
        )
    });

    DecksArchetypes.find({}).forEach(function(obj){
        var name = deckNameAndArchetype(obj.name);
        console.log(name);
        DecksArchetypes.update({_id : obj._id},
            {$set : {name : name}}
        )
    });
};

