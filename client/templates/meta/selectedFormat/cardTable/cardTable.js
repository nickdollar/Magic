Template.cardTable.onCreated(function(){
    this.options = new ReactiveDict();

    // this.options.set("options", ["league5_0", "daily4_0", "daily3_1", "ptqTop8", "ptqTop9_16", "ptqTop17_32"]);
    this.options.set("eventTypes", ["league5_0"]);
    this.options.set("timeSpan", "month");
    this.options.set("mainSideboard", "main");


    this.metaDecksNames = new ReactiveVar();
    this.metaArchetypes = new ReactiveVar();

    var that = this;

    this.autorun(function(){
        that.options.set("metaCards", false);
        that.subscribe('MetaByFormatTimeSpanOptions',
                        Router.current().params.format,
                        that.options.get("timeSpan"),
                        that.options.get("eventTypes"),
                        {
                            onReady : function(){
                                that.options.set("metaCards", true);
                                console.log("ready");
                            }
                        }
        );
    })

    this.autorun(function() {

        if(that.options.get("metaCards"))
        {
            if ($.fn.DataTable.isDataTable("#metaCardsNames")) {
                console.log("Destroy Table");
                $('#metaCardsNames').DataTable().clear();
                $('#metaCardsNames').DataTable().destroy({
                    remove : true
                });
                var $table = $("<table>", {id : "metaCardsNames", class : "display", cellSpacing: 0, width : "100%"});
                $(".js-appendTableMetaCardsNames").append($table);
            }

            var data = null;
            if(MetaCards.findOne()){
                data = MetaCards.findOne()[that.options.get("mainSideboard")];
            }

            $('#metaCardsNames').DataTable({
                data:  data,
                pageLength: 10,
                pagingType: "simple",
                order : [[1, "desc"]],
                dom :   "<'row'<'col-sm-12'tr>>" +
                        "<'row'<'col-sm-12'i>>" +
                        "<'row'<'col-sm-12'p>>",
                columns: [
                    {
                        title: "Name", render : function(data, type, row, meta){
                        return row._id;
                    }},
                    {
                        title: "%", render: function (data, type, row, meta) {
                        return prettifyPercentage(row.count/(MetaCards.findOne().totalDecks));
                    }
                    },
                    {
                        title: "AVG", render: function (data, type, row, meta) {
                        return Math.round(row.total/row.count * (10))/10;
                    }
                    },

                ]
            });
        }
    });
});

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
    'change input[role="typeCardCheckbox"]' : function(evt, tmp){
        var eventTypes = [];
        var checkboxes = tmp.findAll('input[role="typeCardCheckbox"].eventTypes:checked');
        for(var i = 0; i < checkboxes.length; i++){
            eventTypes.push(checkboxes[i].value);
        }
        tmp.options.set("eventTypes", eventTypes);
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
    'change input[name="mainSideboard"]' : function(evt, tmp){
        tmp.options.set("mainSideboard", $(evt.target).attr("value"));
    },
    'change input[name="timeSpan"]' : function(evt, tmp){
        tmp.options.set("timeSpan", $(evt.target).attr("value"));
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
