Template.eventsAudit.onCreated(function(){
    var that = this;
    that.selectedEvent = new ReactiveVar;
    this.autorun(function(){
        Meteor.subscribe("_temp2FieldsName");
    });
});

Template.eventsAudit.helpers({
    events : function(){
        return _temp.find({});
    },
    test : function () {
        if(this.validation.exists == null || this.validation.htmlDownloaded == null || this.validation.extractDecks == null){
            return false;
        }

        if(this.validation.exists != null){
            return this.validation.exists;
        }

        if(this.validation.htmlDownloaded != null){
            return this.validation.htmlDownloaded;
        }

        if(this.validation.extractDecks != null){
            return this.validation.extractDecks;
        }
        return true;
    },
    isEventSelected : function(){
        return Template.instance().selectedEvent.get();
    },
    childrenEventId : function(){
        return Template.instance().selectedEvent.get();
    }
});

Template.eventsAudit.events({
    "click .js-idLink" : function(evt, tmp){
        var row = $(event.target).closest('tr').get(0);
        var dataTable = $(event.target).closest('table').DataTable();
        var rowData = dataTable.row(row).data();
        if (!rowData) return; // Won't be data if a placeholder row is clicked

        Template.instance().selectedEvent.set();
        var that = Template.instance();
        Meteor.setTimeout(function(){
            that.selectedEvent.set(rowData._id);
        }, 2);
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
    }
});


Template.auditEventDecks.onCreated(function(){
    this.selectedDeckID = new ReactiveVar;
});


Template.auditEventDecks.helpers({
    selector : function (){
        return {_eventID : Template.instance().data.eventId};
    },
    isDeckSelected : function(){
        return Template.instance().selectedDeckID.get();
    },
    deckFormat : function(){
        return "modern";
    }
})



Template.auditEventDecks.events({
    "click .js-deckID" : function(evt, tmp){
        var row = $(event.target).closest('tr').get(0);
        var dataTable = $(event.target).closest('table').DataTable();
        var rowData = dataTable.row(row).data();
        if (!rowData) return; // Won't be data if a placeholder row is clicked

        Template.instance().selectedDeckID.set();
        var that = Template.instance();
        Meteor.setTimeout(function(){
            that.selectedDeckID.set(rowData);
        }, 2);
    }
});


Template.auditDeckInfo.onCreated(function(){
    var that = Template.instance();
    console.log(that.data.deck);
    that.percentage = new ReactiveVar;
    this.autorun(function(){
        Meteor.subscribe("deckSelectedID", that.data.deck._id);
        Meteor.subscribe("deckNames");
        Meteor.call('methodFindDeckComparison', that.data.deck, function(error, result){
            if(error){
                alert(error);
            }else{
                that.percentage.set(result);
            }
        });
    });
});

Template.auditDeckInfo.helpers({
    cardType : function(){
        var blocks = ["artifact", "creature", "enchantment", "instant", "planeswalker", "sorcery", "land"];
        var types = [];

        for(var i = 0; i< blocks.length; i++){
            var quantity = getQuantity3(blocks[i], false, Template.instance().data.deck._id);
            if(quantity > 0){types.push({name : capitalizeFirstLetter(blocks[i]), quantity : quantity, block : blocks[i]});}
        }
        return types;
    },
    cards : function(block){
        var cardNames = _CardDatabase.find(typeOptions[block]).map(function(p) { return p.name });
        var deck = _temp2.findOne({_id : Template.instance().data.deck._id});

        var newArray = deck.main.filter(function(obj1){
            return cardNames.find(function(obj2){
                return obj1.name == obj2;
            });
        });

        return newArray;
    },
    test : function(){
        return Schema.addDeckName;
    },
    options : function () {
        var decks = _temp3.find({}).map(function(obj){
            console.log(obj);
            return {label : obj.deckName, value : obj.deckName};
        });

        console.log(decks);

        return decks;
    },
    percentage : function(){
        return Template.instance().percentage.get();
    }
});

Template.auditDeckInfo.events({
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
        Meteor.call('methodAddNameToDeck', {deckName : this.deckName, deckID : Template.instance().data.deck._id, format : Template.instance().data.deck.format} );
    }
});


Template.auditDeckInfo.onRendered(function(){

});

Schema.addDeckName = new SimpleSchema({
    deckName: {
        type: String,

        autoform: {
            type: "selectize",
            label : "Deck Name",
            selectizeOptions: {
                create: true
            }
        }
    },
    deckID : {
        type : String
    },
    format : {
        type : String
    }
});


var addNameToDeck = {

    before : {
        method : function(doc){
            doc.deckID = Template.parentData(1).deck._id;
            doc.format = Template.parentData(1).deck.format;
            return doc;
        }
    },
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
        console.log("onSubmit");
    },
    onSuccess: function(formType, result) {
        console.log("onSucess");
    },
    onError: function(formType, error) {
        console.log(error);
        console.log("onError");

    },
    beginSubmit: function() {
        Session.set("playlistTest", false);
    }
}

AutoForm.hooks({
    addNameToDeck : addNameToDeck
});