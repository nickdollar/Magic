Meteor.publish('EventsById', function(Events_id){
    return Events.find({_id : Events_id});
});

Meteor.publish('notCompleteEvent', function(){
    return Events.find({}, {sort : {date : 1}});
});
