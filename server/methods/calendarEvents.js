Meteor.methods({
    addCalendarEvents : function(form){
        EventsCalendar.insert(form);
    },
})