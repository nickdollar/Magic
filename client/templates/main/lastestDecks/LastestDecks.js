Template.latestDecks.onCreated(function(){
    var that = this;
    this.autorun(function(){
        that.subscribe('DecksNamesPlaylistsByDaysAndImages', 1000);
    })
});

Template.latestDecks.helpers({

});

Template.latestDecks.onRendered(function(){
    var that = this;
    this.autorun(function() {
        if(that.subscriptionsReady()){
            if ($.fn.DataTable.isDataTable("#latestDecksTable")) {
                $('#latestDecksTable').DataTable().clear();
                $('#latestDecksTable').DataTable().destroy({
                    remove : true
                });
                var $table = $("<table>", {id : "latestDecksTable", class : "table table-sm", cellSpacing: 0, width : "100%"});
                $(".js-latestDecksTable").append($table);
            }
            var tempArray = [];
            var query = MetaNewest.findOne({type : "lastDays"});

            if(query){
                tempArray = tempArray.concat(query.newestDecks);
                tempArray = tempArray.concat(query.newestArchetypes);
            }

            tempArray.sort(function(a, b){
                return b.date - a.date;
            });
            $('#latestDecksTable').DataTable({
                data: tempArray,
                pageLength: 8,
                pagingType: "simple",
                order : [[3, "desc"]],
                dom :   "<'row'<'col-sm-12 tableHeight'tr>>" +
                "<'row'<'col-sm-12'p>>",
                columns: [
                    {
                        title: "", render : function(data, type, row, meta){
                        if(row.t == 1){
                            return "D";
                        }else if(row.t == 2){
                            return "A";
                        }
                    }},
                    {
                        title: "format", render : function(data, type, row, meta){
                        return row.format;
                    }},
                    {
                        title: "Name", render : function(data, type, row, meta){
                        if(row.t == 1){
                            var deckName = DecksNames.findOne({_id : row._id});
                            var archetypeName = DecksArchetypes.findOne({_id : deckName.DecksArchetypes_id});
                            var html = "";
                            html += '<span><a href="/decks/' + row.format + '/' + replaceTokenWithDash(archetypeName.name) + '/' + replaceTokenWithDash(deckName.name) + '">'+ deckName.name + '</a></span>';
                            return html;
                        }else if(row.t == 2){
                            var archetypeName = DecksArchetypes.findOne({_id : row._id}).name;
                            var html = "";
                            html += '<span><a href="/decks/' + row.format + '/' + replaceTokenWithDash(archetypeName) + '">'+ archetypeName + '</a></span>';
                            return html;
                        }
                    }},
                    {
                        title: "Date", render: function (data, type, row, meta) {
                        return row.date.getMonth( ) + 1 +'/'+ row.date.getDate( );
                    }
                    },
                ]
            });

            if ($.fn.DataTable.isDataTable("#latestCardsMeta")) {
                $('#latestCardsMeta').DataTable().clear();
                $('#latestCardsMeta').DataTable().destroy({
                    remove : true
                });
                var $table = $("<table>", {id : "latestCardsMeta", class : "table table-sm", cellSpacing: 0, width : "100%"});
                $(".js-latestCardsMeta").append($table);
            }
            var tempArray = [];
            var query = MetaNewest.findOne({type : "lastDays"});

            if(query){
                tempArray = tempArray.concat(query.newestCards);
                tempArray.sort(function(a, b){
                    return b.date - a.date;
                });
            }

            $('#latestCardsMeta').on( 'draw.dt', function () {
                $('.js-imagePopOverNews').popover({
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
            }).DataTable({
                data: tempArray,
                pageLength: 8,
                pagingType: "simple",
                order : [[2, "desc"]],
                dom :   "<'row'<'col-sm-12 tableHeight'tr>>" +
                "<'row'<'col-sm-12'p>>",
                columns: [
                    {
                        title: "format", render : function(data, type, row, meta){
                        return row._id.format;
                    }},
                    {
                        title: "Name", render : function(data, type, row, meta){
                        return '<div class="name js-imagePopOverNews" data-name="' + row._id.name + '">'+row._id.name+'</div>'
                    }},
                    {
                        title: "Date", render: function (data, type, row, meta) {
                        return row.date.getMonth( ) + 1 +'/'+ row.date.getDate( );
                    }
                    },
                ]
            });
        }

    });
});