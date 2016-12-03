Meteor.methods({
    addEvents : function(form){
        EventsCalendar.insert(form);
        console.log(form);
    },
})