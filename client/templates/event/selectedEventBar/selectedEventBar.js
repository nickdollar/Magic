Template.selectedEventBar.helpers({
    playerList : function(){
        return _eventDecks.find({}, {sort : {position : 1}});
    },
    pos : function(){
        if(this.position !== undefined){
            console.log(this.position);
            return this.position;
        }

        var position = this.victory + "-" + this.loss;

        if(this.draw != 0){
            position += " " + this.draw;
        }
        return position;
    },
    activated : function(){
        if(this._id == Session.get("selectedEvent__deckID")){
            return true;
        }
    }
})

Template.selectedEventBar.onRendered(function(){
    $.fn.dataTable.ext.pager.numbers_length = 6;
    var table = $("#eventDeckPlayers").DataTable({
        pageLength : 8,
        paging : "disable",
        dom: "<'row'<'col-sm-12't>>" +
        "<'row tableInfo'<'col-sm-5 dtInfo'i><'col-sm-7 dtPaginate'p>>",
        language: {
            "info" : "_START_ to _END_ of _TOTAL_ decks",
            "paginate": {
                "next":       ">",
                "previous":   "<"

            }
        },
        order : false
        //pagingType : "simple"
    });
});