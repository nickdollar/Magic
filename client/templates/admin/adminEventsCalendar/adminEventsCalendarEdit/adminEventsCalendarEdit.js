Template.AdminEventsCalendarEdit.helpers({
    EventsCalendar : function(){
        return Schemas.EventsCalendar;
    },
    documentValue : function(){
        return EventsCalendar.findOne({_id : FlowRouter.getParam("_id")});
    }
});