Template.dataTableNewMetaTable.onCreated(function(){
    this.options = new ReactiveDict();
    this.options.set("eventTypes", ["league5_0", "daily3_1", "daily4_0", "MTGOPTQ1-8", "MTGOPTQ9-16", "MTGOPTQ17+", "GP1-8", "GP9-16", "GP17+", "SCGSuperIQ", "SCGOpen1-8", "SCGOpen9-16", "SCGOpen17+", "InviQualifier", "SCGInvitational", "SCGClassic1-8", "SCGClassic9+", "LegacyChamps", "WorldMagicCup"]);
    this.options.set("decksMetaSpan", "month");
    this.options.set("decksOrArchetypes", "archetypes");
    this.options.set("positionChange", "week");
    this.options.set("callbackFlag", false);
    this.value = new ReactiveVar();

    // this.autorun(()=>{
    //     this.options.set("metaFormatTimeSpanOptionsNonReactive", false);
    //     this.subscribe("metaFormatTimeSpanOptionsNonReactive", FlowRouter.getParam("format"), this.options.get("decksMetaSpan"), this.options.get("eventTypes"), {
    //         onReady : ()=>{
    //             this.options.set("metaFormatTimeSpanOptionsNonReactive", true)
    //         }
    //     })
    // })

    this.autorun(()=>{
        this.options.set("values", false);
        // this.subscribe("metaFormatTimeSpanOptionsNonReactive", FlowRouter.getParam("format"), this.options.get("decksMetaSpan"), this.options.get("eventTypes"), {
        //     onReady : function(){
        //         this.options.set("metaFormatTimeSpanOptionsNonReactive", true)
        //     }
        // })

        Meteor.call("getMetaAllArchetypes", FlowRouter.getParam("format"), this.options.get("eventTypes"), this.options.get("decksMetaSpan"), this.options.get("positionChange"), (error, result)=>{
            if(error){
                console.log(error);
            }else{
                this.options.set("values", true);
                this.value.set(result);
            }
        });
    })
});



