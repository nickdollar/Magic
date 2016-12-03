Template.metaCardTable.onCreated(function(){
    this.options = new ReactiveDict();

    // this.options.set("options", ["league5_0", "daily4_0", "daily3_1", "ptqTop8", "ptqTop9_16", "ptqTop17_32"]);
    this.options.set("eventTypes", ["league5_0", "daily4_0", "daily3_1"]);
    this.options.set("timeSpan", "month");
    this.options.set("mainSideboard", "main");

    var that = this;
    this.autorun(function(){
        that.options.set("metaCards", false);
        that.subscribe('MetaByFormatTimeSpanOptions',
            FlowRouter.getParam("format"),
            that.options.get("timeSpan"),
            that.options.get("eventTypes"),
            {
                onReady : function(){
                    that.options.set("metaCards", true);
                }
            }
        );
    });
});

Template.metaCardTable.helpers({

});


Template.metaCardTable.events({
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

Template.metaCardTable.onRendered(function(){
    var that = this;
    this.autorun(function() {

        if(that.options.get("metaCards"))
        {
            if ($.fn.DataTable.isDataTable("#metaCardTableTable")) {
                console.log("Destroy Table");
                $('#metaCardTableTable').DataTable().clear();
                $('#metaCardTableTable').DataTable().destroy({
                    remove : true
                });
                var $table = $("<table>", {id : "metaCardTableTable", class : "table table-sm", cellSpacing: 0, width : "100%"});
                $(".js-appendTableMetaCardTableTable").append($table);
            }

            var data = null;
            if(MetaCards.findOne()){
                data = MetaCards.findOne({timeSpan : that.options.get("timeSpan")})[that.options.get("mainSideboard")];
            }

            $('#metaCardTableTable').on( 'draw.dt', function () {
                $('.js-imagePopOverCards').popover({
                    html: true,
                    trigger: 'hover',
                    placement : "auto right",
                    content: function () {
                        var cardName = encodeURI($(this).data('name'));
                        cardName = cardName.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "%22;").replace(/'/g, "%27");
                        var linkBase = "http://plex.homolka.me.uk:10080/";
                        var finalDirectory = linkBase+cardName+".full.jpg";
                        // return '<div style="min-height: 200px"><img src="'+finalDirectory + '" /></div>';
                        return '<img src="'+finalDirectory +'" style="height: 310px; width: 223px" />';
                    }
                });
            })
                .DataTable({
                    data:  data,
                    language : {
                        //Showing 1 to 10 of 40 entries
                        info : "_START_ to _END_ of _TOTAL_"
                    },
                    pageLength: 8,
                    pagingType: "simple",
                    order : [[1, "desc"]],
                    dom :   "<'row'<'col-sm-12 tableHeight'tr>>" +
                    "<'row'<'col-sm-5'i><'col-sm-7'p>>",
                    columns: [
                        {
                            title: "Name", render : function(data, type, row, meta){
                            return '<div class="name js-imagePopOverCards" data-name="' + row._id + '">'+row._id+'</div>'
                                ;
                        }},
                        {
                            title: "%", render: function (data, type, row, meta) {
                            return prettifyPercentage(row.count/(MetaCards.findOne({timeSpan : that.options.get("timeSpan")}).totalDecks));
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
