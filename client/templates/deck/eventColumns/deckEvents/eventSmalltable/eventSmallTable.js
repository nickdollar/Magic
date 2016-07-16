Template.eventSmallTable.helpers({
    daily : function(){
        return {format: Router.current().params.format, eventType :"daily", name : Router.current().params.deckSelected.replace(/-/g," ")};
    },
    settings: function () {
        return {
            collection: _Deck,
            rowsPerPage: 7,
            showFilter: true,
            fields: [{key : 'result', label : "Score", fn: function(value, object, key){
                if(object.result.position != null){
                    return object.result.position;
                }
                return object.result.victory +"-"+object.result.loss;
            }
            },
                'player', 'name'],
            showNavigator: true
        };
    }
});

Template.eventSmallTable.onRendered(function(){
    //$(".clickable-row").click(function() {
    //    window.document.location = $(this).data("href");
    //});
});


