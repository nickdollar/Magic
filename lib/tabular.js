import moment from "moment";
TabularTables = {};

TabularTables.eventSmallTableDatatables = new Tabular.Table({
    name : "eventSmallTable",
    collection: _Deck,
    columns : [
        {data : "result", title : "result", render : function(data, type, row, meta){
            return data.victory +"-"+data.loss;
        }},
        {data : "player", title : "player"},
        {data : "date", render : function(data, type, row, meta){
            return moment(data).format("MM/DD");
        }, title : "date"}
    ],
    createdRow : function(row, data, rowIndex){
        $.each($('td', row), function (colIndex) {
            if(colIndex == 2){
                $(this).attr('data-search', data.date.getTime());
            }

        });
    },
    searching : false,
    pagingType : "simple",
    //sub: new SubsManager(),
    pageLength : 5,
    selector: function( userId ) {
        return {eventType :"daily"};
    },
    dom : "<'row tableRow'<'col-sm-12't>>" +
          "<'row paginationRow'<'col-xs-7'i><'col-xs-5'p>>"
});

function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}


TabularTables.eventLargeTableDatatables = new Tabular.Table({
    name : "eventLargeTable",
    collection: _Deck,
    columns : [
        {data : "result", title : "result", render : function(data, type, row, meta){
            return ordinal_suffix_of(data.position);
        }},
        {data : "player", title : "player"},
        {data : "date", render : function(data, type, row, meta){
            return moment(data).format("MM/DD");
        }, title : "date"}
    ],
    selector: function( userId ) {
        return {eventType :"ptq"};
    },
    createdRow : function(row, data, rowIndex){
        $.each($('td', row), function (colIndex) {
            if(colIndex == 2){
                $(this).attr('data-search', data.date.getTime());
            }

        });
    },
    searching : false,
    pagingType : "simple",
    //sub: new SubsManager(),
    pageLength : 5,
    dom : "<'row tableRow'<'col-sm-12't>>" +
    "<'row paginationRow'<'col-xs-7'i><'col-xs-5'p>>"
})






TabularTables.test = new Tabular.Table({
    name : "test",
    collection: _Deck,
    columns : [
        {data : "result", title : "result"},
        {data : "player", title : "player"},
        {data : "date", render : function(data, type, row, meta){
            return moment(data).format("MM/DD");
        }, title : "date"}
    ],
    createdRow : function(row, data, rowIndex){
        $.each($('td', row), function (colIndex) {
            if(colIndex == 2){
                $(this).attr('data-search', data.date.getTime());
            }

        });
    },
    selector: function( userId ) {
        return { format: "modern", eventType : "daily" }
    },
    pageLength : 10
})