Template.cardTable.helpers({
    metaPerWeek : function() {
        return _metaCards.findOne({typesCombinations : "daily4_0,daily3_1,ptqTop8,ptqTop9_16,ptqTop17_32", date : "year"}).mainboard;

    },
    previousDisabled : function(){
        if(Session.get(SV_metaCardListPagination) == 0){
            return "disabled";
        }else{
            return "";
        }
    },
    nextDisabled : function(){
        if(Session.get(SV_metaCardListPagination) + 10 > Session.get(SV_metaCardLength)){
            return "disabled";
        }else{
            return "";
        }
    }
});


Template.cardTable.events({
    'change input[role="checkbox"]' : function(evt, tmp){


        var types = [];
        var checkboxes = tmp.findAll('input[role="checkbox"].eventTypes:checked');
        for(var i =0; i < checkboxes.length; i++){
            types.push(checkboxes[i].value);
        }

        var mainSideboard = [];
        var checkboxesMainSideboard = tmp.findAll('input[role="checkbox"].mainSideboard:checked');
        for(var i =0; i < checkboxesMainSideboard.length; i++){
            mainSideboard.push(checkboxes[i].value);
        }

        var options = { types : types,
            mainSideboard : mainSideboard
            //,
            //            pagination : Session.get(SV_metaCardListPagination)
        };
        Meteor.call('getCardMeta', options, function (error, data) {
            if (error) {
                console.log(error);
                return;
            }
            Session.set("metaCards", data);
        });
    },
    'click .cardPagination' : function(evt, tmp) {
        if($(evt.target).attr("value") == "prev"){
            if(Session.get(SV_metaCardListPagination) != 0){
                Session.set(SV_metaCardListPagination, Session.get(SV_metaCardListPagination) - 10);
            }
        }else if($(evt.target).attr("value") == "next"){
            if(Session.get(SV_metaCardListPagination) + 10 < Session.get(SV_metaCards).pagination) {
                Session.set(SV_metaCardListPagination, Session.get(SV_metaCardListPagination) + 10);
            }
        }
    },
    'click .previous' : function(evt, tmp){

    },
    'click .next' : function(evt, tmp){

    },
    'change .checkbox-inline input' : function(evt, tmp){
        if(evt.target.value == "Main"){
            Session.set(SV_metaCardMetaMain, event.target.checked);
        }

        if(evt.target.value == "Sideboard"){
            Session.set(SV_metaCardMetaSideboard, event.target.checked);
        }
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
    },
    'click eventType' : function(evt, tmp){

    }
});

Template.cardTable.onRendered(function(){
    var table = $('#cardTable').DataTable({
        pageLength : 8,
        dom: "t",
        sort : false
        //"columns": [
        //    {
        //        "orderable": false,
        //        className : "details-control"
        //    },
        //    null,
        //    null,
        //    { "orderable": false },
        //    null,
        //    null,
        //    null,
        //    null,
        //    { "orderable": false }
        //],
        //order : [2, 'asc']
    });
    //
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
    //
    //$(".metaTableOptions .deckPagination[value=prev]").click(function(){
    //    table.page('previous').draw(false);
    //});
    //
    //$(".metaTableOptions .deckPagination[value=next]").click(function(){
    //    table.page('next').draw(false);
    //});
    //
    //$('#example2').show()
});
