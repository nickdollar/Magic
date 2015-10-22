_JoinCardsData = new Meteor.Collection('joinCardsChildren');
Session.set('selectedIdDeck', null);
Session.set('selectedFormat', null);
Session.set('thing', null);
Session.set('badDecks', null);
Session.set('badDeckChoose', null);
Session.set('SelectedDeckName', null);
Session.set('SelectedDeckNameID', null);
Session.set('showDeckPopOut', false);
Session.set('showDeckPopOutOption', false);
Session.set('selectedDeck', null);
Session.set('deckPercentageOptions', null);
Session.set('showDeckPopOutOptionSelectedDeck', null);
Session.set("uniqueDeckPercentageOptions", null);

//++++++++++++++++++++++
//IRONdeckNaming       +
//++++++++++++++++++++++

Template.IRONdeckNaming.onCreated(function(){
    this.subscribe('decknames');
    this.subscribe('counters');
});

Template.IRONdeckNaming.helpers({
    showDeckPopOut : function(){
        return Session.get('showDeckPopOut');
    },
    showdeckPopOutOption : function(){
        return Session.get('showDeckPopOutOption');
    }

});

Template.IRONdeckNaming.onCreated(function(){
    var instance = this;
    this.autorun(function(){
        instance.subscribe('deck');
        instance.subscribe('event');
    });
});


//+++++++++++++++++++++++++
//deckNames               +
//+++++++++++++++++++++++++


Template.deckNames.helpers({
    names : function() {
        return _SelectedNameDeckNames.find({deckName_id : Session.get('selectedIdDeck')});
    },
    deckCardNameRest : function() {
        return _DeckNames.find({deckName_id : this._id}, {sort : {vote : 1}, skip : 1});
    }
});
Template.deckNames.events({
    'click .editESPAN' : function(evt, tmp)
    {
        $(evt.target)[0].style.display="none";
        $(evt.target).next()[0].value=$(evt.target).text();
        $(evt.target).next()[0].style.display="block";
        $(evt.target).next()[0].focus();
    },
    'blur .editINPUT' : function(evt, tmp)
    {
        var temp1 = $(evt.target).prev().text();
        var temp2 = $(evt.target).val();

        if(temp1 != temp2)
        {
            _DeckNames.update(
                {_id : this._id},
                {
                    $set : {
                        name: $(evt.target).val()
                    }
                });
        }
        $(evt.target)[0].style.display="none";
        $(evt.target).prev()[0].style.display="block";
    },
    'click .removeName' : function(evt,tmp)
    {
        _DeckNames.remove( {_id : this._id});
    }
});



//+++++++++++++++++++++++++
//formatOptions           +
//+++++++++++++++++++++++++

Template.formats.events({
    'click .selectFormat' : function(evt, tmp){
        if($(evt.target).text() == "No Format Yet")
        {
            Session.set('selectedFormat', null);
        }else{
            Session.set('selectedFormat', $(evt.target).text());
        }

    },
    'click .createOneMoreDeck' : function(evt, tmp){

    }
});

//++++++++++++++++++++++
//cardsTop             +
//++++++++++++++++++++++

Template.cardsTop.helpers({

});
Template.cardsTop.events({

});

//++++++++++++++++++++++++++
//Search                   +
//++++++++++++++++++++++++++

Template.search.helpers({
    search : function(query, sync, callback) {
        Meteor.call('search', query, {}, function(err, res) {
            if (err) {
                console.log(err);
                return;
            }
            callback(res.map(function(it){
                return { value : it.name};
            }));
        });
    }
});
Template.search.onRendered(function () {
    Meteor.typeahead.inject();
});
Template.search.events({
    'click .addCard' : function(evt, tmp){
        _DeckNamesCards.insert({
            deckName_id : Session.get('selectedIdDeck'),
            name : tmp.find('.tt-input').value,
            type : 2
        })
    }
});

//+++++++++++++++++++++++++
//nameDeck                +
//+++++++++++++++++++++++++

Template.nameDeck.helpers({
    goodDecks : function(){
        return Session.get('thing');
    }
});

//+++++++++++++++++++++++++
//deckBlock               +
//+++++++++++++++++++++++++

Template.deckBlock.events({
    "click .noNameDeck" : function(evt, tmp){
        var deckNameID = Template.parentData(0).deckNameID;
        var temp = $.trim($(tmp.find(".nomeDoDeck")).text());
        Session.set('SelectedDeckNameID', deckNameID);
        Session.set('SelectedDeckName', temp);
        Session.set('badDeckChoose', false);
        Session.set("selectedDeck", this.decknameID._str);
        Session.set('showDeckPopOut', true);
    }
});

//+++++++++++++++++++++++++
//nameCardTypeRows        +
//+++++++++++++++++++++++++

Template.nameCardTypeRows.helpers({
    showDeckPopOut : function(){

    },
    cardData : function(){
        return _JoinCardsData.findOne({name : this.name});
    }
});
Template.nameCardTypeRows.events({

});



////+++++++++++++++++++++++++++
////deckWithoutGoodPercentage +
////+++++++++++++++++++++++++++
//
//Template.deckWithoutGoodPercentage.helpers({
//    badDecks : function(){
//        return Session.get('badDecks');
//    }
//
//});
//
//Template.deckWithoutGoodPercentage.events({
//    "click .noNameDeck" : function(evt, template){
//        Session.set("selectedDeck", this._id._str);
//        Session.set('showDeckPopOut', true);
//        Session.set('badDeckChoose', true);
//    }
//});
//
//Template.deckWithoutGoodPercentage.onRendered(function(){
//
//});
//
//Template.deckWithoutGoodPercentage.onCreated(function(){
//
//});
//

Template.registerHelper("getLinkAddress", function(cardName) {
    cardName = encodeURI(cardName);
    cardName = cardName.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "%22;").replace(/'/g, "%27");
    var linkBase = "http://69.195.122.106/nicholas/mtgpics/";
    var folderLetter = cardName.charAt(0).toLocaleLowerCase();
    var finalDirectory = linkBase+folderLetter+"/"+cardName+".full.jpg";
    return finalDirectory;
});
Template.registerHelper("convertToLink", function(cardName) {
    cardName = encodeURI(cardName);
    cardName = cardName.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "%22;").replace(/'/g, "%27");
    var linkBase = "http://69.195.122.106/nicholas/crops/";
    var folderLetter = cardName.charAt(0).toLocaleLowerCase();
    var finalDirectory = linkBase+folderLetter+"/"+cardName+".crop.jpg";
    return finalDirectory;
});
Template.registerHelper("convertToTemplate", function(color) {
    var linkBase = "http://69.195.122.106/nicholas/deckTemplates";
    var finalDirectory = linkBase+"/"+color+".jpg";
    return finalDirectory;
});

