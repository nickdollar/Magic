Template.metaCardTable.onCreated(function(){
    this.options = new ReactiveDict();

    this.options.set("eventTypes", ["league5_0", "daily3_1", "daily4_0", "MTGOPTQ1-8", "MTGOPTQ9-16", "MTGOPTQ17+", "GP1-8", "GP9-16", "GP17+", "SCGSuperIQ", "SCGOpen1-8", "SCGOpen9-16", "SCGOpen17+", "InviQualifier", "SCGInvitational", "SCGClassic1-8", "SCGClassic9+", "LegacyChamps", "WorldMagicCup"]);
    this.options.set("timeSpan", "month");
    this.options.set("mainSideboard", "main");
    this.values = new ReactiveVar();
    this.autorun(()=>{
        this.options.set("metaCards", false);
        // this.subscribe('MetaByFormatTimeSpanOptions',
        //     FlowRouter.getParam("format"),
        //     this.options.get("timeSpan"),
        //     this.options.get("eventTypes"),
        //     {
        //         onReady : function(){
        //             this.options.set("metaCards", true);
        //         }
        //     }
        // );



        Meteor.call("getMetaCards", FlowRouter.getParam("format"), this.options.get("eventTypes"), this.options.get("timeSpan"),this.options.get("mainSideboard"), (error, result)=>{
            if(error){
                console.log(error);
            }else{
                this.options.set("metaCards", true);
                this.values.set(result);
            }
        });
    });
});

Template.metaCardTable.helpers({

});


Template.metaCardTable.events({
    'change input[role="typeCardCheckbox"]' : function(evt, tmp){
        var eventTypes = [];
        var checkboxes = tmp.findAll('input[role="typeCardCheckbox"]:checked');
        for(var i = 0; i < checkboxes.length; i++){
            eventTypes.push(checkboxes[i].value);
        }
        tmp.options.set("eventTypes", eventTypes);
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

            // if ($.fn.DataTable.isDataTable("#metaCardTableTable")) {
            //     console.log("Destroy Table");
            //     $('#metaCardTableTable').DataTable().clear();
            //     $('#metaCardTableTable').DataTable().destroy({
            //         remove : true
            //     });
            //     var $table = $("<table>", {id : "metaCardTableTable", class : "table table-sm", cellSpacing: 0, width : "100%"});
            //     $(".js-appendTableMetaCardTableTable").append($table);
            // }

            $('#metaCardTableTable').on( 'draw.dt', function () {
                $('.js-imagePopOverCards').popover({
                    html: true,
                    trigger: 'hover',
                    placement : "auto right",
                    content: function () {
                        var cardName = encodeURI($(this).data('name'));
                        cardName = cardName.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "%22;").replace(/'/g, "%27");
                        var linkBase = "https://mtgcards.file.core.windows.net/cards/";
                        var key = "?sv=2015-12-11&ss=f&srt=o&sp=r&se=2017-07-01T10:06:43Z&st=2017-01-03T02:06:43Z&spr=https&sig=dKcjc0YGRKdFH441ITFgI5nhWLyrZR6Os8qntzWgMAw%3D";

                        var finalDirectory = linkBase+cardName+".full.jpg" + key;
                        return '<img src="'+finalDirectory +'" style="height: 310px; width: 223px"/>';
                    }
                });
            })
                .DataTable({
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
                            title: "Name", width : "230px", render : function(data, type, row, meta){
                            return '<div class="name js-imagePopOverCards" data-name="' + row._id + '">'+row._id+'</div>';
                        }},
                        {
                            title: "%", render: (data, type, row, meta)=> {
                            return prettifyPercentage(row.count/this.values.get().totalDecks);
                        }
                        },
                        {
                            title: "AVG", width :"30px", render: function (data, type, row, meta) {
                            return Math.round(row.total/row.count * (10))/10;
                        }
                        },

                    ]
                });


    this.autorun(()=>{
        if(this.options.get("metaCards"))
        {
            $('#metaCardTableTable').DataTable().clear()
                .rows.add(this.values.get().cards)
                .draw();
        }
    })





});
