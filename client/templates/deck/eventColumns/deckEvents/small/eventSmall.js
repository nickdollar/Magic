Template.eventSmall.helpers({
    daily : function(){
        return Session.get("deckSelectedData").events.dailies;
    }
});

Template.eventSmall.onRendered(function(){
    $(".clickable-row").click(function() {
        window.document.location = $(this).data("href");
    });
});