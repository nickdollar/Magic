_SelectedNameDeckNames = new Meteor.Collection('selectedNameDeckNames');
_SelectedNameDeckFields = new Meteor.Collection('selectedNameDeckFields');
_SelectNameDeckFieldCards = new Meteor.Collection('selectedNamesCardsValues');
_SelectNameDeckNoNameYet = new Meteor.Collection('selectNameDeckNoNameYet');

//+++++++++++++++++++++
//deckFormList        +
//+++++++++++++++++++++

Template.deckFormList.helpers({

});

Template.deckFormList.events({

});

Template.deckFormList.destroyed = function(){
    Session.set('selectedIdDeck', null);
};

//++++++++++++++++++
//nameTable_COL    +
//++++++++++++++++++

Template.nameTable_COL.helpers({
    deckNames : function() {
        if(Session.get('selectedFormat') == null)
        {
            return _DeckNames.find(
                {
                    format : {$exists : false}
                });
        }
        return _DeckNames.find({
                format : Session.get('selectedFormat')
            });
    },
    name : function() {
        var name =_DeckNames.findOne({_id : this._id});
        if(name)
        {
            return name.name;
        } else
        {
            return "No Name";
        }
    },
    choosenFormat : function() {
        var format = _DeckNames.findOne({_id : this._id, format : {$exists : true}});
        if(format==null)
        {
            return "Nope";
        }
        return format.format;
    },
    choosenColors : function() {
        var format = _DeckNames.findOne({_id : this._id, colors : {$exists : true}});
        if(format==null)
        {
            return "No";
        }
        return format.colors;
    },
    choosenType : function() {
        var type = _DeckNames.findOne({_id : this._id, type : {$exists : true}});
        if(type==null)
        {
            return "No Type";
        }
        return type.type;
    }

});
Template.nameTable_COL.onCreated(function(){

});
Template.nameTable_COL.events({
    'click .selectDeck' : function(evt, tmp){
        Session.set('selectedIdDeck', this._id);
    },
    'click .removeDeckID' : function(){
        Meteor.call('removeDeck', this._id);
    }
});
Template.nameTable_COL.onRendered(function (){

});

//++++++++++++++++++
//deckInfo_COL     +
//++++++++++++++++++

Template.deckInfo_COL.helpers({
    isDeckSelected : function(){
        if(Session.get('selectedIdDeck') != null){
            return true;
        }
        return false;
    }
});

Template.deckInfo_COL.events({
    'click .selectDeck' : function(evt, tmp){
        Session.set('selectedIdDeck', this._id);
    },
    'click .removeDeckID' : function(){
        Meteor.call('removeDeck', this._id);
    }
});
Template.deckInfo_COL.onRendered(function (){

});

Template.deckInfo_COL.onCreated(function(){
    var instance = this;
    this.autorun(function(){
        instance.subscribe('deckNamesSelected' , Session.get('selectedIdDeck'));
    });
});

//++++++++++++++++++
//deckInfoForm_COL     +
//++++++++++++++++++

Template.deckInfoForm_COL.helpers({
    name : function(){
        return _DeckNames.findOne({_id : Session.get('selectedIdDeck')}).name;
    },
    checked : function(color){
        var colors = _DeckNames.findOne({_id : Session.get('selectedIdDeck')}).colors;

        if(colors.indexOf(color) === -1)
        {
            return "";
        }
        return "checked";
    },
    format : function(formatArg){
        var format = _DeckNames.findOne({_id : Session.get('selectedIdDeck')}).format;

        if(format === formatArg)
        {

            console.log(format);
            return "selected";
        }
        return "";
    },
    type : function(typeArg){
        var type = _DeckNames.findOne({_id : Session.get('selectedIdDeck')}).type;

        if(type === typeArg)
        {
            return "selected";
        }
        return "";
    }
});

Template.deckInfoForm_COL.events({
    'click .deckUpdate' : function(evt, tmp){
        evt.preventDefault();
        var information = {};

        information.name = $("#inputDeckName").val();
        information.colors = "";
        tmp.findAll("input:checked").forEach(function(color){
            information.colors += color.value;
        });

        information.format = tmp.findAll("option:selected")[0].value;
        information.type = tmp.findAll("option:selected")[1].value;
        Meteor.call('updateDeckNameInformation', information, Session.get('selectedIdDeck'));
    }
});
Template.deckInfoForm_COL.onRendered(function (){

});

Template.deckInfoForm_COL.onCreated(function(){
    var instance = this;
    this.autorun(function(){
        instance.subscribe('selectedNamesCardsValues' , Session.get('selectedIdDeck'));
    });
});

//+++++++++++++++++
//cards           +
//+++++++++++++++++

Template.cards.helpers({
    cardsList : function(){
        return _SelectNameDeckFieldCards.find({});
    }
});

Template.cards.events({
    'click .removeCard' : function() {
        Meteor.call('removeCardFromDeck', this);
    }
});