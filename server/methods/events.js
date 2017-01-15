import cheerio from "cheerio";


Meteor.methods({

    getStarCityGamesEvents : function(data){
        getStarCityGamesEvents(data.format);
    },
    fixEventsStandard : function(){
        fixEventsStandard();
    },
    methodEventLeagueGetNewEvents : function(format){
        eventLeagueGetNewEvents(format);
    },
    methodEventLeagueGetInfoOld : function(data){
        eventLeagueGetInfoOld(data.format, data.days);
    },
    methodEventMTGOPTQGetInfoOld : function(data){
        getMTGOPtqEventsOLD(data.format, data.days);
    },
    methodGetGPEvents : function(){
        getGPEvents();
    },
    addALGSEvent(event){
        var eventQuery = Events.findOne({LGS_id : event.LGS_id, token : event.token});
        if(eventQuery){
            return false;
        }

        Object.assign(event, {type : "lgs"});

        console.log(event.email);
        var email = event.email;
        console.log(email);
        delete event.email;
        console.log(email);
        var _id = Events.insert(event);
        Object.assign(event, {Event_id : _id});
        Meteor.call("sendConfirmationFromNewEvent", email, event);

        return event;
    },
    checkIfEventExists(data){
        console.log(data);
        var eventFound = Events.findOne({LGS_id : data.LGS_id, token : data.token});
        if(eventFound){
            return eventFound;
        }
        return false;

    },
    checkIfEventPasswordIsRight(data){
        if(Events.find({password : data.password, _id : data._id}, {limit : 1}).count()){
            return true;
        }
        return false;
    },
    publishLGSEvent(Event_id){
        console.log(Event_id);
        Events.update({_id : Event_id},
            {
                $set : {"validation.published" : true,
                    "validation.published" : true}
            }
        )

    },
    checkForValidationExtractDecks(){
        console.log("START: checkForValidationExtractDecks");



        console.log(allEventsWithDeckWithoutNames);
        console.log(allEventsWithDeckWithoutNames.length);


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