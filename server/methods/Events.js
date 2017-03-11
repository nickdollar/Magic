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
        Object.assign(event, {type : "lgs", state : "created"});

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
            if(eventFound.state == "locked"){
                return "locked";
            }

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
        var event = Events.findOne({_id : Event_id});

        if(!event.publishedDate){
            Events.update({_id : Event_id},
                {
                    $set : {publishedDate : new Date()}
                }
            )
        }

        if(event.state == "locked"){
            Events.update({_id : Event_id},
                {
                    $set : {state : "created"}
                }
            )
        }else{
            Events.update({_id : Event_id},
                {
                    $set : {state : "locked"}
                }
            )
        }
    },
    addBigEvent(form){
        form = Object.assign(form, {state : Roles.userIsInRole(Meteor.user(), 'admin') ? "confirmed" : "pending"});
        EventsCalendar.insert(form);
        return true;
    },
    stopEventsPublished(){
        var date = new Date(new Date().getTime() - (2*24*60*60*1000));
        console.log(date);
        Events.find({password : {$exists : true}, date : {$lt : date}}).forEach((event)=>{
            console.log(event);
            Events.update({_id : event._id},
                {
                    $unset : {password : "", token : ""}
                })

        })
    }
})

Meteor.methods({
    fixLeagueDailyEvent(){
        console.log("START: fixLeagueDailyEvent");
        Events.find({type : {$in : ["daily", "league"]}, state : {$nin : ["decks", "notFoundOld", "names"]}}).forEach((event)=>{

            if(Events.findOne({_id : event._id}).state == "pre"){
                console.log("pre");
                eventLeaguePreEvent(event._id);
            }

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
    },
    checkIfAdmin(){
        if(Roles.userIsInRole(Meteor.user(), 'admin')){
            return true;
        }
        return false;
    },
    confirmLGSPrePublish(Events_id){
        if(Roles.userIsInRole(Meteor.user(), 'admin')){
            Events.update({_id : Events_id}, {
                $set : {state : "published"}
            })
        }
    }
})

fixEventsStandard = function(){
    console.log("START: fixEventsStandard");

    Events.update({format : "oldStandard"},
        {
            $set : {format : "standard"},
            $unset : {totalDifference : ""}
        },
        {
            multi : true
        }
    )

    DecksData.update({format : "oldStandard"},
        {
            $set : {format : "standard"}
        },
        {
            multi : true
        }
    )

    var events = Events.aggregate([
        {$match : {format : "standard"}},
        {$lookup : {
            "from" : "DecksData",
            "localField" : "_id",
            "foreignField" : "Events_id",
            "as" : "DecksData"
        }},
        {$unwind : "$DecksData"},
        {$project : {_id : "$_id", cards : {
            $setUnion :
                [
                    {$map : {input : "$DecksData.main", as : "el", in : "$$el.name"}},
                    {$map : {input : "$DecksData.sideboard", as : "el", in : "$$el.name"}}
                ]
            }}},
        {$unwind : "$cards"},
        {$group : {_id : "$_id", cards : {$addToSet : "$cards"}}}
    ]);

    var standards = [];


    for(var i = 0; i < standardSets.length; i++){
        if(standardSets[i].release < new Date()){
            standards.push(standardSets[i].name);
            if(standardSets[i].end){
                if(standards.length == 6){
                    break;
                }
            }
        }
    }

    var lastStandard = [];
    lastStandard.push(standards[standards.length -1]);
    console.log(lastStandard);

    for(var i = 0; i <events.length; i++){
        var cardsFound = CardsFullData.find({name : {$in : events[i].cards}}).map(function(obj){
            return obj.name;
        });
        var cardsFound2 = CardsFullData.find({name : {$in : events[i].cards}, printings : {$in : lastStandard}}).map(function(obj){
            return obj.name;
        });

        if(_.intersection(cardsFound2, cardsFound).length){
            console.log(events[i]._id);
        }
        var totalDifference = Math.abs(cardsFound.length - cardsFound2.length);

        if(_.intersection(cardsFound2, cardsFound).length < 5){
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




standardSets =
    [   {name : "BFZ", release : new Date(2015, 9, 2)},
        {name : "OGW", release : new Date(2016, 0, 22), end : true},
        {name : "SOI", release : new Date(2016, 3, 8)},
        {name : "EMN", release : new Date(2016, 6, 22), end : true},
        {name : "KLD", release : new Date(2016, 8, 30)},
        {name : "AER", release : new Date(2017, 0, 20), end : true},
        {name : "AKH", release : new Date(2017, 3, 28)},
    ]
