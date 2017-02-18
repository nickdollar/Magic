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
    return Events.find({LGS_id : {$in : arraysOfLGS_id}, state : "names"});
});


Meteor.publish('EventsSmall', function(states, format){
    return Events.find({state : {$in : states},  format : format, decks : {$lt : 16}})
});

Meteor.publish('EventsBig', function(states, format){
    return Events.find({state : {$in : states}, format : format, decks : {$gte : 16}});
});

