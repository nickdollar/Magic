Template.eventsAudit.onCreated(function(){
    var that = this;
    this.selectedEvent_id = new ReactiveVar;
    this.DecksDataSelected = new ReactiveVar;
    this.percentage = new ReactiveVar;
    this.isDeckReady = new ReactiveVar;

    this.subscribe("DecksNames");
    this.autorun(function(){
        that.subscribe("deckSelectedID", that.DecksDataSelected.get() && that.DecksDataSelected.get()._id, {
            onReady : function (){
                that.isDeckReady.set(true);
            }
        });
    })
});

Template.eventsAudit.helpers({
    events : function(){
        return Events.find({});
    },
    isEventSelected : function(){
        return Template.instance().selectedEvent_id.get();
    },
    cardType : function(){
        var blocks = ["artifact", "creature", "enchantment", "instant", "planeswalker", "sorcery", "land"];
        var types = [];

        for(var i = 0; i< blocks.length; i++){
            var quantity = getQuantity3(blocks[i], false, Template.instance().DecksDataSelected.get()._id);
            if(quantity > 0){types.push({name : capitalizeFirstLetter(blocks[i]), quantity : quantity, block : blocks[i]});}
        }
        return types;
    },
    cards : function(block){
        var cardNames = _CardDatabase.find(typeOptions[block]).map(function(p) { return p.name });
        var deck = DecksData.findOne({_id : Template.instance().DecksDataSelected.get()._id});

        var newArray = deck.main.filter(function(obj1){
            return cardNames.find(function(obj2){
                return obj1.name == obj2;
            });
        });
        return newArray;
    },
    eventsAuditAddNameToDeckSchema : function(){
        return Schema.eventsAuditAddNameToDeck;
    },
    DeckNames_name : function () {
        var decks = DecksNames.find({}).map(function(obj){
            return {label : obj.name, value : obj.name};
        });
        return decks;
    },
    percentage : function(){
        return Template.instance().percentage.get();
    },
    selector : function (){
        return {Events_id : Template.instance().selectedEvent_id.get()};
    },
    isDeckSelected : function(){
        return Template.instance().DecksDataSelected.get();
    },
    isDeckReady : function(){
        return Template.instance().isDeckReady.get();
    },
    DecksData_idValue : function(){
        return Template.instance().DecksDataSelected.get()._id;
    },
    DecksData_formatValue : function(){
        return Template.instance().DecksDataSelected.get().format;
    }

});

Template.eventsAudit.events({
    "click .js-idLink" : function(evt, tmp){
        var row = $(event.target).closest('tr').get(0);
        var dataTable = $(event.target).closest('table').DataTable();
        var rowData = dataTable.row(row).data();
        if (!rowData) return; // Won't be data if a placeholder row is clicked

        Template.instance().selectedEvent_id.set();
        Template.instance().DecksDataSelected.set();
        Template.instance().percentage.set();
        Template.instance().isDeckReady.set();
        var that = Template.instance();
        Meteor.setTimeout(function(){


            that.selectedEvent_id.set(rowData._id);
        }, 2);

        // Meteor.call('methodFindDeckComparison', that.data.deck._id, function(error, result){
        //     if(error){
        //         alert(error);
        //     }else{
        //         that.percentage.set(result);
        //     }
        // });
    },
    "click .js-validationExists" : function(evt, tmp){
        alert("validationExists");
    },
    "click .js-htmlDownloaded" : function(event, tmp){
        var row = $(event.target).closest('tr').get(0);
        var dataTable = $(event.target).closest('table').DataTable();
        var rowData = dataTable.row(row).data();
        if (!rowData) return; // Won't be data if a placeholder row is clicked

        Meteor.call("methodEventLeagueDownloadHtml", rowData._id);
    },
    'click .js-extractDecks': function (event) {
        var row = $(event.target).closest('tr').get(0);
        var dataTable = $(event.target).closest('table').DataTable();
        var rowData = dataTable.row(row).data();
        if (!rowData) return; // Won't be data if a placeholder row is clicked
        Meteor.call("methodEventLeagueExtractDecks", rowData._id);
    },
    "click .js-deckID" : function(evt, tmp){
        var row = $(event.target).closest('tr').get(0);
        var dataTable = $(event.target).closest('table').DataTable();
        var rowData = dataTable.row(row).data();
        if (!rowData) return; // Won't be data if a placeholder row is clicked

        Template.instance().DecksDataSelected.set();
        var that = Template.instance();
        Meteor.setTimeout(function(){
            Meteor.call('methodFindDeckComparison', rowData._id, function(error, result){
                if(error){
                    alert(error);
                }else{
                    that.DecksDataSelected.set(rowData);
                    that.percentage.set(result);
                }
            });
        }, 2);

    },
    "click .js-findDeckComparison" : function(){
        // Meteor.call('methodAddNameToDeck', Router.current().params.format, Router.current().params.deckSelected.replace(/-/," "), function(error, result){
        //     if(error){
        //         alert('Error');
        //     }else{
        //         Session.set("playlistTest", true);
        //         that.playlistsInfo = new ReactiveVar(result);
        //     }
        // });
    },
    "click .js-confirmDeck" : function(){
        console.log("alert");
        console.log(this);
        Meteor.call('methodAddNameToDeck', {DeckName : this.name, DecksData_id : Template.instance().DecksDataSelected.get()._id, format : Template.instance().DecksDataSelected.get().format} );
    }
});

DecksData.helpers({
    name : function() {
        var deckName = DecksNames.findOne({_id: this.DecksNames_id});
        return deckName && deckName.name;
    }
});

if (typeof Schema === 'undefined' || Schema === null) {
    Schema = {};
}

Schema.eventsAuditAddNameToDeck = new SimpleSchema({
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


// var eventsAuditAddNameToDeckHooks = {
//
//     before : {
//         method : function(doc){
//             doc.DecksData_id = Template.instance().parentTemplate(1).DecksDataSelected.get()._id;
//             doc.format = Template.instance().parentTemplate(1).DecksDataSelected.get().format.toLowerCase();
//             return doc;
//         }
//     },
//     onSubmit: function(insertDoc, updateDoc, currentDoc) {
//         console.log("onSubmit");
//     },
//     onSuccess: function(formType, result) {
//         console.log("onSucess");
//     },
//     onError: function(formType, error) {
//         console.log(error);
//         console.log("onError");
//
//     },
//     beginSubmit: function() {
//     }
// }

// AutoForm.hooks({
//     eventsAuditAddNameToDeck : eventsAuditAddNameToDeckHooks
// });