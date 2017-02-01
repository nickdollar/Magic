Meteor.publish('LGSEvents', function(){
    return LGSEvents.find({});
});

Meteor.publish('LGSEventsStatesList', function(notState){
    return LGSEvents.find({state : {$nin : notState}}, {fields : {state : 1, format : 1}});
});

Meteor.publish('LGSEventsStateFormat', function(format, state){
    return LGSEvents.find({format : format, state : state});
});

Meteor.publish('LGSEventsByArrayOfLGS_ids', function(arraysOfLGS_id){
    return LGSEvents.find({LGS_id : {$in : arraysOfLGS_id}});
});

Meteor.publish('LGSEventsByStoreInArea', function(location, distance){
    var lgs = LGS.find({"location.coords" : {$geoWithin : {$centerSphere: [location, distance / 3963.2]}}}).map((obj)=>{
        return obj._id;
    })
    return LGSEvents.find({LGS_id : {$in : lgs}})
});


Meteor.publishComposite('LGSEventsByStoreInAreaComposite', function(location, distance){
    return {
        find(){
            return LGS.find({"location.coords" : {$geoWithin : {$centerSphere: [location, distance / 3963.2]}}})
        },
        children : [
            {
                find(LGS){
                    return LGSEvents.find({LGS_id : LGS._id})
                }
            }
        ]
    }
})