Template.AdminDecksDataEdit.onCreated(function(){
    var that = this;
    this.selectedDecksData = new ReactiveVar;
    that.deckPercentage = new ReactiveVar;
    this.autorun(function(){
        Meteor.call("methodFindDeckComparison", FlowRouter.getParam("_id"), function(error, data){
            if (error) {
                console.log(error);
                return;
            }
            that.deckPercentage.set(data);
        });
    });
    this.subscribe('DecksNames');

});

Template.AdminDecksDataEdit.helpers({
    cardType : function(){
        var blocks = ["artifact", "creature", "enchantment", "instant", "planeswalker", "sorcery", "land"];
        var types = [];

        for(var i = 0; i< blocks.length; i++){
            var quantity = getQuantity3(blocks[i], false, FlowRouter.getParam("_id"));
            if(quantity > 0){types.push({name : capitalizeFirstLetter(blocks[i]), quantity : quantity, block : blocks[i]});}
        }
        return types;
    },
    cards : function(block){
        var cardNames = CardsData.find(typeOptions[block]).map(function(p) { return p.name });
        var deck = DecksData.findOne({_id : FlowRouter.getParam("_id")});

        var newArray = deck.main.filter(function(obj1){
            return cardNames.find(function(obj2){
                return obj1.name == obj2;
            });
        });
        return newArray;
    },
    decksWithoutNamesAddNameToDeckSchema : function(){
        return Schemas.decksWithoutNamesAddNameToDeck;
    },
    percentage : function(){
        return Template.instance().deckPercentage.get();
    },
    editFormat : function(){
        return Schemas.AdminDecksArchetypesEditFormat;
    },
    editName : function(){
        return Schemas.DecksData;
    },
    documentValue : function(){
        return DecksData.findOne({_id : FlowRouter.getParam("_id")});
    },
    DecksData : function(){
        return Schemas.DecksData;
    },
    DecksNamesSchema : function(){
        return Schemas.DecksNames;
    },
    DecksArchetypesSchema : function(){
        return Schemas.DecksArchetypes;
    },
    currentFieldValue : function(){
        return AutoForm.getFieldValue("format", "adminNewsDeckNames2");
    },
    decksNamesOptions : function(){
        var decks = DecksNames.find({format : DecksData.findOne({_id : FlowRouter.getParam("_id")}).format}).map(function(obj){
            return {label : obj.name, value : obj._id};
        });
        decks.sort(function(a, b){
            if(a.label < b.label) return -1;
            if(a.label > b.label) return 1;
            return 0;
        });
        console.log(decks);
        return decks;
    },
});

Template.AdminDecksDataEdit.events({
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
                DecksData_id : FlowRouter.getParam("_id"),
                format : Template.instance().selectedDecksData.get().format
            },
            function(err, data){
                thatTemp.selectedDecksData.set();
            });
        thatTemp.selectedDecksData.set();
        thatTemp.deckPercentage.set();

    }
});

var hooksObject = {
    before: {
        // Replace `formType` with the FormValidate `type` attribute to which this hook applies
        method: function(doc) {
            doc._id = FlowRouter.getParam("_id");
            return doc;
        }
    },
};

AutoForm.hooks({
    AdminDecksArchetypesEditName: hooksObject
});

