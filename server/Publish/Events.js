Meteor.publish('EventsById', function(Events_id){
    return Events.find({_id : Events_id});
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

Meteor.publish('EventsLGS', function(Formats_id){
    return Events.find({state : {$in : ["prePublished", "published"]}, Formats_id : Formats_id});
});
