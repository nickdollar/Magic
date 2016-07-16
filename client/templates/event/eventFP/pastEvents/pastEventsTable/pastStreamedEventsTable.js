Template.pastStreamedEventsTable.helpers({
    events : function(){
        return _Event.find({customEvent : true});
    },
    firstFormat : function(){

        return this.format[0];
    }
});


Template.pastStreamedEventsTable.events({
   "click .addVoidOrPlayList" : function(){
       Session.set("selectedVODorPlaylist", this._id);
   }
});