Template.dataTableNewMetaTable.onRendered(function(){
    console.log("BBBBBBBBBBBBBBBBBBBB");
    $('#metaCardTableArchetype').DataTable({
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
            {title: "", orderable : false, width : "10px", data : (data, type, row, meta)=>{
                return "";
            }},
            {title: "", width : "0px", render : (data, type, row, meta)=>{
                return row.position;
            }},
            {title: "Name", width: "215px", render : (data, type, row, meta)=>{
            console.log(row);
                var change = "";
                if(row.positionChange== 999){
                    change = "";
                }else if(row.positionChange== 0){
                    change = "square";
                }else if(row.positionChange > 0){
                    change = "upArrow";
                }else{
                    change = "downArrow";
                }
                var archetypeName = DecksArchetypes.findOne({_id : row._id}).name;

                var position = row.positionChange;
                if(row.positionChange==999){
                    position = "NEW";
                }


                var html = "";
                html += '<span><a href="/decks/' + FlowRouter.getParam("format") + '/' + replaceTokenWithDash(archetypeName) + '">'+ archetypeName + '</a></span>';
                html += '<div class="positionChange"><span>' + position + '</span><span class="' + change +'"></span></div>';
                return html;
            }},
            {title: "percentage", orderable : false, data: "percentage", render: (data, type, row, meta)=> {
                // if(Meta.findOne({format : FlowRouter.getParam("format"), timeSpan : this.options.get("decksMetaSpan")}, {reactive : false}).totalDecks == 0) return 0 +"%";
                // return prettifyPercentage(row.quantity/Meta.findOne({format : FlowRouter.getParam("format"), timeSpan : this.options.get("decksMetaSpan")}, {reactive : false}).totalDecks) + "%";

                if(this.value.get().totalDecks == 0) return 0+"%";
                return prettifyPercentage(row.quantity/this.value.get().totalDecks) + "%";
            }},
            {title: "Colors",  width: "98px", orderable : false, data: "colors", render: (data, type, row, meta)=> {
                return getHTMLColorsFromArchetypes(row._id);
            }},
            {title : "Type", render : (data, type, row, meta)=>{
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
        ],
        "drawCallback" : function(){
            console.log("GGGGGGGGGBBBBBBBBBBBBBBBBBVVVVVVVVVVVVV");
            var that = Template.instance();
            if(!that.options.get("callbackFlag")){
                var table = $("#metaCardTableArchetype").DataTable();


                $('#metaCardTableArchetype tbody').on('click', 'td.details-control', function () {
                    var DecksArchetypes_id = $(this).attr("data-_id");
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    if ( row.child.isShown() ) {
                        // This row is already open - close it
                        row.child.hide();
                        tr.removeClass('shown');
                    } else {
                        // Open this row
                        Meteor.call("getMetaDecksNamesFromArchetype", FlowRouter.getParam("format"),
                            that.options.get("eventTypes"),
                            that.options.get("decksMetaSpan"),
                            DecksArchetypes_id,
                            (error, data)=>{
                                row.child($(formatDeckArchetypesMetaOnDeck(DecksArchetypes_id, that, data))).show();
                                tr.addClass('shown');
                            })


                    }
                });
                that.options.set("callbackFlag", true);
            }

        }
    });

    // $('#metaCardTableDecksNames').DataTable({
    //     pageLength: 21,
    //     pagingType : "simple",
    //     order : [[0, "asc"]],
    //     dom :   "<'row'<'col-sm-12 tableHeight'tr>>" +
    //     "<'row'<'col-sm-6'i><'col-sm-6'p>>",
    //     columns: [
    //         {title: "", width: "30px", render : (data, type, row, meta)=>{
    //             return row.position;
    //         }},
    //         {title: "Name", width: "215px",  render : (data, type, row, meta)=>{
    //             var change = "";
    //             if(row.positions[this.options.get("positionChange")]==0 ||row.positions[this.options.get("positionChange")]==999){
    //                 change = "square";
    //             }else if(row.positions[this.options.get("positionChange")] >0){
    //                 change = "upArrow";
    //             }else{
    //                 change = "downArrow";
    //             }
    //
    //             var position = row.positions[this.options.get("positionChange")];
    //             if(row.positions[this.options.get("positionChange")]==999){
    //                 position = "NEW";
    //             }
    //
    //             var html = "";
    //             html += '<span><a href="/decks/' + FlowRouter.getParam("format") +'/'+ DecksNames.findOne({_id : row._id}).name +'">'+DecksNames.findOne({_id : row._id}).name+ '</a></span>';
    //             html += '<div class="positionChange"><span>' + position + '</span><span class="jj ' + change +'"></span></div>';
    //             return html;
    //         }},
    //         {
    //             title: "percentage", render: (data, type, row, meta)=> {
    //             if(this.value.get().totalDecks == 0) return 0 +"%";
    //             return prettifyPercentage(row.quantity/this.value.get().totalDecks) + "%";
    //         }
    //         },
    //         {
    //             title: "Colors", width: "98px", render: (data, type, row, meta)=> {
    //             return getHTMLColors(DecksNames.findOne({_id : row._id}).colors)
    //         }
    //         },
    //         {title : "Type", render : (data, type, row, meta)=>{
    //             return DecksArchetypes.findOne({_id : DecksNames.findOne({_id : row._id}).DecksArchetypes_id}).type;
    //         }
    //         }
    //     ]
    // });
    
    this.autorun(()=> {
        if(this.options.get("values")) {

            var preDataArchetype = this.value.get().DecksArchetypesMeta;
            var dataArchetype = [];
            for(var i = 0; i < preDataArchetype.length; i++){
                if(DecksArchetypes.findOne({_id : preDataArchetype[i]._id})){
                    dataArchetype.push(preDataArchetype[i]);
                }
            }

            $('#metaCardTableArchetype').DataTable().clear()
                .rows.add(dataArchetype)
                .draw();


            // var preDataDecksNames = this.value.get().DecksNamesMeta;
            // var dataDecksNames = [];
            // for(var i = 0; i < preDataDecksNames.length; i++){
            //     if(DecksNames.findOne({_id : preDataDecksNames[i]._id})){
            //         dataDecksNames.push(preDataDecksNames[i]);
            //     }
            // }
            //
            // $('#metaCardTableDecksNames').DataTable().clear()
            //     .rows.add(dataDecksNames)
            //     .draw();
        }
    });
    this.autorun(()=>{
        if (this.options.get("decksOrArchetypes") == "archetypes") {
            $(".js-hideHideDecksNamesTable").hide();
            $(".js-hideHideArchetypesTable").show();
        }else{
            $(".js-hideHideArchetypesTable").hide();
            $(".js-hideHideDecksNamesTable").show();

        }
    })


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
        var checkboxes = tmp.findAll('input[role="typeCheckbox"]:checked');

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


formatDeckArchetypesMetaOnDeck = function(DecksArchetypes_id, template, data) {



      var html = '<table class="table table-sm metaDecksNamesChild">';

      var decksPositions = [];

      data.DecksNamesMeta.forEach(function(decksPositionsObj) {

          var change = "";
          if(decksPositionsObj.positionChange==0 || decksPositionsObj.positionChange==999){
              change = "square";
          }else if(decksPositionsObj.positionChange >0){
              change = "upArrow";
          }else{
              change = "downArrow";
          }

          if(decksPositionsObj.positionChange == 999){
              decksPositionsObj.positionChange = 0
          }

          html += '<tr>'+
              '<td></td>'+
              '<td>'+ decksPositionsObj.position +'</td>'+
              '<td class="tableName">' +
              '<span><a href="/decks/' + FlowRouter.getParam("format") +'/' + DecksArchetypes.findOne({_id : DecksArchetypes_id}).name +'/' +replaceTokenWithDash(DecksNames.findOne({_id : decksPositionsObj._id}).name) + '">'+ DecksNames.findOne({_id : decksPositionsObj._id}).name+'</a></span>'+
              '<div class="positionChange"><span>' + decksPositionsObj.positionChange + '</span><span class="jj ' + change +'"></span></div>'+
              '</td>';

          var percentage;
          if(Template.totalDecks == 0){
              percentage = 0;
          }else{
              percentage = prettifyPercentage(decksPositionsObj.quantity/template.value.get().totalDecks) + "%";
          }

          html +='<td>'+ percentage +'</td>';
          html +='<td class="dt-center">';

          var manas = getCssManaByNumberFromDeckNameById(decksPositionsObj._id);
          manas.forEach(function(mana){
              html += "<div class='mana " + mana.mana + "'></div>";
          });
          html += '<td class="tableType">' + DecksArchetypes.findOne({_id : DecksArchetypes_id}).type +'</td>';
          html += '</tr>';
      });

      html += "</table>";
      console.log(html);
      return html;
}

formatDeckArchetypesMeta = function(DecksArchetypes_id, template) {

    // Meteor.call("getMetaDecksNamesFromArchetype", FlowRouter.getParam("format"),
    //     template.options.get("eventTypes"),
    //     template.options.get("decksMetaSpan"),
    //     DecksArchetypes_id,template.options.get
    //
    //     });

    // var that = Template;
    // var decksArchetypesQuery = DecksArchetypes.findOne({_id : DecksArchetypes_id});
    // var decksNameQuery = DecksNames.find({DecksArchetypes_id : DecksArchetypes_id}).fetch();
    //
    // var html = '<table class="table table-sm metaDecksNamesChild">';
    //
    // var decksPositions = [];
    //
    // decksNameQuery.forEach(function(decksNamesObj) {
    //     var test = Template.value.get().DecksNamesMeta.find(function (deckNameFindObj) {
    //         return decksNamesObj._id == deckNameFindObj._id;
    //     });
    //     decksPositions.push(test);
    // });
    //
    // decksPositions.sort(function(a, b){
    //     return b.quantity - a.quantity
    // })
    //
    // decksPositions.forEach(function(decksPositionsObj) {
    //     console.log(decksPositionsObj);
    //     var change = "";
    //     if(decksPositionsObj.positions[that.options.get("positionChange")]==0){
    //         change = "square";
    //     }else if(decksPositionsObj.positions[that.options.get("positionChange")] >0){
    //         change = "upArrow";
    //     }else{
    //         change = "downArrow";
    //     }
    //
    //     html += '<tr>'+
    //         '<td></td>'+
    //         '<td>'+ decksPositionsObj.position +'</td>'+
    //         '<td class="tableName">' +
    //         '<span><a href="/decks/' + FlowRouter.getParam("format") +'/' + DecksArchetypes.findOne({_id : DecksArchetypes_id}).name +'/' +replaceTokenWithDash(DecksNames.findOne({_id : decksPositionsObj._id}).name) + '">'+ DecksNames.findOne({_id : decksPositionsObj._id}).name+'</a></span>'+
    //         '<div class="positionChange"><span>' + decksPositionsObj.positions[that.options.get("positionChange")] + '</span><span class="jj ' + change +'"></span></div>'+
    //         '</td>';
    //
    //     var percentage;
    //     if(Template.totalDecks == 0){
    //         percentage = 0;
    //     }else{
    //         percentage = prettifyPercentage(decksPositionsObj.quantity/Template.value.get().totalDecks) + "%";
    //     }
    //
    //     html +='<td>'+ percentage +'</td>';
    //     html +='<td class="dt-center">';
    //
    //     var manas = getCssManaByNumberFromDeckNameById(decksPositionsObj._id);
    //     manas.forEach(function(mana){
    //         html += "<div class='mana " + mana.mana + "'></div>";
    //     });
    //     html += '<td class="tableType">' + decksArchetypesQuery.type +'</td>';
    //     html += '</tr>';
    // });
    //
    // html += "</table>";
    // return html;
}
