Template.eventPtqTable.helpers({
    ptq : function(){
        return  Session.get("deckSelectedData").events.ptq;
    },
    selector : function(){
        return {format: Router.current().params.format, name : Router.current().params.deckSelected.replace(/-/g," ")};
    }
});

Template.eventPtqTable.onRendered(function(){
    $(".clickable-row").click(function() {
        window.document.location = $(this).data("href");
    });
});