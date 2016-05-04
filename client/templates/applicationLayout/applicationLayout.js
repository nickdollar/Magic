Template.metaFP.helpers({
    metas : function(){
        var metas = ['standard', 'modern', 'legacy', 'vintage'];
        return metas;
    },
    values : function(){
        var metas = ['standard', 'modern', 'legacy', 'vintage'];
        return metas;
    }
});

Template.metaFP.onRendered(function(){
        $("table").each(function(index){
            var length = 6;
            if($(this).hasClass("three")){
                length = 3;
            }

        var oTable = $(this).DataTable({
            paging: true,
            searching : false,
            ordering : false,
            info : false,
            pagingType : "simple",
            lengthChange: false,
            pageLength : length,
            language: {
                paginate: {
                    first: '>>',
                    previous: '<',
                    next: '>',
                    last: '>>'
                }
            },
            dom:"<'row'<'col-sm-12't>>"
        });

        $(this).closest(".customTable").find(".previous:first").click(function(){
            oTable.page('previous').draw(false);
        });

        $(this).closest(".customTable").find(".next:first").click(function(){
            oTable.page('next').draw(false);
        });
    });
});


Template.selectedMeta.helpers({

});




Template.selectedMeta.onRendered(function(){
    //$("table").each(function(index){
    //    var length = 2;
    //    //if($(this).hasClass("20")){
    //    //    length = 20;
    //    //}
    //
    //    var oTable = $(this).DataTable({
    //        paging: true,
    //        searching : false,
    //        ordering : false,
    //        info : false,
    //        pagingType : "simple",
    //        lengthChange: false,
    //        pageLength : length,
    //        language: {
    //            paginate: {
    //                first: '>>',
    //                previous: '<',
    //                next: '>',
    //                last: '>>'
    //            }
    //        },
    //        dom:"<'row'<'col-sm-12'tp>>"
    //    });
    //
    //    $(this).closest(".customTable").find(".previous:first").click(function(){
    //        oTable.page('previous').draw(false);
    //    });
    //
    //    $(this).closest(".customTable").find(".next:first").click(function(){
    //        oTable.page('next').draw(false);
    //    });
    //
    //
    //});
    //
    //var table = $('#example2').DataTable({});
    //
    //$('#example2 tbody').on('click', 'td.details-control', function () {
    //    console.log(this);
    //    var tr = $(this).closest('tr');
    //    var row = table.row( tr );
    //    console.log("AVVVVVVVVVVVVVVV");
    //    if ( row.child.isShown() ) {
    //        console.log("ZZZZZZZZZZZZ");
    //        // This row is already open - close it
    //        row.child.hide();
    //        tr.removeClass('shown');
    //    }
    //    else {
    //        console.log("YYYYYYYYYYYYYY");s
    //        // Open this row
    //        row.child().show();
    //        tr.addClass('shown');
    //    }
    //} );


});