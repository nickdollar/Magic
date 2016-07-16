Template.auditEventsTable.helpers({
    events : function(){
        return _Event.find({});
    }
});


Template.auditEventsTable.events({
   "click button.aaaa" : function(evt, tmp){
       Meteor.call("testEvent");
  }
});