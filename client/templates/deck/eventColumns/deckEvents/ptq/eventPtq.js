Template.eventPtq.helpers({
    ptq : function(){
        return  Session.get("deckSelectedData").events.ptq;
    }
});

Template.eventPtq.onRendered(function(){
    $(".clickable-row").click(function() {
        window.document.location = $(this).data("href");
    });
});