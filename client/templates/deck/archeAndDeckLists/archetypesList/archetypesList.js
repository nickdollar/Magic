Template.archetypesList.helpers({
    archetypesName : function(){
        return _deckArchetypes.find({format : Router.current().params.format, deckNames : { $ne : []}});
    },
    archetypeLinkFix : function(){
        return this.archetype.replace(/ /g, "-");
    },
    deckName : function(){
        return this.deckNames[0].name.replace(/ /g,"-");
    }
});


formatDeckArchetypes = function(archetype) {
    var decksNameQuery = _deckArchetypes.findOne({archetype : archetype}).deckNames.map(function(obj){
        return obj.name;
    });

    var deckQuery = _DeckNames.find({name : {$in : decksNameQuery}}).fetch();

    var html = "";
    deckQuery.forEach(function(deckQueryObj){
        html += '<tr>'+
                    '<td></td>'+
                    '<td class="tableName">' + deckQueryObj.name +'</td>'+
                    '<td class="tableMana">';

        var manas = getManaCss(deckQueryObj.colors, "deck");
        manas.forEach(function(mana){
            html += "<div class='mana " + mana.mana + "'></div>";
        });
        html += '</td>'+
            '<td class="tablePrice">' + deckQueryObj.type +'</td>' +
            '<td class="tablePrice"  colspan="2">$' + deckQueryObj.price +'</td>';
        html += '</tr>';
    });
    return html;
}

Template.archetypesList.onRendered(function(){
    var table = $("#archetypeListTable").DataTable({
        pageLength : 25,
        //search : {
        //    regex : true
        //},
        dom : "<'row'<'col-xs-12't>>" +
              "<'row'<'col-xs-12'p>>"
    });


    $('#archetypeListTable tbody').on('click', 'td.details-control', function () {
        var archetypeName = $(this).attr("data-name"),
            tr = $(this).closest('tr'),
            row = table.row( tr );
        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            row.child($(formatDeckArchetypes(archetypeName))).show();
            tr.addClass('shown');
        }
    });
    tableColorsSearch();
    tableTypeSearch();
    tablePriceSearch();
});