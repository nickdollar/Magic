Template.archetypesList.helpers({
    DecksArchetypes : function(){
        return DecksArchetypes.find({format : Router.current().params.format});
    },
    dataSearchColors : function(){
        return getCssManaByNumberFromDeckName(this._id);
    },
    getCssColorsFromArchetypes : function(){
        return getCssColorsFromArchetypes(this._id);
    }
});

formatDeckArchetypes = function(archetype) {
    var decksNameQuery = DecksArchetypes.findOne({name : archetype});
    if(decksNameQuery.DecksNames == null) return "";
    if(!decksNameQuery.DecksNames.length) return "";
    var decksNames = DecksNames.find({$or : decksNameQuery.DecksNames}).fetch();

    var html = "";
    decksNames.forEach(function(decksNamesObj){
        html += '<tr>'+
                    '<td></td>'+
                    '<td class="tableName">' + decksNamesObj.name +'</td>'+
                    '<td class="tableMana">';

        var manas = getCssManaByNumberFromDeckName(decksNamesObj._id);
        manas.forEach(function(mana){
            html += "<div class='mana mana-" + mana.mana + "'></div>";
        });
        html += '</td>'+
            '<td class="tablePrice">' + decksNameQuery.type +'</td>' +
            '<td class="tablePrice"  colspan="2">$' + 500 +'</td>';
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
    // tableColorsSearch();
    // tableTypeSearch();
    // tablePriceSearch();
});