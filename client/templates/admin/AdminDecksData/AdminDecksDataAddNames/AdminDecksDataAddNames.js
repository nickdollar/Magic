Template.AdminDecksdataAddNames.onCreated(function(){
    var that = this;
    this.selectedDecksData = new ReactiveVar;
    that.deckPercentage = new ReactiveVar;
    that.selectedDeck = new ReactiveVar;
    that.checks = new ReactiveDict();

    this.options = new ReactiveDict();
    this.options.set("format", 'standard');

    this.subscribe('DecksArchetypes');
    this.subscribe("DecksNames");

    this.autorun(function(){
        if(that.selectedDeck.get()){
            that.checks.set("DecksDataCardsDataByDecksdata_id", false);
            Meteor.subscribe("DecksDataCardsDataByDecksdata_id", that.selectedDeck.get(),{
                onReady : function(){
                    that.checks.set("DecksDataCardsDataByDecksdata_id", true);
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


Template.AdminDecksdataAddNames.helpers({
    doc : function(){
        return Events.findOne({_id : FlowRouter.getParam("_id")});
    },
    deckCheck : function(){
        return DecksData.findOne({_id : Template.instance().selectedDeck.get()}) && Template.instance().selectedDeck.get() && Template.instance().checks.get("DecksDataCardsDataByDecksdata_id");;
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
        return AutoForm.getFieldValue("format", "adminNewsDeckNames4");
    },
    allDecksWithoutnameSelector : function(){
        return {format : Template.instance().options.get("format")};
    },
    decksNamesOptions : function(){
        var decks = DecksNames.find({format : Template.instance().options.get("format")}).map(function(obj){
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
        return Template.instance().options.get("format");
    }

})

Template.AdminDecksdataAddNames.events({
    "click .js-deckID" : function(evt, tmp){
        var row = $(event.target).closest('tr').get(0);
        var dataTable = $(event.target).closest('table').DataTable();
        var rowData = dataTable.row(row).data();
        tmp.selectedDeck.set();
        tmp.deckPercentage.set();

        Meteor.setTimeout(function(){
            tmp.selectedDeck.set(rowData._id);
        }, 200);
    },
    "click .js-addNameToDecks" : function(evt, tmp){
        Meteor.call("methodAddNameToDeckAutomatically", tmp.options.get("format"));
    },
    'change input[name="format"]' : function(evt, tmp){
        tmp.options.set("format", $(evt.target).attr("value"));
    },
});


var hooksObject = {
    before: {
        // Replace `formType` with the FormValidate `type` attribute to which this hook applies
        method: function(doc) {
            doc._id = Template.instance().parentTemplate(1).selectedDeck.get();
            return doc;
        }
    },
};

AutoForm.hooks({
    AdminDecksArchetypesEditName3: hooksObject
});