Meteor.publish('eventsCalendarByFormat', function(format){
    return EventsCalendar.find({formats : format, state : "confirmed"});
});

Meteor.publish('EventsCalendarAll', function(){
    return EventsCalendar.find({});
});

Meteor.publish('EventsCalendarNotConfirmed', function(format){
    return EventsCalendar.find({formats : format, state : "pending"});
});