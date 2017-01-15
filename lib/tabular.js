// import { $ } from 'meteor/jquery';
// import dataTablesBootstrap from 'datatables.net-bs';
// import 'datatables.net-bs/css/dataTables.bootstrap.css';
// dataTablesBootstrap(window, $);

import moment from "moment";
import Tabular from "meteor/aldeed:tabular";

TabularTables = {};

TabularTables.smallEventsDecks = new Tabular.Table({
    name : "smallEventsDecks",
    collection: DecksData,
    columnDefs: [
        { className: "dt-center", targets: [ 2 ] }
    ],
    extraFields : ["Events_id", "victory", "draw", "loss", "eventType"],
    order : [[4, "desc"]],
    rowId : "_id",
    columns : [
        {orderable : false, width : "10px", render : function(data, type, row, meta){
            return '<input type="radio" class="js-deckSelected" data-DecksData_id="'+row._id +'"/>';
        }},
        {title : "type", width : "40px", orderable : false, render : function(data, type, row, meta){
            return '<a href="/events/' + FlowRouter.getParam("format") + '/' + row.Events_id + '/'+row._id+'">' + row.eventType + '</a>';
        }},
        {title : "Result", width : "30px", orderable : false, render : function(data, type, row, meta){
            return row.victory +"-"+row.loss;
        }},
        {data : "player", orderable : false, title : "player"},
        {data : "date",  width : "20px", title : "date", render : function(data, type, row, meta){
            return moment(data).format("MM/DD");
        }}
    ],
    createdRow : function(row, data, rowIndex){
        $.each($('td', row), function (colIndex) {
            if(colIndex == 2){
                $(this).attr('data-search', data.date.getTime());
            }
        });
    },
    "rowCallback": ( row, data, index )=> {
        $(row).removeClass('deckSelected');
        if(DecksData.findOne({main : {$exists : true}})){
            if(DecksData.findOne({main : {$exists : true}})._id === row.id){
                $(row).find("input:first-child").prop('checked', true);;
                $(row).addClass('deckSelected');
            }
        }

    },
    searching : false,
    pagingType : "simple",
    pageLength : 5,
    dom : "<'row '<'tableHeight'tr >>" +
          "<'row '<'col-xs-7'i><'col-xs-5'p>>"
});

TabularTables.largeEventsDecks = new Tabular.Table({
    name : "largeEventsDecks",
    collection: DecksData,
    columnDefs: [
        { className: "dt-center", targets: [ 2 ] }
    ],
    extraFields : ["Events_id", "position", "eventType"],
    order : [[4, "desc"]],
    rowId : "_id",
    columns : [
        {orderable : false, width : "10px", render : function(data, type, row, meta){
            return '<input type="radio" class="js-deckSelected" data-DecksData_id="'+row._id +'"/>';
        }},
        {title : "type", width : "40px", orderable : false, render : function(data, type, row, meta){
            return '<a href="/events/' + FlowRouter.getParam("format") + '/' + row.Events_id + '/'+row._id+'">' + row.eventType + '</a>';
        }},
        {title : "position", data : "position", width : "30px"},
        {data : "player", orderable : false, title : "player"},
        {data : "date",  width : "20px", title : "date", render : function(data, type, row, meta){
            return moment(data).format("MM/DD");
        }}
    ],
    createdRow : function(row, data, rowIndex){
        $.each($('td', row), function (colIndex) {
            if(colIndex == 2){
                $(this).attr('data-search', data.date.getTime());
            }
        });
    },
    "rowCallback": ( row, data, index )=> {
        $(row).removeClass('deckSelected');
        if(DecksData.findOne({main : {$exists : true}})){
            if(DecksData.findOne({main : {$exists : true}})._id === row.id){
                $(row).find("input:first-child").prop('checked', true);;
                $(row).addClass('deckSelected');
            }
        }
    },
    searching : false,
    pagingType : "simple",
    pageLength : 5,
    dom : "<'row '<'tableHeight'tr >>" +
    "<'row '<'col-xs-7'i><'col-xs-5'p>>"
});


