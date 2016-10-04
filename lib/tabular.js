import moment from "moment";
TabularTables = {};

TabularTables.eventSmallTable = new Tabular.Table({
    name : "eventSmallTable",
    collection: DecksData,
    extraFields : ["Events_id", "victory", "draw", "loss"],
    columns : [
        {title : "Deck", orderable : false, render : function(data, type, row, meta){
             return "<span class='js-deckSelected' data-DecksData_id='"+row._id +"'>X</span>";
        }},
        {data : "eventType", title : "type",  render : function(data, type, row, meta){
            return "<a href=/event/" + Router.current().params.format + "/" + row._eventID + ">" + data + "</a>";
        }},
        {title : "result", render : function(data, type, row, meta){
            return row.victory +"-"+row.loss;
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
    dom : "<'row tableRow'<'col-sm-12't>>" +
          "<'row paginationRow'<'col-xs-7'i><'col-xs-5'p>>"
});

TabularTables.newModernFormatEvent = new Tabular.Table({
    name : "newModernFormatEvent",
    collection: Events,
    columns : [
        {data : "_id", title : "_id", render : function(data, type, row, meta){
            return "<span class='js-idLink'>" +data + "</span>";
        }},
        {data : "eventType", title : "eventType"},
        {data : "date", title : "date", render : function(data, type, row, meta){
            return moment(data).format("MM/DD");
        }},
        {data : "url", title : "Url", render : function(data, type, row, meta){
            return "<a href=" + row.url + ">link</a>";
        }},
        {data : "validation", title : "Exists", render : function(data, type, row, meta){
            if(data.exists == null){
                return '<span class="js-validationExists">false</span>';
            }

            if(data.exists == false){
                return '<span class="js-validationExists">false</span>';
            }
            return true;
        }},

        {data : "validation", title : "html", render : function(data, type, row, meta){
            if(data.htmlDownloaded == null){
                return '<span class="js-htmlDownloaded">false</span>';
            }

            if(data.htmlDownloaded == false){
                return '<span class="js-htmlDownloaded">false</span>';
            }
            return true;
        }},
        {data : "validation", title : "Ext. Decks", render : function(data, type, row, meta){
            if(data.extractDecks == null){
                return '<span class="js-extractDecks">false</span>';
            }

            if(data.extractDecks == false){
                return '<span class="js-extractDecks">false</span>';
            }
            return true;
        }},
        {data : "_id", title : "Missing", render : function(data, type, row, meta){
            var temp = DecksData.find({_eventID : data}).fetch();
            var decksWithName = 0;
            temp.forEach(function(obj){
                if(obj.name != undefined){
                    if(obj.name != ""){
                        decksWithName++;
                    }
                }
            });
            return temp.length - decksWithName ;
        }},
    ],
    selector: function( userId ) {
        return {eventType :"league", format : "modern"};
    },
    createdRow : function(row, data, rowIndex){
        // $.each($('td', row), function (colIndex) {
        //     if(colIndex == 2){
        //         $(this).attr('data-search', data.date.getTime());
        //     }
        //
        // });
    },
    searching : false,
    pagingType : "simple",
    //sub: new SubsManager(),
    pageLength : 5,
    dom : "<'row tableRow'<'col-sm-12't>>" +
    "<'row paginationRow'<'col-xs-7'i><'col-xs-5'p>>"
});

TabularTables.eventLargeTableDatatables = new Tabular.Table({
    name : "eventLargeTable",
    tmpl: Meteor.isClient && Template.sharedTemplate,
    tmplContext : function(rowData){
        return {
            item : rowData,
            column : 'title'
        };
    },
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

TabularTables.dBDecksNames = new Tabular.Table({
    name : "dBDecksNames",
    collection: DecksNames,
    columns : [
        {data : "_id", title : "id", render : function(data, type, row, meta){
            return "<span class='js-DecksNames_id'>" + data + "</span>";
        }},
        {data : "name", title : "Name"},
        {data : "format", title : "Format"},
        {data : "decks", title : "decks"}
    ],
    pageLength : 4
});


TabularTables.dashBoardDecks = new Tabular.Table({
    name : "dashBoardDecks",
    collection: DecksData,
    pub : "dashBoardDecksTables",
    extraFields : ["DecksNames_id"],
    columns : [
        {data : "_id", title : "id", render : function(data, type, row, meta){
            return "<span class='js-deckID'>" + data + "</span>";
        }},
        {data : "totalMain", title : "Main"},
        {data : "totalSideboard", title : "Side"},
        {data : "name()", title : "Name"},
        {data : "player", title : "player"},
        {data : "format", title : "Format"},
        {data : "colors", title : "Colors", render : function(data, type, row, meta){
            var colors = getCssManaFromDeck(data);
            var colorsStrings = "";
            colors.forEach(function(obj){
                colorsStrings += '<div class="mana mana-' + obj +'"></div>';
            });
            return colorsStrings;
        }}
    ],
    pageLength : 4
});

TabularTables.deckNamesDecksPercentage = new Tabular.Table({
    name : "deckNamesDecksPercentage",
    collection: DecksNames,
    columns : [
        {data : "_id", title : "id", render : function(data, type, row, meta){
            return "<span class='js-deckID'>" + data + "</span>";
        }},
        {data : "totalMain", title : "Main"},
        {data : "totalSideboard", title : "Side"},
        {data : "name", title : "name"},
        {data : "player", title : "player"},
        {data : "format", title : "Format"},
        {data : "colors", title : "Colors", render : function(data, type, row, meta){
            var colors = getCssManaFromDeck(data);
            var colorsStrings = "";
            colors.forEach(function(obj){
                colorsStrings += '<div class="mana mana-' + obj +'"></div>';
            });
            return colorsStrings;
        }}
    ],
    pageLength : 4
});

TabularTables.dacksWithoutName = new Tabular.Table({
    name : "dacksWithoutName",
    collection: DecksData,
    pub : "dacksWithoutNameTable",
    extraFields : ["DecksNames_id"],
    columns : [
        {data : "_id", title : "id", render : function(data, type, row, meta){
            return "<span class='js-deckID'>" + data + "</span>";
        }},
        {data : "totalMain", title : "Main"},
        {data : "totalSideboard", title : "Side"},
        {data : "player", title : "player"},
        {data : "format", title : "Format"},
        {data : "colors", title : "Colors", render : function(data, type, row, meta){
            var colors = getCssManaFromDeck(data);
            var colorsStrings = "";
            colors.forEach(function(obj){
                colorsStrings += '<div class="mana mana-' + obj +'"></div>';
            });
            return colorsStrings;
        }},
        {title : "Delete", orderable : false, render : function(data, type, row, meta){
            return '<button type="submit" class="js-deleteDeck btn btn-primary">Delete</button>';
        }}
    ],
    selector: function( userId ) {
        return { $or : [{DecksNames_id : {$exists : false, $ne : ""}}]}
    },
    pageLength : 4
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
