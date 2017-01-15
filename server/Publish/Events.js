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

Meteor.publish('EventsGetState', function(){
    return Events.find({}, {fields : {state : 1}});
});