TabularTables.events = new Tabular.Table({
    name : "events",
    collection: Events,
    order: [[ 2, "desc" ]],
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
    dom : "<'row'<'col-sm-12 tableHeight'tr>>" +
    "<'row'<'col-sm-7'i><'col-sm-5'p>>"
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

TabularTables.AdminDecksDataUniqueWithoutQuantityEditNoNameTable = new Tabular.Table({
    name : "AdminDecksDataUniqueWithoutQuantityEditNoNameTable",
    collection: DecksDataUniqueWithoutQuantity,
    columns : [
        {data : "_id", title : "_id", render : function(data){
            return '<span class="js-selectID">'+ data + '</span>';
        }},
        {data : "DecksNames_id", title : "DecksNames_id"},
        {data : "format", title : "format"},

    ],
    searching : false,
    pagingType : "simple",
    pageLength : 5,
    dom : "<'row '<'col-sm-12'tr>>" +
    "<'row'<'col-xs-7'i><'col-xs-5'p>>"
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
        {data : "DecksDataDecksNamesHelpers()", title : "Name"},
        {data : "player", title : "player"},
        {data : "format", title : "Format"},
        {data : "colors", title : "Colors", render : function(data, type, row, meta){
            var colors = getCssManaFromDeck(data);
            var colorsStrings = "";
            colors.forEach(function(obj){
                colorsStrings += '<div class="mana ' + obj +'"></div>';
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
                colorsStrings += '<div class="mana ' + obj +'"></div>';
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
        {data : "DecksNames_id", title : "DecksNames_id"},
        {data : "totalMain", title : "Main"},
        {data : "totalSideboard", title : "Side"},
        {data : "player", title : "player"},
        {data : "DecksNames_id", title : "DecksNames_id"},
        {data : "format", title : "Format"},
        {data : "colors", title : "Colors", render : function(data, type, row, meta){
            var colors = getCssManaFromDeck(data);
            var colorsStrings = "";
            colors.forEach(function(obj){
                colorsStrings += '<div class="mana ' + obj +'"></div>';
            });
            return colorsStrings;
        }}
    ],
    // selector: function( userId ) {
    //     return { $or : [{DecksNames_id : {$exists : false, $ne : ""}}]}
    // },
    pageLength : 4
});

TabularTables.allDecksWithoutName = new Tabular.Table({
    name : "allDecksWithoutName",
    collection: DecksData,
    pub : "dacksWithoutNameTable",
    extraFields : ["DecksNames_id"],
    columns : [
        {data : "_id", title : "id", render : function(data, type, row, meta){
            return "<span class='js-deckID'>" + data + "</span>";
        }},
        {data : "DecksNames_id", title : "DecksNames_id"},
        {data : "totalMain", title : "Main"},
        {data : "totalSideboard", title : "Side"},
        {data : "Events_id", title : "Events_id", render : function(data, type, row, meta){
            return '<a href="/admin/Events/' + data +'/edit">Events</a>';
        }},

        {data : "player", title : "player"},
        {data : "format", title : "Format"},
        {data : "colors", title : "Colors", render : function(data, type, row, meta){
            var colors = getCssManaFromDeck(data);
            var colorsStrings = "";
            colors.forEach(function(obj){
                colorsStrings += '<div class="mana ' + obj +'"></div>';
            });
            return colorsStrings;
        }}
    ],
    selector: function( userId ) {
        return {DecksNames_id : {$exists : false}}
    },
    pageLength : 4
});

TabularTables.allDecksWithoutNameAudit = new Tabular.Table({
    name : "allDecksWithoutNameAudit",
    collection: DecksData,
    order : [[6, "asc"]],
    pub : "dacksWithoutNameTable",
    extraFields : ["DecksNames_id"],
    columns : [
        {data : "_id", title : "id", render : function(data, type, row, meta){
            return "<span class='js-deckID'>" + data + "</span>";
        }},
        {data : "DecksNames_id", title : "DecksNames_id"},
        {data : "totalMain", title : "Main"},
        {data : "totalSideboard", title : "Side"},
        {data : "player", title : "player"},
        {data : "format", title : "Format"},
        {data : "autoPercentage", title : "Auto %"},
        {data : "colors", title : "Colors", render : function(data, type, row, meta){
            var colors = getCssManaFromDeck(data);
            var colorsStrings = "";
            colors.forEach(function(obj){
                colorsStrings += '<div class="mana ' + obj +'"></div>';
            });
            return colorsStrings;
        }}
    ],
    pageLength : 4
});

TabularTables.eventsSmall = new Tabular.Table({
    name : "eventsSmall",
    pageLength : 8,
    collection: Events,
    order : [[3, "desc"]],
    extraFields : ["_id", "eventType", "decks"],
    columns : [
        {data : "event", title : "Event", render : function(data, type, row, meta){
            return '<a href="/events/' +FlowRouter.getParam("format")+'/'+row._id+'">'+row.eventType+'</div>';
        }},
        {data : "format", title : "format"},
        {title : "decks", render : function(data, type, row){
            if(row.decks){
                return row.decks;
            }
            return "Unknown";
        }},
        {data : "date", title : "date", render : function(data, type, row, meta){
            return moment(data).format("MM/DD");
        }},

    ],
    dom : "<'row tableHeight'<'col-sm-12't>>" +
    "<'row paginationRow'<'col-xs-7'i><'col-xs-5'p>>",
    pagingType : "simple"
});

TabularTables.eventsBig = new Tabular.Table({
    name : "eventsBig",
    pageLength : 8,
    collection: Events,
    order : [[3, "desc"]],
    extraFields : ["_id", "eventType", "decks"],
    columns : [
        {data : "event", title : "Event", render : function(data, type, row, meta){
            return '<a href="/events/' +FlowRouter.getParam("format")+'/'+row._id+'">'+row.eventType+'</div>';
        }},
        {data : "format", title : "format"},
        {title : "decks", render : function(data, type, row){
            if(row.decks){
                return row.decks;
            }
            return "Unknown";
        }},
        {data : "date", title : "date", render : function(data, type, row, meta){
            return moment(data).format("MM/DD");
        }},
    ],
    dom : "<'row tableHeight'<'col-sm-12't>>" +
    "<'row paginationRow'<'col-xs-7'i><'col-xs-5'p>>",
    pagingType : "simple"
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

TabularTables.DecksArchetypesDelete = new Tabular.Table({
    name : "DecksArchetypesDelete",
    collection: DecksArchetypes,
    columns : [
        {data : "_id", title : "_id"},
        {data : "name", title : "name"},
        {title : "delete", render : function(data, type, row, meta){
           return '<button  doc="'+row._id+'" class="js-archetypeDelete hidden-xs btn btn-xs btn-danger"><i class="fa fa-times" doc="'+row._id+'"></i></button>';
        }},
    ],
    searching : false,
    pagingType : "simple",
    pageLength : 5,
    dom : "<'row '<'tableHeight'tr >>" +
    "<'row '<'col-xs-7'i><'col-xs-5'p>>"
});

TabularTables.EventsDelete = new Tabular.Table({
    name : "EventsDelete",
    collection: Events,
    columns : [
        {data : "_id", title : "_id"},
        {title : "delete", render : function(data, type, row, meta){
            return '<button  doc="'+row._id+'" class="js-eventDelete hidden-xs btn btn-xs btn-danger"><i class="fa fa-times" doc="'+row._id+'"></i></button>';
        }},
    ],
    searching : false,
    pagingType : "simple",
    pageLength : 5,
    dom : "<'row '<'tableHeight'tr >>" +
    "<'row '<'col-xs-7'i><'col-xs-5'p>>"
});

TabularTables.DecksNamesDelete = new Tabular.Table({
    name : "DecksNamesDelete",
    collection: DecksNames,
    columns : [
        {data : "name", title : "name"},
        {data : "_id", title : "_id"},
        {title : "delete", render : function(data, type, row, meta){
            return '<button  doc="'+row._id+'" class="js-decksNamesDelete hidden-xs btn btn-xs btn-danger"><i class="fa fa-times" doc="'+row._id+'"></i></button>';
        }},
    ],
    searching : false,
    pagingType : "simple",
    pageLength : 5,
    dom : "<'row '<'tableHeight'tr >>" +
    "<'row '<'col-xs-7'i><'col-xs-5'p>>"
});