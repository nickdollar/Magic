Template.eventsTable.helpers({
    event : function(){
        return _Event.find({format : Session.get(SV_metaEventsFormat), type : Session.get(SV_metatype)}, {sort : {date : -1}, limit : 5});
    }
});

Template.eventsTable.events({
    "click .type" : function(evt, tmp){
        Session.set(SV_metatype, evt.target.value);
    }
});


Template.eventsTable.onRendered(function(){
    var table = $('#eventsTable').DataTable({
        pageLength : 8,
        dom: "t",
        //"columns": [
        //    null,
        //    null,
        //    { "orderable": false },
        //    null,
        //    null,
        //    null,
        //    null,
        //    { "orderable": false }
        //],
        order : [1, 'asc']
    });

    //$('#example2 tbody').on('click', 'td.details-control', function () {
    //    var archetypeName = $(this).attr("data-name"),
    //        tr = $(this).closest('tr'),
    //        row = table.row( tr );
    //    if ( row.child.isShown() ) {
    //        // This row is already open - close it
    //        row.child.hide();
    //        tr.removeClass('shown');
    //    } else {
    //        // Open this row
    //        row.child($(format(archetypeName))).show();
    //        tr.addClass('shown');
    //    }
    //});

    $(".eventsTableHeader .previous").click(function(){
        table.page('previous').draw(false);
    });

    $(".eventsTableHeader .next").click(function(){
        table.page('next').draw(false);
    });

    $('#eventsTable').show()
});
