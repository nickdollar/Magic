Template.exampleDeck_COL.onCreated(function(){
    var that = this;
    this.selectedDecksNames = new ReactiveVar();
    this.selectedDecksData = new ReactiveVar();
    this.checks = new ReactiveDict();

    this.autorun(function(){
        that.selectedDecksData.set();
        that.selectedDecksNames.set();
        that.checks.set("deckName", false);
        Router.current().params.deckSelected;
        Meteor.setTimeout(function(){
            that.subscribe("deckNamesDecksDataCardDatabase", DecksNames.findOne({name : {$regex : Router.current().params.deckSelected}})._id, {
                onReady : function(){
                    that.selectedDecksNames.set(DecksNames.findOne({_id : DecksNames.findOne({name : {$regex : Router.current().params.deckSelected}})._id}));
                    that.selectedDecksData.set(
                        DecksData.findOne({DecksNames_id : that.selectedDecksNames.get()._id}, {sort : {date : -1}})
                    )
                }
            });
        }, 50)

    });

    this.autorun(function(){
        if(that.checks.get("deckName")){
            if(that.selectedDecksData.get()){
                that.subscribe("deckSelectedAndCardDatabase", that.selectedDecksData.get()._id, {
                    onReady : function(){
                        that.selectedDecksData.set(DecksData.findOne({_id : that.selectedDecksData.get()._id}));
                    }
                });
            }
        }
    });
});


Template.exampleDeck_COL.helpers({
    decksNames : function(){
        return Template.instance().selectedDecksNames.get();
    },
    deck : function() {
        if(!Template.instance().selectedDecksData.get()) return false;
        if(!Template.instance().selectedDecksData.get().hasOwnProperty("main")) return false;
        return Template.instance().selectedDecksData.get();
    },
    cardType : function(){
        var blocks = ["artifact", "creature", "enchantment", "instant", "planeswalker", "sorcery", "land"];
        var types = [];

        for(var i = 0; i< blocks.length; i++){
            var quantity = getQuantity3(blocks[i], false, Template.instance().selectedDecksData.get()._id);
            if(quantity > 0){types.push({name : capitalizeFirstLetter(blocks[i]), quantity : quantity, block : blocks[i]});}
        }
        return types;
    },
    cards : function(block){
        var cardNames = _CardDatabase.find(typeOptions[block]).map(function(p) { return p.name });
        var deck = DecksData.findOne({_id : Template.instance().selectedDecksData.get()._id});

        var newArray = deck.main.filter(function(obj1){
            return cardNames.find(function(obj2){
                return obj1.name == obj2;
            });
        });
        return newArray;
    },
    sideboard : function(){
        // var names = _CardDatabase.find({}).map(function(p) { return p.name });
        // var deck = _Deck.findOne({eventType: Session.get(SV_decksSelectedEventType)});
        // return _DeckCards.find({_deckID : deck._id, sideboard : true, name : {$in : names}});
    },
    sideboardQuantity: function() {
        // return getQuantity2(null, true, Session.get(SV_decksSelectedEventType));
    },
    test : function(test){

    },
    event : function(_deckID) {
        // var _eventID = _Deck.findOne({_id: _deckID})._eventID;
        // return _Event.findOne({_id: _eventID}).eventType;
    },
    manaCost : function(card){
        // return '';
    },
    smallSelector : function(){
        return {format: Router.current().params.format, eventType :"league", DecksNames_id : DecksNames.findOne({name : {$regex : Router.current().params.deckSelected}})._id};
    },
    settings: function () {
        return {
            collection: _Deck,
            rowsPerPage: 7,
            showFilter: true,
            fields: [{key : 'result', label : "Score", fn: function(value, object, key){
                if(object.result.position != null){
                    return object.result.position;
                }
                return object.result.victory +"-"+object.result.loss;
            }
            },
                'player', 'name'],
            showNavigator: true
        };
    },
    ptq : function(){
        return  Session.get("deckSelectedData").events.ptq;
    },
    ptqSelector : function(){

        // DecksNames.findOne({name : {$regex : Router.current().params.deckSelected}})._id

        return {format: Router.current().params.format, name : {$regex : Router.current().params.deckSelected}};
    },
    selectedDeck : function(){
        return Router.current().params.deckSelected;
    }

});



Template.exampleDeck_COL.events({
    'click .js-deckSelected' : function(event, template){
        var row = $(event.target).closest('tr').get(0);
        var dataTable = $(event.target).closest('table').DataTable();
        var rowData = dataTable.row(row).data();
        template.selectedDecksData.set();
        Meteor.setTimeout(function(){
                template.checks.set("deckName", true);
                template.selectedDecksData.set(rowData);
        }, 100)
    }
});

Template.exampleDeck_COL.onRendered(function(){
    var values = this;
    $(".clickable-row").click(function() {
        window.document.location = $(this).data("href");
    });


});

// Template.exampleDeckHeader.helpers({
//     deck : function() {
//         return _Deck.findOne({eventType : Session.get(SV_decksSelectedEventType)});
//     }
// });
