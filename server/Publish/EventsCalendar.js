Meteor.publish('eventsCalendarByFormat', function(format){
    return EventsCalendar.find({formats : format});
});

Meteor.publish('EventsCalendarAll', function(){
    console.log(EventsCalendar.find().fetch());
    return EventsCalendar.find({});
});