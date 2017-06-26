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
    getGpEventsAndDecks2Method(){
        getGpEventsAndDecks2();
    },
    getGPPositionMethod(){
        getGPPosition();
    },
    fixDecksStateNamesMethods(){
        Events.find({EventsTypes_id : {$ne : "LGS"}}).forEach((event)=>{
            var eventsDeck = DecksData.find({Events_id : event._id}).count();
            var events = DecksData.find({Events_id : event._id, DecksArchetypes_id : {$exists : true}}).count();
            if(eventsDeck == events){
                Events.update({_id : event._id},
                    {
                        $set : {state : "names"}
                    })
            }
        })
    },
    addALGSEventMethod(event){
        var eventQuery = Events.findOne({LGS_id : event.LGS_id, token : event.token});
        if(eventQuery){return {confirm : false, response : "Token Already For Exists For That Store"}}

        Object.assign(event, {EventsTypes_id : "LGS", state : "lgsCreated", Users_id : Meteor.userId()});

        Events.insert(event);
        return {confirm : true, response : event};
    },
    checkIfEventExists(form){
        var eventFound = Events.findOne({LGS_id : form.LGS_id, token : form.token});

        if(eventFound){
            if(eventFound.state == "names"){
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
        return {confirm : true};
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
        return Events.find({ Formats_id : Formats_id, state : {$in : ["names"]},
            $or : [
                {EventsTypes_id : {$in : eventsTypes_ids, $ne : "LGS"}},
                {EventsTypes_id : "LGS", LGS_id : {$in : LGS_ids}},
            ]
        }).fetch();
    },
    eventsBigMethod({Formats_id, LGS_ids}){
        var eventsTypes_ids = EventsTypes.find({size : 1}).map(type => type._id);
        var events = Events.find({ Formats_id : Formats_id, state : {$in : ["names"]}, $or : [
            {EventsTypes_id : {$in : eventsTypes_ids, $ne : "LGS"}},
            {EventsTypes_id : "LGS", LGS_id : {$in : LGS_ids}},
        ]}).fetch();
        return events
    },
    getEventsStateQty({state, Formats_id, page, limit}){
        return DecksData.find({state : state, Formats_id : Formats_id}, {limit : limit, skip : page*limit, fields : {Formats_id : 1, state : 1, colors : 1}}).fetch();
    },
    getUsersCreatedEventsMethod(){
        if(!Meteor.userId()){
            return [];
        }
        return Events.find({Users_id : Meteor.userId()}).fetch();
    },
    removeUsersEventsMethod({Events_id}){
        Events.update({_id : Events_id},
            {
                $set : {state : "removed", removedHours : new Date()}
            })
    },
    publishUsersEvent({Events_id, nextState}){
        console.log(Events_id, nextState);
        Events.update({_id : Events_id},
            {
                $set : {state : nextState},

            })
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

    Formats.find().forEach((format)=>{

        var currentSets = {};

        if(format.sets){
            currentSets["sets"] = {$nin : format.sets}
        }else{
            currentSets["sets"] = {}
        }

        var bannedEvents = Events.aggregate(
            [
                {
                    $match: {Formats_id : format._id}
                },
                {
                    $lookup: {
                        "from" : "DecksData",
                        "localField" : "_id",
                        "foreignField" : "Events_id",
                        "as" : "DecksData"
                    }
                },
                {
                    $unwind: "$DecksData"
                },
                {
                    $project: {_id : "$_id", cards : {
                        $setUnion :
                            [
                                {$map : {input : "$DecksData.main", as : "el", in : "$$el.name"}},
                                {$map : {input : "$DecksData.sideboard", as : "el", in : "$$el.name"}}
                            ]
                    }}
                },
                {
                    $unwind: "$cards"
                },
                {
                    $group: {_id : "$_id", cards : {$addToSet : "$cards"}}
                },
                {
                    $unwind: {
                        path : "$cards",
                    }
                },
                {
                    $lookup: {
                        "from" : "CardsUnique",
                        "localField" : "cards",
                        "foreignField" : "name",
                        "as" : "sets"
                    }
                },
                {
                    $unwind: {
                        path : "$sets",
                    }
                },
                {
                    $group: {
                        _id : {Events_id : "$_id", name : "$cards"},
                        sets : {$addToSet : "$sets.setCode"}
                    }
                },
                {
                    $match:
                        {
                            "_id.name" : {$in : format.banned}
                        },

                },
                {
                    $group: {
                        _id : "$_id.Events_id",
                        qty : {$sum : 1},
                        names : {$addToSet : "$_id.name"}
                    }
                },

            ]
        );

        var oldFormats =Events.aggregate(
            [
                {
                    $match: {Formats_id : "sta"}
                },
                {
                    $lookup: {
                        "from" : "DecksData",
                        "localField" : "_id",
                        "foreignField" : "Events_id",
                        "as" : "DecksData"
                    }
                },
                {
                    $unwind: "$DecksData"
                },
                {
                    $project: {_id : "$_id", cards : {
                        $setUnion :
                            [
                                {$map : {input : "$DecksData.main", as : "el", in : "$$el.name"}},
                                {$map : {input : "$DecksData.sideboard", as : "el", in : "$$el.name"}}
                            ]
                    }}
                },
                {$unwind: "$cards"},

                {$group: {_id : "$_id", cards : {$addToSet : "$cards"}}},
                {$unwind: {path : "$cards",}},
                {$lookup: {
                        "from" : "CardsUnique",
                        "localField" : "cards",
                        "foreignField" : "name",
                        "as" : "sets"
                }},
                {
                    $unwind: {
                        path : "$sets",
                    }
                },
                {
                    $group: {
                        _id : {Events_id : "$_id", name : "$cards"},
                        sets : {$addToSet : "$sets.setCode"}
                    }
                },
                {$match: currentSets},
                {
                    $group: {
                        _id : "$_id.Events_id",
                        qty : {$sum : 1},
                        names : {$addToSet : "$_id.name"}
                    }
                },
                {
                    $match : {
                        qty : {$gte : 4}
                    }
                }
            ]

        );




        var banned_ids = bannedEvents.map(event => event._id);
        var old_ids = oldFormats.map(event => event._id);

        Events.update({_id : {$in : banned_ids}},
            {
                $set : {Formats_id : `${format._id}B`}
            },
            {
                multi : true
            }
        )

        DecksData.update({Events_id : {$in : banned_ids}},
            {
                $set : {Formats_id : `${format._id}B`}
            },
            {
                multi : true
            }
        )

        Events.update({_id : {$in : old_ids}},
            {
                $set : {Formats_id : `${format._id}O`}
            },
            {
                multi : true
            })
        DecksData.update({Events_id : {$in : old_ids}},
            {
                $set : {Formats_id : `${format._id}O`}
            },
            {
                multi : true
            }
        )
    })



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
