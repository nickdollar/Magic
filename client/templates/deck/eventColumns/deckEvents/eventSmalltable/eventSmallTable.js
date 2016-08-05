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
    //$("tr").click(function() {
    //    alert();
    //});
});

Template.eventSmallTable.events({
    //'click tbody > tr': function (event) {
    //    var dataTable = $(event.target).closest('table').DataTable();
    //    var rowData = dataTable.row(event.currentTarget).data();
    //    if (!rowData) return; // Won't be data if a placeholder row is clicked
    //    alert();
    //}
});

