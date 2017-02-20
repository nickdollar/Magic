import cheerio from "cheerio";


Meteor.methods({

    getStarCityGamesEvents(data){
        getStarCityGamesEvents(data.format);
    },
    fixEventsStandard(){
        fixEventsStandard();
    },
    methodEventLeagueGetNewEvents(data){
        eventLeagueGetNewEvents(data.format);
    },
    methodEventLeagueGetInfoOld(data){
        eventLeagueGetInfoOld(data.format, data.days);
    },
    methodEventMTGOPTQGetInfoOld(data){
        getMTGOPtqEventsOLD(data.format, data.days);
    },
    methodEventMTGOPTQNewGetEvents(data){
        getMTGOPtqNewEvents(data.format);
    },
    methodGetGPEvents(){
        getGPEvents();
    },
    addALGSEvent(event){
        var eventQuery = Events.findOne({LGS_id : event.LGS_id, token : event.token});
        if(eventQuery){
            return false;
        }
        event.venue = "lgs";
        Object.assign(event, {type : "lgs"});

        var email = event.email;
        delete event.email;
        var _id = Events.insert(event);
        Object.assign(event, {Event_id : _id});
        Meteor.call("sendConfirmationFromNewEvent", email, event);

        return event;
    },
    checkIfEventExists(form){
        var eventFound = Events.findOne({LGS_id : form.LGS_id, token : form.token});

        if(eventFound){
            if(DecksData.findOne({Events_id : eventFound._id, player : form.player})){
                return "player";
            }
            return eventFound;
        }else{
            return "token";
        }
    },
    checkIfEventPasswordIsRight(data){
        var result;
        if(Events.find({password : data.password, _id : data._id}, {limit : 1}).count()){
            result = true;
        }else{
            result = false;
        }
        return result;
    },
    publishLGSEvent(Event_id){

        Events.update({_id : Event_id},
            {
                $set : {state : "prePublish", publishedDate : new Date()}
            }
        )
    }
})

Meteor.methods({
    fixLeagueDailyEvent(){
        console.log("START: fixLeagueDailyEvent");

        Events.find({type : {$in : ["daily", "league"]}, state : {$nin : ["decks", "notFoundOld"]}}).forEach((event)=>{

            if(Events.findOne({_id : event._id}).state == "notFound"){
                console.log("notFound");
                notFoundEvent(event._id);
            }

            if(Events.findOne({_id : event._id}).state == "exists" || Events.findOne({_id : event._id}).state == "HTMLFail"){
                console.log("exists");
                eventLeagueDailyDownloadHTML(event._id);
            }

            if(Events.findOne({_id : event._id}).state == "HTML"){
                console.log("HTML");
                eventLeagueDailyExtractDecks(event._id);
            }
        });
        console.log("   END: fixLeagueDailyEvent");
    },

    fixMTGOPTQEvent(){
        console.log("START: fixMTGOPTQEvent");

        Events.find({type : "MTGOPTQ", state : {$nin : ["decks", "notFoundOld"]}}).forEach((event)=>{
            if(Events.findOne({_id : event._id}).state == "notFound"){
                notFoundEventMTGOPTQ(event._id);
            }
            if(Events.findOne({_id : event._id}).state == "exists" || Events.findOne({_id : event._id}).state == "HTMLFail"){
                console.log("exists");
                eventExistsMTGOPTQ(event._id);
            }
            if(Events.findOne({_id : event._id}).state == "HTML"){
                console.log("HTML");
                eventHTMLMTGOPTQ(event._id);
            }
        });
        console.log("   END: fixMTGOPTQEvent");
    },
    fixGPEvent(){
        console.log("START: fixGPEvent");
        Events.find({type : "GP", state : {$nin : ["decks", "notFoundOld"]}}).forEach((event)=>{
            if(Events.findOne({_id : event._id}).state == "notFound"){
                GPEventNotFound(event._id);
            }
            if(Events.findOne({_id : event._id}).state == "exists" || Events.findOne({_id : event._id}).state == "HTMLMainFail"){
                GPEventsExists(event._id);
            }
            if(Events.findOne({_id : event._id}).state == "HTMLMain" || Events.findOne({_id : event._id}).state == "HTMLFail" || Events.findOne({_id : event._id}).state == "HTMLPartial"){
                GPEventHTMLMain(event._id);
            }
            if(Events.findOne({_id : event._id}).state == "HTML" || Events.findOne({_id : event._id}).state == "partialDecks" ){
                GPEventHTML(event._id);
            }
        });
        console.log("   END: fixGPEvent");
    },
    fixSCGEvent(){
        console.log("START: fixGPEvent");

        Events.find({type : {$regex : /^SCG/}, state : {$nin : ["decks", "notFoundOld"]}}).forEach((event)=>{

            if(Events.findOne({_id : event._id}).state == "notFound"){
                SCGnotFound(event._id);
            }

            if(Events.findOne({_id : event._id}).state == "exists" || Events.findOne({_id : event._id}).state == "HTMLMainFail"){
                SCGEventExists(event._id);
            }

            if(Events.findOne({_id : event._id}).state == "HTML" || Events.findOne({_id : event._id}).state == "partialDecks" ){
                SCGEventHTML(event._id);
            }
        });
        console.log("   END: fixGPEvent");
    }
})


fixEventsStandard = function(){
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

    console.log("   END: fixEventsStandard");
}




standardSets = ["BFZ", "OGW", "SOI", "EMN", "KLD"];