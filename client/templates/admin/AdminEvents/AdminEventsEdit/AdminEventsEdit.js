Template.AdminEventsEdit.onCreated(function(){
    var that = this;
    this.selectedDecksData = new ReactiveVar;
    that.deckPercentage = new ReactiveVar;
    that.selectedDeck = new ReactiveVar;
    that.checks = new ReactiveDict();

    this.autorun(function(){
        if(that.selectedDeck.get()){
            Meteor.subscribe("DecksDataCardsDataByDecksdata_id", that.selectedDeck.get(),{
                onReady : function(){

                }
            });
        }
    });

    this.autorun(function(){
        if(that.selectedDeck.get()){
            Meteor.call("methodFindDeckComparison", that.selectedDeck.get(), function(error, data){
                if (error) {
                    console.log(error);
                    return;
                }
                that.deckPercentage.set(data);
            });
        }
    });

});

Template.AdminEventsEdit.helpers({
    schema : function(){
        return Schemas.Events;
    },
    doc : function(){
        return Events.findOne({_id : FlowRouter.getParam("_id")});
    },
    selector : function(){
        return {Events_id : FlowRouter.getParam("_id")}
    },
    deckCheck : function(){
        return DecksData.findOne({_id : Template.instance().selectedDeck.get()}) && Template.instance().selectedDeck.get();
    },
    cardType : function(){
        var blocks = ["artifact", "creature", "enchantment", "instant", "planeswalker", "sorcery", "land"];
        var types = [];

        for(var i = 0; i< blocks.length; i++){
            var quantity = getQuantity3(blocks[i], false, Template.instance().selectedDeck.get());
            if(quantity > 0){types.push({name : capitalizeFirstLetter(blocks[i]), quantity : quantity, block : blocks[i]});}
        }
        return types;
    },
    cards : function(block){
        var cardNames = CardsData.find(typeOptions[block]).map(function(p) { return p.name });
        var deck = DecksData.findOne({_id : Template.instance().selectedDeck.get()});

        var newArray = deck.main.filter(function(obj1){
            return cardNames.find(function(obj2){
                return obj1.name == obj2;
            });
        });
        return newArray;
    },
    percentage : function(){
        return Template.instance().deckPercentage.get();
    },
    editName : function(){
        return Schemas.DecksData;
    },
    DecksDataValue : function(){
        return DecksData.findOne({_id : Template.instance().selectedDeck.get()});
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
        return AutoForm.getFieldValue("format", "adminNewsDeckNames3");
    },
    decksNamesOptions : function(){
        var decks = DecksNames.find({format :  Events.findOne({_id : FlowRouter.getParam("_id")}).format}).map(function(obj){
            return {label : obj.name, value : obj._id};
        });
        decks.sort(function(a, b){
            if(a.label < b.label) return -1;
            if(a.label > b.label) return 1;
            return 0;
        });
        return decks;
    },
    format : function(){
        console.log(Events.findOne({_id : FlowRouter.getParam("_id")}).format);
        Events.findOne({_id : FlowRouter.getParam("_id")}).format;
    }

})

Template.AdminEventsEdit.events({
    "click .js-deckID" : function(evt, tmp){
        var row = $(event.target).closest('tr').get(0);
        var dataTable = $(event.target).closest('table').DataTable();
        var rowData = dataTable.row(row).data();
        tmp.selectedDeck.set();
        Meteor.setTimeout(function(){
            tmp.selectedDeck.set(rowData._id);
        }, 100);
    },

});


var hooksObject = {
    before: {
        // Replace `formType` with the form `type` attribute to which this hook applies
        method: function(doc) {
            doc._id = Template.instance().parentTemplate(1).selectedDeck.get();
            return doc;
        }
    },
};

AutoForm.hooks({
    AdminDecksArchetypesEditNameAdminEventsEdit: hooksObject
});
