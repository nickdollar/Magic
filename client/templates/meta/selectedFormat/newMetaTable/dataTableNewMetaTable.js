Template.dataTableNewMetaTable.onCreated(function(){
    this.options = new ReactiveDict();

    // this.options.set("eventTypes, ["league5_0", "daily4_0", "daily3_1", "ptqTop8", "ptqTop9_16", "ptqTop17_32"]);
    this.options.set("eventTypes", ["league5_0", "daily4_0", "daily3_1"]);
    this.options.set("decksMetaSpan", "month");
    this.options.set("decksOrArchetypes", "archetypes");
    this.options.set("positionChange", "week");
    var that = this;
    this.autorun(function(){
        that.options.set("metaFormatTimeSpanOptionsNonReactive", false);
        
        that.subscribe("metaFormatTimeSpanOptionsNonReactive", FlowRouter.getParam("format"), that.options.get("decksMetaSpan"), that.options.get("eventTypes"), {
            onReady : function(){
                that.options.set("metaFormatTimeSpanOptionsNonReactive", true)
            }
        })
    })
});



Template.dataTableNewMetaTable.onRendered(function(){
    var that = this;


    this.autorun(function() {

        if ($.fn.DataTable.isDataTable("#dataTableNewMetaTableTable")) {
            $('#dataTableNewMetaTableTable').DataTable().clear();
            $('#dataTableNewMetaTableTable').DataTable().destroy({
                remove : true
            });
            var $table = $("<table>", {id : "dataTableNewMetaTableTable", class : "table table-sm", cellSpacing: 0, width : "100%"});
            $(".js-dataTableNewMetaTableTable").append($table);
        }

        if(that.options.get("metaFormatTimeSpanOptionsNonReactive")){
            if (that.options.get("decksOrArchetypes") == "archetypes") {
                var preData = null;
                if(Meta.findOne({format : FlowRouter.getParam("format"), timeSpan : that.options.get("decksMetaSpan")}, {reactive : false})){
                    preData = Meta.findOne({format : FlowRouter.getParam("format"), timeSpan : that.options.get("decksMetaSpan")}, {reactive : false}).DecksArchetypesMeta;
                }

                var data = [];
                for(var i = 0; i < preData.length; i++){
                    if(DecksArchetypes.findOne({_id : preData[i]._id})){
                        data.push(preData[i]);
                    }
                }

                $('#dataTableNewMetaTableTable').DataTable({
                    data:  data,
                    pageLength: 21,
                    pagingType : "simple",
                    order : [[1, "asc"]],
                    dom :   "<'row'<'col-sm-12 tableHeight'tr>>" +
                    "<'row'<'col-sm-6'i><'col-sm-6'p>>",
                    columnDefs : [
                        {
                            className: "dt-center", targets: [3, 4]
                        },
                        {
                            targets : 0,
                            createdCell : function(td, cellData, rowData, row, col){
                                $(td).addClass("details-control");
                                $(td).attr("data-_id", rowData._id);
                            }
                        }],
                    columns: [
                        {title: "", orderable : false, width : "10px", data : function(data, type, row, meta){
                            return "";
                        }},
                        {title: "", width : "0px", render : function(data, type, row, meta){
                            return row.position;
                        }},
                        {title: "Name", width: "215px", render : function(data, type, row, meta){
                            var change = "";
                            if(row.positions[that.options.get("positionChange")]==999){
                                change = "";
                            }else if(row.positions[that.options.get("positionChange")]==0){
                                change = "square";
                            }else if(row.positions[that.options.get("positionChange")] >0){
                                change = "upArrow";
                            }else{
                                change = "downArrow";
                            }
                            var archetypeName = DecksArchetypes.findOne({_id : row._id}).name;

                            var position = row.positions[that.options.get("positionChange")]
                            if(row.positions[that.options.get("positionChange")]==999){
                                position = "NEW";
                            }


                            var html = "";
                            html += '<span><a href="/decks/' + FlowRouter.getParam("format") + '/' + replaceTokenWithDash(archetypeName) + '">'+ archetypeName + '</a></span>';
                            html += '<div class="positionChange"><span>' + position + '</span><span class="' + change +'"></span></div>';
                            return html;
                        }},
                        {title: "percentage", orderable : false, data: "percentage", render: function (data, type, row, meta) {
                            if(Meta.findOne({format : FlowRouter.getParam("format"), timeSpan : that.options.get("decksMetaSpan")}, {reactive : false}).totalDecks == 0) return 0 +"%";
                            return prettifyPercentage(row.quantity/Meta.findOne({format : FlowRouter.getParam("format"), timeSpan : that.options.get("decksMetaSpan")}, {reactive : false}).totalDecks) + "%";
                        }},
                        {title: "Colors",  width: "98px", orderable : false, data: "colors", render: function (data, type, row, meta) {
                            return getHTMLColorsFromArchetypes(row._id);
                        }},
                        {title : "Type", render : function(data, type, row, meta){
                            return DecksArchetypes.findOne({_id : row._id}).type;
                        }},
                        // {title : "Blocks", render : function(data, type, row, meta){
                        //     var totalBlocks = Meta.findOne({}).totalDecksBlocks;
                        //     var html = "";
                        //     html += '<div class="graph">';
                        //     for(var i = 1; i < row.blocks.length; ++i){
                        //         var pastWeek = row.blocks[i-1]/totalBlocks[i-1];
                        //         var week = row.blocks[i]/totalBlocks[i];
                        //         var change = week - pastWeek;
                        //         html += '<div class="bar" data-change="' + change + '" data-value="' + week + '" data-week="' + week +'" data-color="black"></div>';
                        //     }
                        //     html += '</div>'
                        //     return html;
                        // }}
                    ]

                });

                var table = $("#dataTableNewMetaTableTable").DataTable();

                $('#dataTableNewMetaTableTable tbody').on('click', 'td.details-control', function () {
                    var decksArchetypes_id = $(this).attr("data-_id");
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    if ( row.child.isShown() ) {
                        // This row is already open - close it
                        row.child.hide();
                        tr.removeClass('shown');
                    } else {
                        // Open this row
                        row.child($(formatDeckArchetypesMeta(decksArchetypes_id, that))).show();
                        tr.addClass('shown');
                    }
                });

            }
            else {
                var preData = null;
                if(Meta.findOne({format : FlowRouter.getParam("format"), timeSpan : that.options.get("decksMetaSpan")}, {reactive : false})){
                    preData = Meta.findOne({format : FlowRouter.getParam("format"), timeSpan : that.options.get("decksMetaSpan")}, {reactive : false}).DecksNamesMeta;
                }

                var data = [];
                for(var i = 0; i < preData.length; i++){
                    if(DecksNames.findOne({_id : preData[i]._id})){
                        data.push(preData[i]);
                    }
                }

                $('#dataTableNewMetaTableTable').DataTable({
                    data: data,
                    pageLength: 21,
                    pagingType : "simple",
                    order : [[0, "asc"]],
                    dom :   "<'row'<'col-sm-12'tr>>" +
                    "<'row'<'col-sm-12'i>>" +
                    "<'row'<'col-sm-12'p>>",
                    columns: [
                        {title: "", width: "30px", render : function(data, type, row, meta){
                            return row.position;
                        }},
                        {title: "Name", render : function(data, type, row, meta){
                            var change = "";
                            if(row.positions[that.options.get("positionChange")]==0 ||row.positions[that.options.get("positionChange")]==999){
                                change = "square";
                            }else if(row.positions[that.options.get("positionChange")] >0){
                                change = "upArrow";
                            }else{
                                change = "downArrow";
                            }

                            var position = row.positions[that.options.get("positionChange")];
                            if(row.positions[that.options.get("positionChange")]==999){
                                position = "NEW";
                            }

                            var html = "";
                            html += '<span><a href="/decks/' + FlowRouter.getParam("format") +'/'+ DecksNames.findOne({_id : row._id}).name +'">'+DecksNames.findOne({_id : row._id}).name+ '</a></span>';
                            html += '<div class="positionChange"><span>' + position + '</span><span class="jj ' + change +'"></span></div>';
                            return html;
                        }},
                        {
                            title: "percentage", render: function (data, type, row, meta) {
                            if(Meta.findOne({timeSpan : that.options.get("decksMetaSpan")}, {reactive : false}).totalDecks == 0) return 0 +"%";
                            return prettifyPercentage(row.quantity/Meta.findOne({format : FlowRouter.getParam("format"), timeSpan : that.options.get("decksMetaSpan")}, {reactive : false}).totalDecks) + "%";
                        }
                        },
                        {
                            title: "Colors", render: function (data, type, row, meta) {
                            return getHTMLColors(DecksNames.findOne({_id : row._id}).colors)
                        }
                        },
                        {title : "Type", render : function(data, type, row, meta){
                            return DecksArchetypes.findOne({_id : DecksNames.findOne({_id : row._id}).DecksArchetypes_id}).type;
                        }
                        },
                        // {title : "Blocks", render : function(data, type, row, meta){
                        //     var totalBlocks = Meta.findOne({timeSpan : that.options.get("decksMetaSpan")}).totalDecksBlocks;
                        //     var html = "";
                        //     html += '<div class="graph">';
                        //     for(var i = 1; i < row.blocks.length; ++i){
                        //         var pastWeek = row.blocks[i-1]/totalBlocks[i-1];
                        //         var week = row.blocks[i]/totalBlocks[i];
                        //         var change = week - pastWeek;
                        //         html += '<div class="bar" data-change="' + change + '" data-value="{{value}}" data-week="' + week +'" data-color="{{color}}"></div>';
                        //     }
                        //     html += '</div>'
                        //     return html;
                        //     // return DecksArchetypes.findOne({_id : DecksNames.findOne({_id : row._id}).DecksArchetypes_id}).type;
                        // }
                        // },

                    ]
                });
            }
        }

    });

});

