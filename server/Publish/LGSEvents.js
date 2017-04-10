Meteor.publish('LGSEvents', function(){
    return LGSEvents.find({});
});

Meteor.publish('LGSEventsStateFormat', function(Formats_id, state){
    return LGSEvents.find({Formats_id : Formats_id, state : state});
});
