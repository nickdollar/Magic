Template.selectADeck.onCreated(function(){
    this.options = new ReactiveDict();
});


formatDeckArchetypes = function(DecksArchetypes_id) {
    var decksArchetypesQuery = DecksArchetypes.findOne({_id : DecksArchetypes_id});
    var decksNameQuery = DecksNames.find({DecksArchetypes_id : DecksArchetypes_id}).fetch();

    var html = '<table class="table table-sm childTable">';
    decksNameQuery.forEach(function(decksNamesObj){
        html += '<tr>'+
            '<td></td>'+
            '<td class="tableName"><a href="/decks/' + FlowRouter.getParam("format") + '/' + DecksArchetypes.findOne({_id : DecksArchetypes_id}).name+'/'+ decksNamesObj.name +'">'+decksNamesObj.name+'</a></td>'+
            '<td class="tableMana">';

        var manas = getCssManaByNumberFromDeckNameById(decksNamesObj._id);
        manas.forEach(function(mana){
            html += "<div class='mana " + mana.mana + "'></div>";
        });
        html += '</td>'+
            '<td class="tableType">' + decksArchetypesQuery.type +'</td>';
        html += '</tr>';
    });
    html += "</table>";
    return html;
}

Template.selectADeck.onRendered(function(){
    $( "#slider-range" ).slider({
        range: true,
        min: 0,
        max: 2000,
        values: [ 0, 2000 ],
        slide: function( event, ui ) {
            $("#minAmount").text(ui.values[ 0 ]);
            $("#maxAmount").text(ui.values[ 1 ]);
            tablePriceSearch();
        }
    });

    $("#minAmount").text($( "#slider-range" ).slider( "values", 0 ));
    $("#maxAmount").text($( "#slider-range" ).slider( "values", 1 ));



    if ($.fn.DataTable.isDataTable("#archetypeListTable")) {
        $('#archetypeListTable').DataTable().clear();
        $('#archetypeListTable').DataTable().destroy({
            remove : true
        });
        var $table = $("<table>", {id : "archetypeListTable", class : "table table-sm", cellSpacing: 0, width : "100%"});

        // var test = '<table id = ""class="cell-border">';
        $(".js-archetypeListTable").append($table);
    }
    // debugger
    $('#archetypeListTable').DataTable({
        pageLength: 20,
        data: DecksArchetypes.find({format : FlowRouter.getParam("format")}).fetch(),
        order: [[ 1, "asc" ]],
        pagingType: "simple",
        dom :   "<'row'<'col-sm-12 tableHeight'tr>>" +
        "<'row'<'col-sm-6'i><'col-sm-6'p>>",
        columnDefs : [{
            targets : 0,
            createdCell : function(td, cellData, rowData, row, col){
                $(td).addClass("details-control");
                $(td).attr("data-_id", rowData._id);
            }
        },
            {
                orderable : false, targets : "_all"
            }],
        columns: [
            {
                width : "10px", data : function(row, type, val, meta){
                return "";
            }
            },
            {
                width : "200px",title: "name", data: "name", render : function(data, type, row, meta){
                if (type === 'filter') {
                    return data;
                }
                else if (type === 'display') {
                    var html = '<span><a href="/decks/' + FlowRouter.getParam("format") + '/' + replaceTokenWithDash(row.name) + '">'+ row.name + '</a></span>';
                    return html;
                }
                // 'sort', 'type' and undefined all just use the integer
                return data;

            },
                createdCell: function (td, cellData, rowData, row, col) {

                }
            },
            {
                title: "colors", render : function(data, type, row, meta){
                if (type === 'display') {
                    return getHTMLColorsFromArchetypes(row._id);
                }

                var manas = "";
                getColorsListFromArchetypes(row._id).forEach(function(manaObj){
                    manas += manaObj.mana;
                });
                return manas;
            }},
            {
                title: "Type", data: "type"
            }
        ]
    });

    this.autorun(()=>{
        $('#archetypeListTable').DataTable().clear()
            .rows.add(DecksArchetypes.find({format : FlowRouter.getParam("format")}).fetch())

            .draw();
        var table = $("#archetypeListTable").DataTable();

        $('#archetypeListTable tbody').on('click', 'td.details-control', function () {
            var decksArchetypes_id = $(this).attr("data-_id");
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            if (row.child.isShown()) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            } else {
                // Open this row
                row.child($(formatDeckArchetypes(decksArchetypes_id))).show();
                tr.addClass('shown');
            }
        });
    })

});

