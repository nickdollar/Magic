Template.lastestDeckExamplebar.events({
    'click .getDaily' : function(){
        Session.set(SV_decksSelectedEventType, "daily");
    },
    'click .getPTQ' : function(){
        Session.set(SV_decksSelectedEventType, "ptq");
    }
});