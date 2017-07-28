Meteor.methods({
    getSCGEventsAndDecksMethod(){
        getSCGEventsAndDecks();
    },
    getSCGDecksCardsMethod(){
        getSCGDecksCards();
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
    getEventsByLGS_idMethod({LGS_id}){
        return Events.find({LGS_id : LGS_id, state : {$in : ["decks", "names", "published"]}}, {sort : {date : -1}}).fetch()
    },
    getGPPositionMethod(){
        getGPPosition();
    },
    fixEventsTransitionStandardMethod(){
        return fixEventsTransitionStandard();
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
        var eventFound = Events.findOne({LGS_id : form.LGS_id, token : form.token, });

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
    fixEventsStandardMethod(){
      fixEventsStandard();
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
    eventsSmallMethod({Formats_id, LGS_ids}){
        var eventsTypes_ids = EventsTypes.find({size : {$in : [0, 2]}}).map(type => type._id);
        return Events.find({ Formats_id : Formats_id, state : {$in : ["names"]},
            $or : [
                {EventsTypes_id : {$in : eventsTypes_ids}},
                {EventsTypes_id : "LGS", LGS_id : {$in : LGS_ids}},
            ]
        }).fetch();
    },
    eventsBigMethod({Formats_id, LGS_ids}){

        console.log(Formats_id, LGS_ids);
        var eventsTypes_ids = EventsTypes.find({size : 1}).map(type => type._id);
        console.log(eventsTypes_ids);
        var events = Events.find({ Formats_id : Formats_id, state : "names", EventsTypes_id : {$in : eventsTypes_ids}}).fetch();
        console.log(events);
        return events
    },
    getEventsStateQtyMethods({Formats_id}){

        return Events.aggregate(

            // Pipeline
            [
                // Stage 1
                {
                    $match: {
                        Formats_id : Formats_id
                    }
                },

                // Stage 2
                {
                    $group: {
                        _id : "$state",
                        qty : {$sum : 1}
                    }
                },

            ]
        );
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
        Events.update({_id : Events_id},
            {
                $set : {state : nextState},

            })
    },
    getEventsToConfirmMethod(){
        return Events.find({state : {$in : ["pending", "lgsCreated"]}}).fetch();
    },
    confirmLGSPrePublishMethod({Events_id : Events_id}){


        if(Roles.userIsInRole(Meteor.user(), 'admin')){
            var decksQty = DecksData.find({Events_id : Events_id}).count();

            Events.update({_id : Events_id}, {
                $set : {state : "published", decksQty : decksQty},
                $unset : {token : ""}
            })
        }
    },
    RemoveRemovedEventsMethod(){
        RemoveRemovedEvents();
    }
})

Meteor.methods({
    checkIfAdmin(){
        if(Roles.userIsInRole(Meteor.user(), 'admin')){
            return true;
        }
        return false;
    },
});

RemoveRemovedEvents = ()=>{
    Events.find({state : "removed"}).forEach((removeEvent)=>{
        DecksData.remove({Events_id : removeEvent._id})
    })
}


fixEventsBanned = function(){
    logFunctionsStart("fixEventsBanned");

    Formats.find().forEach((format)=> {
        var currentSets = {};
        if (format.sets) {
            currentSets["sets"] = {$nin: format.sets}
        } else {
            currentSets["sets"] = {}
        }

        var bannedEvents = Events.aggregate(
            [
                {
                    $match: {Formats_id: format._id}
                },
                {
                    $lookup: {
                        "from": "DecksData",
                        "localField": "_id",
                        "foreignField": "Events_id",
                        "as": "DecksData"
                    }
                },
                {
                    $unwind: "$DecksData"
                },
                {
                    $project: {
                        _id: "$_id", cards: {
                            $setUnion: [
                                {$map: {input: "$DecksData.main", as: "el", in: "$$el.Cards_id"}},
                                {$map: {input: "$DecksData.sideboard", as: "el", in: "$$el.Cards_id"}}
                            ]
                        }
                    }
                },
                {
                    $unwind: "$cards"
                },
                {
                    $group: {_id: "$_id", cards: {$addToSet: "$cards"}}
                },
                {
                    $unwind: {
                        path: "$cards",
                    }
                },
                {
                    $lookup: {
                        "from": "CardsUnique",
                        "localField": "cards",
                        "foreignField": "name",
                        "as": "sets"
                    }
                },
                {
                    $unwind: {
                        path: "$sets",
                    }
                },
                {
                    $group: {
                        _id: {Events_id: "$_id", name: "$cards"},
                        sets: {$addToSet: "$sets.setCode"}
                    }
                },
                {
                    $match: {
                        "_id.name": {$in: format.banned}
                    },

                },
                {
                    $group: {
                        _id: "$_id.Events_id",
                        qty: {$sum: 1},
                        names: {$addToSet: "$_id.name"}
                    }
                },

            ]
        );

        var banned_ids = bannedEvents.map(event => event._id);

        if(banned_ids.length){

        }
        console.log(banned_ids);

        // for (var i = 0; i < banned_ids.length; i++) {
        //     var foundEvent = Events.findOne({_id: banned_ids[i]});
        //     console.log(foundEvent);
        //     OldBannedEvents.update({_id: foundEvent._id},
        //         {
        //             $setOnInsert: foundEvent
        //         },
        //         {
        //             upsert: true
        //         })
        //     Events.remove({_id: foundEvent._id});
        //
        //     var foundDecksData = DecksData.find({Events_id: foundEvent._id}).forEach((deckData) => {
        //         OldBannedDecksData.update({_id: deckData._id},
        //             {
        //                 $setOnInsert: deckData
        //             },
        //             {
        //                 upsert: true
        //             })
        //
        //         DecksData.remove({_id: deckData._id});
        //     });
        // }
    })
    createAllInfoForAllDecksArchetypes();
    logFunctionsEnd("fixEventsBanned");
}



fixEventsStandard = function(){
    logFunctionsStart("fixEventsStandard");

        var currentsSets = Formats.findOne({_id : "sta"});

        var oldFormats = Events.aggregate(
            [
                {
                    $match: {Formats_id: "sta"}
                },
                {
                    $lookup: {
                        "from": "DecksData",
                        "localField": "_id",
                        "foreignField": "Events_id",
                        "as": "DecksData"
                    }
                },
                {
                    $unwind: "$DecksData"
                },
                {
                    $project: {
                        _id: "$_id", cards: {
                            $setUnion: [
                                {$map: {input: "$DecksData.main", as: "el", in: "$$el.Cards_id"}},
                                {$map: {input: "$DecksData.sideboard", as: "el", in: "$$el.Cards_id"}}
                            ]
                        }
                    }
                },
                {$unwind: "$cards"},

                {$group: {_id: "$_id", cards: {$addToSet: "$cards"}}},
                {$unwind: {path: "$cards",}},
                {
                    $lookup: {
                        "from": "CardsUnique",
                        "localField": "cards",
                        "foreignField": "name",
                        "as": "sets"
                    }
                },
                {
                    $unwind: {
                        path: "$sets",
                    }
                },
                {
                    $group: {
                        _id: {Events_id: "$_id", name: "$cards"},
                        sets: {$addToSet: "$sets.setCode"}
                    }
                },
                {$match: currentsSets},
                {
                    $group: {
                        _id: "$_id.Events_id",
                        qty: {$sum: 1},
                        names: {$addToSet: "$_id.name"}
                    }
                },
                {
                    $match: {
                        qty: {$gte: 4}
                    }
                }
            ]
        );


        var old_ids = oldFormats.map(event => event._id);

        if(old_ids.length){
            for (var i = 0; i < old_ids.length; i++) {
                var foundEvent = Events.findOne({_id: old_ids[i]});
                OldBannedEvents.update({_id: foundEvent._id},
                    {
                        $setOnInsert: foundEvent
                    },
                    {
                        upsert: true
                    })
                Events.remove({_id: foundEvent._id});
                DecksData.find({Events_id: foundEvent._id}).forEach((deckData) => {
                    OldBannedDecksData.update({_id: deckData._id},
                        {
                            $setOnInsert: deckData
                        },
                        {
                            upsert: true
                        })
                    DecksData.remove({_id: deckData._id});
                });
            }
            createAllInfoForAllDecksArchetypes();
        }
    logFunctionsEnd("fixEventsStandard");

}

fixEventsTransitionStandard = function(){
    logFunctionsStart("fixEventsStandard");

    var currentsSets = Formats.findOne({_id : "sta"});

    var standAllFormats = Events.aggregate(
        [
            {
                $match: {Formats_id: "sta"}
            },
            {
                $lookup: {
                    "from": "DecksData",
                    "localField": "_id",
                    "foreignField": "Events_id",
                    "as": "DecksData"
                }
            },
            {
                $unwind: "$DecksData"
            },
            {
                $project: {
                    _id: "$_id", cards: {
                        $setUnion: [
                            {$map: {input: "$DecksData.main", as: "el", in: "$$el.Cards_id"}},
                            {$map: {input: "$DecksData.sideboard", as: "el", in: "$$el.Cards_id"}}
                        ]
                    }
                }
            },
            {$unwind: "$cards"},

            {$group: {_id: "$_id", cards: {$addToSet: "$cards"}}},
            {$unwind: {path: "$cards",}},
            {
                $lookup: {
                    "from": "CardsUnique",
                    "localField": "cards",
                    "foreignField": "name",
                    "as": "sets"
                }
            },
            {
                $unwind: {
                    path: "$sets",
                }
            },
            {
                $group: {
                    _id: {Events_id: "$_id", name: "$cards"},
                    sets: {$addToSet: "$sets.setCode"}
                }
            },
            {
              $unwind : "$sets"
            },
            {$match: {sets : "HOU"}},
            {
                $group: {
                    _id: "$_id.Events_id",
                    qty: {$sum: 1},
                    names: {$addToSet: "$_id.name"}
                }
            },
            {
                $sort : {
                    date : 1
                }
            }
        ]
    );

    var standAllFormats_ids = standAllFormats.map(event => event._id);

    var badEvents = Events.find({_id : {$nin : standAllFormats_ids}}).map((event)=>{
        return event._id;
    })

    if(badEvents.length){
        for (var i = 0; i < badEvents.length; i++) {
            var foundEvent = Events.findOne({_id: badEvents[i]});
            OldBannedEvents.update({_id: foundEvent._id},
                {
                    $setOnInsert: foundEvent
                },
                {
                    upsert: true
                })
            Events.remove({_id: foundEvent._id});
            DecksData.find({Events_id: foundEvent._id}).forEach((deckData) => {
                OldBannedDecksData.update({_id: deckData._id},
                    {
                        $setOnInsert: deckData
                    },
                    {
                        upsert: true
                    })
                DecksData.remove({_id: deckData._id});
            });
        }
        createAllInfoForAllDecksArchetypes();
    }
    logFunctionsEnd("fixEventsStandard");



}