Template.selectADeck.events({
    'change .js-colorsOption input': function (evt, tmp) {
        tableColorsSearch();
    },
    'change .js-typeOptions input': function (evt, tmp) {
        tableTypeSearch();
    },
    'change .js-deckOrArchetype input': function (evt, tmp) {
        if($(evt.target).val() == "decks"){
            Session.set("deckOrArchetype", true);
        }else{
            Session.set("deckOrArchetype", false);
        }
    }
});

tableColorsSearch = function(){
    var table = $('#archetypeListTable').DataTable();


//COLORS
    var colorsOptions = {b : false, c : false, g : false, r : false, u : false,  w : false};
    var colorsRegex = "";
    var quantity = 0;

    if($("input:checked:radio[name=optionsRadio]").val() == "contain") {
        var colorsRegex = "(";
        var colorsArray = [];
        for(var key in colorsOptions){
            if($("input:checked[role=checkbox][value="+key+"]:checked").length > 0){
                quantity++;
                colorsArray.push(key);
            }
        }
        colorsRegex += colorsArray.join("|");
        colorsRegex += ")";
    }else{
        for(var key in colorsOptions){
            if($("input:checked[role=checkbox][value="+key+"]:checked").length > 0){
                quantity++;
                colorsRegex += "(?=.*" + key + ")";
            }
        }
        colorsRegex += "(?=\\b\\w{"+ quantity +"}\\b)" + colorsRegex;
    }

    if(quantity==0){
        colorsRegex = "^$";
    }

    table
        .column(2)
        .search(colorsRegex, true)
        .draw();
};

tableTypeSearch = function(){

    if(!Session.get("deckOrArchetype")){
        var table = $('#archetypeListTable').DataTable();
    }else{

        var table = $('#deckListTable').DataTable();
    }

    var typesOptions = ["aggro", "combo", "control"];
    var typeSelectedOptions = [];
    for(var i = 0; i < typesOptions.length; i++){
        if($("input:checked[role=checkbox][value=" + typesOptions[i] + "]:checked").length) {
            typeSelectedOptions.push(typesOptions[i]);
        }
    }

    var typeOptionsRegex = typeSelectedOptions.join("|");
    if(typeOptionsRegex==""){
        typeOptionsRegex = "^$";
    }

    table.columns(3)
        .search(typeOptionsRegex, true)
        .draw();
}

tablePriceSearch = function(){

    var table = $('#archetypeListTable').DataTable();


    var min = parseInt($("#minAmount").text());
    var max = parseInt($("#maxAmount").text());

    // if(!Session.get("deckOrArchetype")){
        var minValues = table
            .column(4)
            .data()
            .filter(function(value, index){
                return parseInt(value) > min;
            }).join("|");

        var maxValues = table
            .column(5)
            .data()
            .filter(function(value, index){
                return parseInt(value) < max;
            }).join("|");
    // }

    // else{
    //     var price = "("
    //     price += table
    //         .column(4)
    //         .data()
    //         .filter(function(value, index){
    //             return parseInt(value) > min && parseInt(value) < max;
    //         }).join("|");
    //     price += ")"
    // }

    var regex = true;
    if(minValues=="" || maxValues==""){
        regex = false;
    }
    table.columns(4)
        .search(minValues, regex)
        .draw();

    table.columns(5)
        .search(maxValues, regex)
        .draw();

};