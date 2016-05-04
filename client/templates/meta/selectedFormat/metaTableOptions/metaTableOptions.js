Template.metaTableOptions.helpers({

});

Template.metaTableOptions.onRendered(function(){

});

Template.metaTableOptions.events({
    'change input[role="checkbox"]' : function(evt, tmp){
        var types = [];
        var checkboxes = tmp.findAll('input[role="checkbox"].metaCheckBox:checked');

        for(var i =0; i < checkboxes.length; i++){
            types.push(checkboxes[i].value);
        }
        Session.set("types", types.toString());
        //
        //if ( $.fn.dataTable.isDataTable( '#example2' ) ) {
        //    var table = $('#example2').DataTable();
        //    table.draw();
        //}
    },
    'change input[role="radio"]' : function(evt, tmp){

        console.log($(evt.target).attr("value"));
        Session.set("date", $(evt.target).attr("value"));
        //if ( $.fn.dataTable.isDataTable( '#example2' ) ) {
        //    var table = $('#example2').DataTable();
        //    table.clear();
        //}
        //var types = [];
        //var checkboxes = tmp.findAll('input[role="checkbox"].metaCheckBox:checked');
        //
        //for(var i =0; i < checkboxes.length; i++){
        //    types.push(checkboxes[i].value);
        //}
        //Session.set("types", types.toString());
        ////
        ////if ( $.fn.dataTable.isDataTable( '#example2' ) ) {
        ////    var table = $('#example2').DataTable();
        ////    table.draw();
        ////}
    },
    'click .options' : function(evt,tmp){
        $header = $(evt.target);
        //getting the next element
        $content = $(tmp.find(".content"));
        //open up the content needed - toggle the slide- if visible, slide up, if not slidedown.
        $content.slideToggle(0, function () {
            //execute this after slideToggle is done
            //change text of header based on visibility of content div
            $header.text(function () {
                //change text based on condition
                //return $content.is(":visible") ? "Collapse" : "Expand";
            });
        });
    }
});