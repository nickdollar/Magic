SV_decksSelectedDeckName = "selectedDeckName";
Session.set(SV_decksSelectedDeckName, "");
SV_decksSelectedFormat = "selectedFormat";
Session.set(SV_decksSelectedFormat, "");

Template.examples_ROW.helpers({
    lastDecks : function(){
        return _Deck.findOne({});
    }
});

Template.examples_ROW.events({

});

Template.examples_ROW.onRendered(function(){

});

Template.examples_ROW.onCreated(function(){
    var instance = this;
    this.autorun(function(){
        instance.subscribe('joinExampleCards', Session.get(SV_decksSelectedDeckName), Session.get(SV_decksSelectedFormat));
        instance.subscribe('event');
        instance.subscribe('images');
        instance.subscribe('deckplaylist');
        instance.subscribe('cardbreakdowndate');
        instance.subscribe('cardbreakdowncards');
    });
});

Template.exampleDeck_COL.helpers({
    cardType : function(_deckID){
        var blocks = ["artifact", "creature", "enchantment", "instant", "planeswalker", "sorcery", "land"];
        var types = [];
        for(var i = 0; i< blocks.length; i++){
            if(blocks[i]=="artifact"){
                var options = {creature : false, artifact : true};
                var quantity = getQuantity2(options, false, _deckID);
                if(quantity > 0){types.push({name : "Artifact", quantity : quantity, options : options});}
            }else if(blocks[i]=="creature"){
                var options = { creature : true};
                var quantity = getQuantity2(options, false, _deckID);
                if(quantity > 0){types.push({name : "Creature", quantity : quantity, options : options})};
            }else if(blocks[i]=="enchantment"){
                var options = {enchantment : true, creature : false, artifact : false};
                var quantity = getQuantity2(options, false, _deckID);
                if(quantity > 0){types.push({name : "Enchantment", quantity : quantity, options : options})};
            }else if(blocks[i]=="instant"){
                var options = {instant : true};
                var quantity = getQuantity2(options, false, _deckID);
                if(quantity > 0){types.push({name : "Instant", quantity : quantity, options : options})};
            }else if(blocks[i]=="land"){
                var options = {land : true, creature : false, artifact : false};
                var quantity = getQuantity2(options, false, _deckID);
                if(quantity > 0){types.push({name : "Land", quantity : quantity, options : options})};
            }else if(blocks[i]=="planeswalker"){
                var options = {planeswalker : true};
                    var quantity = getQuantity2(options, false, _deckID);
                    if(quantity > 0){types.push({name : "Planeswalker", quantity : quantity, options : options})};
            }else if(blocks[i]=="sorcery"){
                var options = {sorcery : true};
                var quantity = getQuantity2(options, false, _deckID);
                if(quantity > 0){ types.push({name : "Sorcery", quantity : quantity, options : options})};
            }
        }
        return types;
    }
    ,cards : function(_deckID, options){
        var names = [];
        _JoinExampleCards.find(options).forEach(function(e){names.push(e.name);});
        return _DeckCards.find({_deckID : _deckID, sideboard : false, name : {$in : names}});
    }, sideboard : function(_deckID){
        var names = [];
        _JoinExampleCards.find({}).forEach(function(e){names.push(e.name);});
        return _DeckCards.find({_deckID : _deckID, sideboard : true, name : {$in : names}});
    },
        sideboardQuantity: function (_deckID) {
        var options = {};
        return getQuantity2(options, true, _deckID);
    },
    test : function(test){
        console.log(test);
        console.log(_DeckCards.find({}));
    },
    Quantity : function(_deckID){
        var options = {};
        return getQuantity2(options, true);
    },
    event : function(_deckID) {
        var _eventID = _Deck.findOne({_id: _deckID})._eventID;
        return _Event.findOne({_id: _eventID}).eventType;
    },
    manaCost : function(card){
        return '';
    }
});

Template.playList_ROW.events({
   "click .addAYoutubeVideo" : function(evt, tmp){
       var link = $(evt.target).prev().val();
        Meteor.call('insertNewPlayList', link, Session.get(SV_decksSelectedDeckName));
   }
});

Template.playList_ROW.helpers({
    playlist : function(){
        return _DeckPlayList.find({_deckName : Session.get(SV_decksSelectedDeckName)});
    },
    image : function(_imageID){
        console.log(_Images.find({}));
        return _Images.findOne({_id : _imageID});
    }
});

Template.cardsPercentage_ROW.helpers({
    weekDates : function(){
        var date = getLastAndFirstDayOfWeekBefore();
        var weekQuantity = 8;
        var week = 7;
        var oldDate = new Date(date.weekStart);
        var newDate = new Date(date.weekEnd);
        oldDate.setDate(oldDate.getDate() - week*(weekQuantity-1));
        newDate.setDate(newDate.getDate() - week*(weekQuantity-1));
        var dates = [];
        for(var i = 0; i< weekQuantity ;i++){
            dates.push(oldDate.getMonth() + "/" + oldDate.getDate() + "-" + newDate.getMonth() + "/" + newDate.getDate());
            oldDate.setDate(oldDate.getDate() + 6);
            newDate.setDate(oldDate.getDate() + 6);
        }
        return dates;
    },
    cards : function(){
        return _cardBreakDownCards.find({deckName : "RWg Burn"}, {sort : {weekTotal : -1}});
    },
    cardWeek : function(cardName){

        var date = getLastAndFirstDayOfWeekBefore();
        var weekQuantity = 8;
        var week = 7;
        var oldDate = new Date(date.weekStart);
        oldDate.setDate(oldDate.getDate() - week*(weekQuantity-1));

        var values = [];
        for(var i = 0; i< weekQuantity ;i++){
            if(_cardBreakDownDate.find({name : cardName, date :  oldDate}, {limit : 1}).count() == 0){
                values.push(0);
            }else{
                values.push(_cardBreakDownDate.findOne({name : cardName, date : {$gte : oldDate}}).quantity);
            }
            oldDate.setDate(oldDate.getDate() + week);
        }
        return values;
    }
});

Template.cardsPercentage_ROW.events({
   'click .getDeckPercentage' : function(){
        Meteor.call('cardsPercentage',Session.get(SV_decksSelectedDeckName));
   }
});