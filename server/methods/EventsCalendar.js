Meteor.methods({
    addCalendarEvents : function(form){
        var temp = Object.assign(form, {state : "pending"});

        EventsCalendar.insert(temp);
    },
})