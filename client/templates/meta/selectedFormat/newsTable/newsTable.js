Template.newsTable.onCreated(function(){
    var that = this;
    this.options = new ReactiveDict();
    this.options.set("subscribeReady", false);
    this.options.set("decksCards", ["archetypes", "decks", "cards"]);
    this.autorun(function(){
       that.subscribe('metaNewestFormat', Router.current().params.format, {
           onReady : function(){
                that.options.set("subscribeReady", true);
           }
       });
    });


    this.autorun(function() {

        if(that.options.get("subscribeReady"))
        {
            if ($.fn.DataTable.isDataTable("#newestTable")) {
                $('#newestTable').DataTable().clear();
                $('#newestTable').DataTable().destroy({
                    remove : true
                });
                var $table = $("<table>", {id : "newestTable", class : "display", cellSpacing: 0, width : "100%"});
                $(".js-appendNewestTable").append($table);
            }
            var tempArray = [];
            var query = MetaNewest.findOne({format : Router.current().params.format});
            console.log(query);
            if(query){
                if(that.options.get("decksCards").indexOf("decks") != -1){
                    tempArray = tempArray.concat(query.newestDecks);
                }

                if(that.options.get("decksCards").indexOf("cards") != -1){
                    tempArray = tempArray.concat(query.newestCards);
                }

                if(that.options.get("decksCards").indexOf("archetypes") != -1){
                    tempArray = tempArray.concat(query.newestArchetypes);
                }
            }

            tempArray.sort(function(a, b){
                return b.date - a.date;
            });

            $('#newestTable').DataTable({
                data: tempArray,
                pageLength: 10,
                pagingType: "simple",
                order : [[1, "desc"]],
                dom :   "<'row'<'col-sm-12'tr>>" +
                "<'row'<'col-sm-12'p>>",
                columns: [
                    {
                        title: "", render : function(data, type, row, meta){
                        if(row.t == 1){
                            return "A";
                        }else if(row.t == 2){
                            return "N";
                        }else{
                            return "C";
                        }
                    }},
                    {
                        title: "Name", render : function(data, type, row, meta){
                        if(row.t == 1){
                            return DecksNames.findOne({_id : row._id}).name;
                        }else if(row.t == 2){
                            return DecksArchetypes.findOne({_id : row._id}).name;
                        }else{
                            return row._id
                        }
                    }},
                    {
                        title: "Deck", render: function (data, type, row, meta) {
                        if(row.t == 1){
                            return "";
                        }else if(row.t == 2){
                            return "";
                        }else{
                            return "X";
                        }
                    }
                    },
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


Template.newsTable.onRendered(function(){

});

Template.newsTable.events({
    'change input[role="typeNewCardCheckbox"]' : function(evt, tmp){
        var decksCards = [];
        var checkboxes = tmp.findAll('input[role="typeNewCardCheckbox"]:checked');
        for(var i = 0; i < checkboxes.length; i++){
            decksCards.push(checkboxes[i].value);
        }
        tmp.options.set("decksCards", decksCards);
    }
});