Template.futureEventsTable.helpers({
    futureEvents : function(){
        return _Event.find({customEvent : true});
    },
    creator : function(){
        return this.eventCreator == Meteor.user()._id;
    }
});

Template.futureEventsTable.events({
     "click .deleteFutureEvent" : function(evt, tmp){
        Meteor.call("removeEvent", this._id);
     }
});