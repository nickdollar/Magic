Template.dataTableNewMetaTable.onCreated(function(){
    this.options = new ReactiveDict();

    // this.options.set("eventTypes, ["league5_0", "daily4_0", "daily3_1", "ptqTop8", "ptqTop9_16", "ptqTop17_32"]);
    this.options.set("eventTypes", ["league5_0"]);
    this.options.set("decksMetaSpan", "month");
    this.options.set("decksOrArchetypes", "archetypes");
    this.options.set("positionChange", "week");


    this.metaDecksNames = new ReactiveVar();
    this.metaArchetypes = new ReactiveVar();


    this.options.set("meta", false);
    this.options.set("decksNames", false);
    this.options.set("decksArchetypes", false);

    var that = this;

    this.autorun(function(){
        console.log("testMeta");
        that.options.set("meta", false);
        that.subscribe('testMeta',
            Router.current().params.format,
            that.options.get("decksMetaSpan"),
            that.options.get("eventTypes"),
            {
                onReady : function(){
                    console.log("testDecksData");
                    that.options.set("meta", true);
                }
            }
        );
    })

    this.autorun(function(){
        console.log("decksNames");
        that.options.set("decksNames", false);
        that.subscribe('testDecksNames', Router.current().params.format,
            {
                onReady : function(){
                    that.options.set("decksNames", true);
                }
            }
        );
    })

    this.autorun(function(){
        console.log("decksArchetypes");
        that.options.set("decksArchetypes", false);
        that.subscribe('testDecksArchetypes', Router.current().params.format,
            {
                onReady : function(){
                    that.options.set("decksArchetypes", true);
                }
            }
        );
    })


    this.autorun(function() {
        if(that.options.get("decksArchetypes") && that.options.get("decksNames") && that.options.get("meta"))
        {

            if ($.fn.DataTable.isDataTable("#metaDecksNames")) {
                console.log("Destroy Table");
                $('#metaDecksNames').DataTable().clear();
                $('#metaDecksNames').DataTable().destroy({
                    remove : true
                });
                var $table = $("<table>", {id : "metaDecksNames", class : "display", cellSpacing: 0, width : "100%"});
                $(".js-appendTable").append($table);
            }
            if (that.options.get("decksOrArchetypes") == "archetypes") {
                $('#metaDecksNames').DataTable({
                    data:  Meta.findOne().DecksArchetypesMeta,
                    pageLength: 20,
                    order : [[0, "asc"]],
                    dom :   "<'row'<'col-sm-12'tr>>" +
                            "<'row'<'col-sm-12'i>>" +
                            "<'row'<'col-sm-12'p>>",
                    columns: [
                        {title: "", className: "AAAAA", width : "0px", render : function(data, type, row, meta){
                            return row.position;
                        }},
                        {title: "Name", render : function(data, type, row, meta){
                            var change = "";
                            if(row.positions[that.options.get("positionChange")]==0){
                                change = "square";
                            }else if(row.positions[that.options.get("positionChange")] >0){
                                change = "upArrow";
                            }else{
                                change = "downArrow";
                            }
                            var html = "";
                            html += '<span>' + DecksArchetypes.findOne({_id : row._id}).name + '</span>';
                            html += '<div class="positionChange"><span>' + row.positions[that.options.get("positionChange")] + '</span><span class="jj ' + change +'"></span></div>';
                            return html;
                            return DecksArchetypes.findOne({_id : row._id}).name;
                        }},
                        {title: "percentage", data: "percentage", render: function (data, type, row, meta) {
                            if(Meta.findOne({}).totalDecks == 0) return 0 +"%";
                            return prettifyPercentage(row.quantity/Meta.findOne({}).totalDecks) + "%";
                        }},
                        {title: "Colors", data: "colors", render: function (data, type, row, meta) {
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
            }
            else {
                $('#metaDecksNames').DataTable({
                    data: Meta.findOne() && Meta.findOne().DecksNamesMeta,
                    pageLength: 20,
                    order : [[0, "desc"]],
                    dom :   "<'row'<'col-sm-12'tr>>" +
                            "<'row'<'col-sm-12'i>>" +
                            "<'row'<'col-sm-12'p>>",
                    columns: [
                        {title: "", width: "30px", render : function(data, type, row, meta){
                            return row.position;
                        }},
                        {title: "Name", render : function(data, type, row, meta){
                            var html = "";
                            html += "<div>" + DecksNames.findOne({_id : row._id}).name + "</div>";
                            html += "<div>" + + "</div>";
                            return DecksNames.findOne({_id : row._id}).name;
                        }},
                        {
                            title: "percentage", render: function (data, type, row, meta) {
                            if(Meta.findOne({}).totalDecks == 0) return 0 +"%";
                            return prettifyPercentage(row.quantity/Meta.findOne({}).totalDecks) + "%";
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
                        //     var totalBlocks = Meta.findOne({}).totalDecksBlocks;
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

format = function(archetype) {
    var decksNameQuery = _deckArchetypes.findOne({archetype : archetype}).deckNames.map(function(obj){
        return obj.name;
    });
    var deckQuery = _DeckNames.find({name : {$in : decksNameQuery}}).fetch();
    var decksValuesQuery = _MetaValues.find({option : "deck", name : {$in : decksNameQuery}, date : Session.get('date'), type : Session.get("types")}, {sort : {percentage : -1}}).fetch();
    var html = "";
    decksValuesQuery.forEach(function(decksValuesOueryObj){
        var deck = deckQuery.find(function( deckQueryObj ) {
            return deckQueryObj.name == decksValuesOueryObj.name;
            });
        var deckInfo = _DeckNames.findOne({format : "modern", name : decksValuesOueryObj.name});
        var upDownEqual = decksValuesOueryObj.positionUpDownEqual[decksValuesOueryObj.positionUpDownEqual.length - 1];
        var positionWeekChange = decksValuesOueryObj.positionWeekChange[decksValuesOueryObj.positionWeekChange.length - 1];

        html += '<tr>'+
                '<td></td>'+
                '<td class="tablePosition">' + decksValuesOueryObj.position +'</td>'+
                '<td class="tableName"><span>' + decksValuesOueryObj.name +'</span>'+
                '<div class="positionChange"><span>' + absoluteValue(positionWeekChange) + '</span><span class=' + upDownEqual + '></span></div>' +
                '<td class="tableMana">';

        var manas = getManaCss(deck.colors, "deck");
        manas.forEach(function(mana){
            html += "<span class='mana " + mana.mana + "'></span>";
        });

        html += '</td>'+
                    '<td class="tablePercentage">' + prettifyPercentage(decksValuesOueryObj.percentage) +'%</td>'+
                    '<td class="tablePrice"  colspan="2">$' + deck.price +'</td>' +
                    '<td class="tablePrice">' + deck.type +'</td>';

        var blocks = [];
        for(var i = decksValuesOueryObj.weekAddChange.length - 5; i < decksValuesOueryObj.weekAddChange.length; i++ ){
            blocks.push({color : decksValuesOueryObj.weekAddChange[i], change : prettifyPercentage(decksValuesOueryObj.weekAddNegPosChange[i], 2),  value : prettifyPercentage(decksValuesOueryObj.weekAddPercentage[i], 2), week : "AAA"});
        }
        html += "<td class='blocks'>" +
                "<div class='graph'>";
        blocks.forEach(function(blockObj){
            html += "<div class='bar " + blockObj.color + "' data-change='" + blockObj.change + "' data-value='" + blockObj.value + "' data-week='" + blockObj.week + "' data-color='" + blockObj.color + "'></div>";
        });

        html += '</tr>';
    });
    return html;
}

Template.dataTableNewMetaTable.onRendered(function(){

    // $('#metaDecksNames').DataTable({
    //     data: null,
    //     pageLength : 20,
    //     columns : [
    //         {title : "Name", data : "deckName"},
    //         {title : "percentage", data : "percentage", render : function(data, type, row, meta){
    //             return prettifyPercentage(data) + "%";
    //         }},
    //         {title : "Colors", data : "colors", render : function(data, type, row, meta){
    //             return getCssManaFromDeck(data)
    //         }},
    //         // {title : "Type", data : "type"},
    //     ]
    // });

});

Template.dataTableNewMetaTable.events({
    'click .updateMeta' : function(evt, tmp){

    },
    'change input[role="checkbox"]' : function(evt, tmp){
        var types = [];
        var checkboxes = tmp.findAll('input[role="checkbox"].metaCheckBox:checked');

        for(var i =0; i < checkboxes.length; i++){
            types.push(checkboxes[i].value);
        }

        console.log(types);
        Meteor.call('getDeckMeta', options, function (error, data) {
            if (error) {
                console.log(error);
                return;
            }
            Session.set("metaDecks", data);
        });
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
        tmp.options.set("eventTypes", types);
    },
    'change input[name="decksMetaSpan"]' : function(evt, tmp){
        tmp.options.set("decksMetaSpan", $(evt.target).attr("value"));
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