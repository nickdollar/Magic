Meteor.publish('eventsCalendarByFormat', function(format){
    return EventsCalendar.find({formats : format, state : "confirmed"});
});
Meteor.publish('EventsCalendarNotConfirmed', function(format){
    return EventsCalendar.find({formats : format, state : "pending"});
});

Meteor.publish('BIGEventsCalendar', function(format){
    return EventsCalendar.find({formats : format, state : "confirmed"});
});