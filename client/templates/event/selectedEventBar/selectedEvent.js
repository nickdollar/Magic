import Deck from "/client/dumbReact/Deck/DeckContainer.jsx"

Template.selectedEvent.onCreated(function(){
    this.checks = new ReactiveDict();
    this.checks.set("test2", false);

    this.autorun(()=>{
        this.subscribe("EventsById", FlowRouter.getParam("Events_id"));
    });

    this.autorun(()=>{
        this.checks.set("DecksDataCardsDataByIdOrFirstOnEvents", false);
        this.subscribe("DecksDataCardsDataByIdOrFirstOnEvents",  FlowRouter.getParam("DecksData_id"), FlowRouter.getParam("Events_id"), {
            onReady : ()=>{
                if ($.fn.DataTable.isDataTable("#playersTable")) {
                    $('#playersTable').DataTable().$('tr.deckSelected').removeClass('deckSelected');
                    $('#playersTable').DataTable().$('tr[id="'+FlowRouter.getParam("DecksData_id")+'"]').addClass('deckSelected');
                }
            }
        });
    });

    this.autorun(()=>{
        this.checks.set("DecksDataFromEvent_idSimplified", false);
        this.subscribe("DecksDataFromEvent_idSimplified", FlowRouter.getParam("Events_id"), {
            onReady : ()=>{
                this.checks.set("DecksDataFromEvent_idSimplified", true);
            }
        });
    });
});

Template.selectedEvent.helpers({
    event : function(){
        return Events.findOne();
    },
    deck : function(){
        if(Template.instance().subscriptionsReady()) {
            return DecksData.findOne({main: {$exists: true}});
        }
    },
    Deck (){
        return Deck
    },
    pos : function(){
        if(this.position !== undefined){
            return this.position;
        }

        var position = this.victory + "-" + this.loss;

        if(this.draw != 0){
            position += " " + this.draw;
        }
        return position;
    },

    DecksData_id(){

    },
    cardType : function(){
        var blocks = ["artifact", "creature", "enchantment", "instant", "planeswalker", "sorcery", "land"];
        var types = [];

        for(var i = 0; i< blocks.length; i++){
            var quantity = getQuantity3(blocks[i], false, DecksData.findOne({main : {$exists : true}})._id);
            if(quantity > 0){types.push({name : capitalizeFirstLetter(blocks[i]), quantity : quantity, block : blocks[i]});}
        }
        return types;
    },
    cards : function(block){
        var cardNames = CardsData.find(typeOptions[block]).map(function(p) { return p.name });
        var deck = DecksData.findOne({main : {$exists : true}});

        var newArray = deck.main.filter(function(obj1){
            return cardNames.find(function(obj2){
                return obj1.name == obj2;
            });
        });
        return newArray;
    },
    sideboard : function(){
        return DecksData.findOne({main : {$exists : true}}).sideboard;
    },
    mainQuantity : function(){
        return getQuantity3(null, false, DecksData.findOne({main : {$exists : true}})._id);
    },
    sideboardQuantity : function(){
        return getQuantity3(null, true, DecksData.findOne({main : {$exists : true}})._id);
    },
    test : function(){
        Template.instance().checks.set("test2", true);
    },
    test2 : function(){
        return Template.instance().checks.get("test2");
    },
    test3 : function(){
        $('.js-imagePopOver').popover({
            html: true,
            placement : "auto right",
            trigger: 'hover',
            content: function () {
                var cardName = encodeURI($(this).data('name'));
                cardName = cardName.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "%22;").replace(/'/g, "%27");
                var linkBase = "https://mtgcards.file.core.windows.net/cards/";
                var key = "?sv=2015-12-11&ss=f&srt=o&sp=r&se=2017-07-01T10:06:43Z&st=2017-01-03T02:06:43Z&spr=https&sig=dKcjc0YGRKdFH441ITFgI5nhWLyrZR6Os8qntzWgMAw%3D";
                var finalDirectory = linkBase+cardName+".full.jpg" + key;
                return '<img src="'+finalDirectory +'" style="height: 310px; width: 223px"/>';
            }
        });
        Template.instance().checks.set("test2", false);
    },

})

Template.selectedEvent.events({
    'click #playersTable tbody tr' : function(evt, tmp){
        // return Template.instance().checks.set("DecksDataCardsDataByIdOrFirstOnEvents", false);
    }
});

Template.selectedEvent.onRendered(function(){
    if ($.fn.DataTable.isDataTable("#playersTable")) {
        console.log("Destroy Table");
        $('#playersTable').DataTable().clear();
        $('#playersTable').DataTable().destroy({
            remove : true
        });
        var $table = $("<table>", {id : "playersTable", class : "table table-hover", cellSpacing: 0, width : "100%"});
        $(".js-appendPlayersTable").append($table);
    }

    var data;
    if(DecksData.findOne()){
        data = DecksData.find({}).fetch();
    }
    var selected;
    $('#playersTable').DataTable({
        pageLength: 8,
        order : [[0, "asc"]],
        pagingType : "simple",
        dom :
        "<'row'<'col-sm-12 tableHeight't>>" +
        "<'row'<'col-sm-12 'i>>" +
        "<'row'<'col-sm-12'p>>",
        rowId : "_id",
        columns: [
            {title: "player", render : function(data, type, row, meta){
                var position = "";
                if(row.position){
                    // var s=["th","st","nd","rd"],
                    //     v=row.position%100;
                    // position = row.position+(s[(v-20)%10]||s[v]||s[0]);
                    position = row.position;
                } else{
                    position =  row.victory + "-" + row.loss;
                }

                if(type == "sort"){
                    return parseInt(row.position);
                }

                if(type == "display"){
                    if(!DecksNames.findOne({_id : row.DecksNames_id})){

                        return  '<div><span>( ' +position+ ' ) </span><a href="/events/'+ FlowRouter.getParam("format") +'/'+ FlowRouter.getParam("Events_id")+'/'+ row._id +'">'+ row._id +'</a><span> ' + getHTMLColors(row.colors) +'</span></div>' +
                            '<div>'+ row.player +'</div>'
                    }
                    return  '<div><span>' +position+ ' - </span><a href="/events/'+ FlowRouter.getParam("format") +'/'+ FlowRouter.getParam("Events_id")+'/'+ row._id +'">'+ DecksNames.findOne({_id : row.DecksNames_id}).name +'</a></div>' +
                        '<div><div style="float: left;">' + getHTMLColors(row.colors) +'</span></div><div style="float: right">'+row.player +'</div></div>'
                }
                return null;
            }},
        ],
        "rowCallback": function( row, data, index ) {
            if(DecksData.findOne({main : {$exists : true}})._id === row.id){
                $(row).addClass('deckSelected');
            }
        },
        // createdRow: function( row, data, dataIndex ) {
        //     // Set the data-status attribute, and add a class
        //     $( row ).find('td:eq(0)')
        //         .attr('data-sort', data.position)
        // }
    });

    this.autorun(()=> {
        if(this.checks.get("DecksDataFromEvent_idSimplified")) {
            var data = [];
            if(DecksData.findOne()){
                data = DecksData.find({}).fetch();
            }
            $('#playersTable').DataTable().rows.add(data)
                                           .draw();
            this.checks.set("DecksDataFromEvent_idSimplified", false);
        }
    });
});

var cardsOptions = {
    artifact : {creature: false, artifact: true, land : false},
    creature : {creature: true},
    enchantment : {enchantment: true, creature: false, artifact: false},
    instant : {instant: true},
    planeswalker : {planeswalker: true},
    sorcety : {sorcery: true},
    land : {land: true, creature: false},
    sideboard : {}
}