Template.dataTableNewMetaTable.events({
    'click .updateMeta' : function(evt, tmp){

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
    'mouseenter .bar' : function(evt, tmp){

        var html =  '<div class="changePercentageBlock">' +
            '    <span class="value">' + $(evt.target).attr('data-value') + '%</span>' +
            '    <div>' +
            '    <span class="change '+$(evt.target).attr("data-color") +'">' + $(evt.target).attr("data-change") + '%</span>' +
            '    </div>' +
            '</div>';
        $(html).appendTo('body');
        $(".changePercentageBlock").show();
    },
    'mouseleave .bar' : function(evt,tmp){
        $(".changePercentageBlock").remove();
    },
    'mousemove .bar' : function(evt,tmp){
        $(".changePercentageBlock").css({
            top: evt.pageY + 10 + 'px',
            left: evt.pageX + 10 + 'px'
        });
    },
    'change input[role="typeCheckbox"]' : function(evt, tmp){
        var types = [];
        var checkboxes = tmp.findAll('input[role="typeCheckbox"].metaCheckBox:checked');

        for(var i =0; i < checkboxes.length; i++){
            types.push(checkboxes[i].value);
        }
        console.log(types);
        tmp.options.set("eventTypes", types);
    },
    'change input[name="decksMetaSpan"]' : function(evt, tmp){
        tmp.options.set("decksMetaSpan", $(evt.target).attr("value"));
        console.log($(evt.target).attr("value"));
    },
    'change input[name="decksOrArchetypes"]' : function(evt, tmp){
        tmp.options.set("decksOrArchetypes", $(evt.target).attr("value"));
    },
    'change input[name="positionChange"]' : function(evt, tmp){
        tmp.options.set("positionChange", $(evt.target).attr("value"));
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


formatDeckArchetypesMeta = function(DecksArchetypes_id, Template) {

    var that = Template;
    var decksArchetypesQuery = DecksArchetypes.findOne({_id : DecksArchetypes_id});
    var decksNameQuery = DecksNames.find({DecksArchetypes_id : DecksArchetypes_id}).fetch();

    var html = '<table class="table table-sm metaDecksNamesChild">';

    var decksPositions = [];

    decksNameQuery.forEach(function(decksNamesObj) {
        var test = Meta.findOne({format : FlowRouter.getParam("format"), timeSpan : that.options.get("decksMetaSpan")}, {reactive : false}).DecksNamesMeta.find(function (deckNameFindObj) {
            return decksNamesObj._id == deckNameFindObj._id;
        });
        decksPositions.push(test);
    });

    decksPositions.sort(function(a, b){
        return b.quantity - a.quantity
    })

    decksPositions.forEach(function(decksPositionsObj) {

        var change = "";
        if(decksPositionsObj.positions[that.options.get("positionChange")]==0){
            change = "square";
        }else if(decksPositionsObj.positions[that.options.get("positionChange")] >0){
            change = "upArrow";
        }else{
            change = "downArrow";
        }

        html += '<tr>'+
            '<td></td>'+
            '<td>'+ decksPositionsObj.position +'</td>'+
            '<td class="tableName">' +
            '<span><a href="/decks/' + FlowRouter.getParam("format") +'/' + DecksArchetypes.findOne({_id : DecksArchetypes_id}).name +'/' +replaceTokenWithDash(DecksNames.findOne({_id : decksPositionsObj._id}).name) + '">'+ DecksNames.findOne({_id : decksPositionsObj._id}).name+'</a></span>'+
            '<div class="positionChange"><span>' + decksPositionsObj.positions[that.options.get("positionChange")] + '</span><span class="jj ' + change +'"></span></div>'+
            '</td>';

        var percentage;
        if(Meta.findOne({format : FlowRouter.getParam("format"), timeSpan : that.options.get("decksMetaSpan")}, {reactive : false}).totalDecks == 0){
            percentage = 0;
        }else{
            percentage = prettifyPercentage(decksPositionsObj.quantity/Meta.findOne({format : FlowRouter.getParam("format"), timeSpan : that.options.get("decksMetaSpan")}, {reactive : false}).totalDecks) + "%";
        }

        html +='<td>'+ percentage +'</td>';
        html +='<td class="dt-center">';

        var manas = getCssManaByNumberFromDeckNameById(decksPositionsObj._id);
        manas.forEach(function(mana){
            html += "<div class='mana " + mana.mana + "'></div>";
        });
        html += '<td class="tableType">' + decksArchetypesQuery.type +'</td>';
        html += '</tr>';
    });

    html += "</table>";
    return html;
}

