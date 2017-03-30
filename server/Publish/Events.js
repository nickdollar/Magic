Meteor.publish('EventsById', function(Events_id){
    return Events.find({_id : Events_id});
});

Meteor.publish('notCompleteEvent', function(){
    return Events.find({}, {sort : {date : 1}});
});

Meteor.publish('Events', function(){
    return Events.find({});
});

Meteor.publish('EventBy_id', function(Events_id){
    return Events.find({_id : Events_id});
});

Meteor.publish('EventsQueryProjection', function(notState){
    return Events.find({state : {$nin : notState}}, {fields : {state : 1, format : 1}});
});

Meteor.publish('EventsByLGS_idArray', function(arraysOfLGS_id){
    return Events.find({LGS_id : {$in : arraysOfLGS_id}, state : {$in : ["names", "published", "decks"]}});
});

Meteor.publish('EventsSmall', function(states, format, LGS_ids){
    var eventsTypes_ids = EventsTypes.find({size : 0}).map(type => type._id);
    return Events.find({$or : [{state : {$in : ["decks", "names"]}, format : format, EventsTypes_id : {$in : eventsTypes_ids}}, {state : "published", LGS_id : {$in : LGS_ids}}]});
});

Meteor.publish('EventsBig', function(states, format){
    return Events.find({state : {$in : states}, format : format,  decks : {$gte : 16}});
});

Meteor.publish('EventsLGS', function(format){
    return Events.find({state : {$in : ["prePublished", "published"]}, format : format});
});
