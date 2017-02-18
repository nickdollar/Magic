Meteor.methods({
    addCalendarEvents : function(form){
        var temp = Object.assign(form, {state : "pending"});

        EventsCalendar.insert(temp);
    },
    stateConfirmCalendarEvents : function(_ids){

        EventsCalendar.update({_id : {$in : _ids}},
        {
            $set : {state : "confirmed"}
        },
        {
            multi : true
        });
    },

})