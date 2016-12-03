Template.newsTable.onCreated(function(){
    var that = this;
    this.options = new ReactiveDict();
    this.options.set("subscribeReady", false);
    this.options.set("newsTypes", ["archetypes", "decks", "cards"]);
    this.options.set("firstPass", true);
    
    this.autorun(function(){
       that.subscribe('metaNewestFormatLastTwenty', FlowRouter.getParam("format"), {
           onReady : function(){
                that.options.set("metaNewestFormatLastTwenty", true);
           }
       });
    });
});


Template.newsTable.onRendered(function(){
    var that = this;
    this.autorun(function() {

        if(that.options.get("metaNewestFormatLastTwenty"))
        {
            if ($.fn.DataTable.isDataTable("#newsTableTable")) {
                $('#newsTableTable').DataTable().clear();
                $('#newsTableTable').DataTable().destroy({
                    remove : true
                });
                var $table = $("<table>", {id : "newsTableTable", class : "table table-sm", cellSpacing: 0, width : "100%"});
                $(".js-newsTableTable").append($table);
            }
            var tempArray = [];
            var query = MetaNewest.findOne({format : FlowRouter.getParam("format"), type : "lastTwenty"});

            if(query){
                if(that.options.get("newsTypes").indexOf("archetypes") != -1){
                    tempArray = tempArray.concat(query.newestArchetypes);
                }
                if(that.options.get("newsTypes").indexOf("decks") != -1){
                    tempArray = tempArray.concat(query.newestDecks);
                }
                if(that.options.get("newsTypes").indexOf("cards") != -1){
                    tempArray = tempArray.concat(query.newestCards);
                }
            }

            tempArray.sort(function(a, b){
                return b.date - a.date;
            });

            $('#newsTableTable').on( 'draw.dt', function () {
                $('.js-imagePopOverNews').popover({
                    html: true,
                    trigger: 'hover',
                    placement : "auto right",
                    content: function () {
                        var cardName = encodeURI($(this).data('name'));
                        cardName = cardName.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "%22;").replace(/'/g, "%27");
                        var linkBase = "http://plex.homolka.me.uk:10080/";
                        var finalDirectory = linkBase+cardName+".full.jpg";
                        return '<img src="'+finalDirectory +'" style="height: 310px; width: 223px" />';
                    }
                });
            })
                .DataTable({
                    data: tempArray,
                    pageLength: 8,
                    pagingType: "simple",
                    order : [[2, "desc"]],
                    dom :   "<'row'<'col-sm-12 tableHeight'tr>>" +
                    "<'row'<'col-sm-5'i><'col-sm-7'p>>",
                    columnDefs : [
                        {orderable : false, targets : "_all"}
                    ],
                    language : {
                        //Showing 1 to 10 of 40 entries
                        info : "Showing _START_ to _END_ of _TOTAL_"
                    },
                    columns: [
                        {
                            title: "", render : function(data, type, row, meta){
                            if(row.t == 1){
                                return "D";
                            }else if(row.t == 2){
                                return "A";
                            }else{
                                return "C";
                            }
                        }},
                        {
                            title: "Name", render : function(data, type, row, meta){
                            if(row.t == 1){
                                var deckName = DecksNames.findOne({_id : row._id});
                                var archetypeName = DecksArchetypes.findOne({_id : deckName.DecksArchetypes_id});
                                var html = "";
                                html += '<span><a href="/decks/' + FlowRouter.getParam("format") + '/' + replaceTokenWithDash(archetypeName.name) + '/' + replaceTokenWithDash(deckName.name) + '">'+ deckName.name + '</a></span>';
                                return html;
                            }else if(row.t == 2){
                                var archetypeName = DecksArchetypes.findOne({_id : row._id}).name;
                                var html = "";
                                html += '<span><a href="/decks/' + FlowRouter.getParam("format") + '/' + replaceTokenWithDash(archetypeName) + '">'+ archetypeName + '</a></span>';
                                return html;
                            }else{
                                return '<div class="name js-imagePopOverNews" data-name="' + row._id + '">'+row._id+'</div>'
                            }
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

Template.newsTable.events({
    'change input[role="typeNewCardCheckbox"]' : function(evt, tmp){
        var newsTypes = [];
        var checkboxes = tmp.findAll('input[role="typeNewCardCheckbox"]:checked');
        for(var i = 0; i < checkboxes.length; i++){
            newsTypes.push(checkboxes[i].value);
        }
        tmp.options.set("newsTypes", newsTypes);
    }
});