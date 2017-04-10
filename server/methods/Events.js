Meteor.methods({
    getSCGEventsAndDecksMethod(){
        getSCGEventsAndDecks();
    },
    getSCGDecksCardsMethod(){
        getSCGDecksCards();
    },
    fixEventsStandard(){
        fixEventsStandard();
    },
    getLeagueEventsAndDecksMethod({Formats_id, dateType}){
        getLeagueEventsAndDecks({days : 5, Formats_id : Formats_id, dateType : dateType})
    },
    getMTGOPTQEventsAndDecksMethod({Formats_id, dateType}){
        getMTGOPTQEventsAndDecks({days : 10, Formats_id : Formats_id, dateType : dateType});
    },
    getGpEventsAndDecksMethod(){
        getGpEventsAndDecks();
    },
    getGPPositionMethod(){
        getGPPosition();
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
        Events.find({password : {$exists : true}, date : {$lt : date}}).forEach((event)=>{
            Events.update({_id : event._id},
                {
                    $unset : {password : "", token : ""}
                })

        })
    },
    eventsSmall({Formats_id, LGS_ids}){
        var eventsTypes_ids = EventsTypes.find({size : 0}).map(type => type._id);
        return Events.find({ Formats_id : Formats_id, state : {$in : ["decks", "names", "published"]},
            $or : [
                {EventsTypes_id : {$in : eventsTypes_ids, $ne : "LGS"}},
                {EventsTypes_id : "LGS", LGS_id : {$in : LGS_ids}},
            ]
        }).fetch();
    },
    eventsBig({Formats_id, LGS_ids}){
        var eventsTypes_ids = EventsTypes.find({size : 1}).map(type => type._id);
        var events = Events.find({ Formats_id : Formats_id, state : {$in : ["decks", "names", "published"]}, $or : [
            {EventsTypes_id : {$in : eventsTypes_ids, $ne : "LGS"}},
            {EventsTypes_id : "LGS", LGS_id : {$in : LGS_ids}},
        ]}).fetch();
        return events
    },
    getEventsStateQty({state, Formats_id, page, limit}){
        return DecksData.find({state : state, Formats_id : Formats_id}, {limit : limit, skip : page*limit, fields : {Formats_id : 1, state : 1, colors : 1}}).fetch();
    }
})

Meteor.methods({
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
    logFunctionsStart("fixEventsStandard");

    Events.update({Formats_id : "oldStandard"},
        {
            $set : {Formats_id : "standard"},
            $unset : {totalDifference : ""}
        },
        {
            multi : true
        }
    )

    DecksData.update({Formats_id : "oldStandard"},
        {
            $set : {Formats_id : "standard"}
        },
        {
            multi : true
        }
    )

    var events = Events.aggregate([
        {$match : {Formats_id : "standard"}},
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
    for(var i = 0; i <events.length; i++){
        var cardsFound = CardsFullData.find({name : {$in : events[i].cards}}).map(function(obj){
            return obj.name;
        });
        var cardsFound2 = CardsFullData.find({name : {$in : events[i].cards}, printings : {$in : lastStandard}}).map(function(obj){
            return obj.name;
        });

        var totalDifference = Math.abs(cardsFound.length - cardsFound2.length);

        if(_.intersection(cardsFound2, cardsFound).length < 5){
            Events.update({_id : events[i]._id},
                          {
                              $set : {
                                  Formats_id : "oldStandard",
                                  totalDifference : totalDifference
                              }
                          },
            );
            DecksData.update({Events_id :  events[i]._id},
                            {
                                $set : { Formats_id : "oldStandard"}
                            },
                            {
                                multi : true
                            }
            )
        }
    }
    logFunctionsEnd("fixEventsStandard");
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
