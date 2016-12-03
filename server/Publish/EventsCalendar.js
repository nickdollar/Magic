Meteor.publish('eventsCalendarByFormat', function(format){
    return EventsCalendar.find({formats : format});
});