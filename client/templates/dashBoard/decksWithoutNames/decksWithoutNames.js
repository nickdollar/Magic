Template.decksWithoutNames.onCreated(function(){
    var that = this;
    this.selectedDecksData = new ReactiveVar;
    that.deckPercentage = new ReactiveVar;
    that.subscribe("DecksNames");
    this.autorun(function(){
        if(that.selectedDecksData.get()){
            Meteor.subscribe("deckSelectedID", that.selectedDecksData.get()._id, {
                onReady : function(){

                }
            });
            Meteor.call("methodFindDeckComparison", that.selectedDecksData.get()._id, function(error, data){
                if (error) {
                    console.log(error);
                    return;
                }
                that.deckPercentage.set(data);
            });
        }
    });
});

Template.decksWithoutNames.helpers({
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
    decksWithoutNamesAddNameToDeckSchema : function(){
        return Schema.decksWithoutNamesAddNameToDeck;
    },
    options : function () {
        var decks = DecksNames.find({}).map(function(obj){
            return {label : obj.name, value : obj.name};
        });

        return decks;
    },
    percentage : function(){
        return Template.instance().deckPercentage.get();
    },
    _idValue : function(){
        return Template.instance().selectedDecksData.get()._id;
    },
    formatValue : function(){
        return Template.instance().selectedDecksData.get().format;
    },
    selectedDecksData : function(){
        return Template.instance().selectedDecksData.get();
    }
});

Template.decksWithoutNames.events({
    "click .js-deckID" : function(event, template){
        var row = $(event.target).closest('tr').get(0);
        var dataTable = $(event.target).closest('table').DataTable();
        var rowData = dataTable.row(row).data();
        Template.instance().selectedDecksData.set();
        var thatTemplate = Template.instance();
        Meteor.setTimeout(function(){
            thatTemplate.selectedDecksData.set(rowData);
        }, 50);
    },
    "click .js-confirmDeck" : function(evt, template){
        var thatTemp = Template.instance();
        Meteor.call('methodAddNameToDeck',
            {
                DeckName : this.name,
                DecksData_id : Template.instance().selectedDecksData.get()._id,
                format : Template.instance().selectedDecksData.get().format
            },
            function(err, data){
                thatTemp.selectedDecksData.set();
        });
        thatTemp.selectedDecksData.set();
        thatTemp.deckPercentage.set();

    },
    "click .js-deleteDeck" : function(evt, template){
        var row = $(event.target).closest('tr').get(0);
        var dataTable = $(event.target).closest('table').DataTable();
        var rowData = dataTable.row(row).data();
        console.log(rowData);
        var thatTemp = Template.instance();
        Meteor.call('methodRemoveDeck', rowData._id,
            function(err, data){
                if(rowData._id == thatTemp.selectedDecksData.get()){
                    thatTemp.selectedDecksData.set();
                }
            });
    }
});


Schema.decksWithoutNamesAddNameToDeck = new SimpleSchema({
    DeckName: {
        type: String,
        autoform: {
            type: "selectize",
            label : "Deck Name",
            selectizeOptions: {
                create: true
            }
        }
    },
    DecksData_id : {
        type : String
    },
    format : {
        type : String
    }
});


var decksWithoutNamesAddNameToDeckHooks = {
    onSuccess: function(formType, result) {
        this.template.parentTemplate(1).selectedDecksData.set();
    }
}


AutoForm.hooks({
    decksWithoutNamesAddNameToDeck : decksWithoutNamesAddNameToDeckHooks
})