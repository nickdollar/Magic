Meteor.methods({
    addCalendarEvents : function(form){
        var temp = Object.assign(form, {state : "pending"});
        EventsCalendar.insert(temp);
    },
    stateConfirmCalendarEvents(_ids){

        EventsCalendar.update({_id : {$in : _ids}},
        {
            $set : {state : "confirmed"}
        },
        {
            multi : true
        });
    },
    getEventsCalendar(_ids){
        EventsCalendar.update({_id : {$in : _ids}},
            {
                $set : {state : "confirmed"}
            },
            {
                multi : true
            });
    },
    GetFrontPageEvents(){
        var date = new Date(new Date().setHours(0, 0, 0, 0));
        var startingDate = date.addDays(-1);
        var endDate = date.addDays(6);
        return EventsCalendar.find({start: {$gte: startingDate, $lt: endDate}, state: "confirmed"}).fetch();
    },
    getBigEventsCalendar({Formats_id}){
        return EventsCalendar.find({Formats_id : Formats_id, state : "confirmed"}).fetch();
    }
});