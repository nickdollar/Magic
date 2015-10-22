Session.set("selectedDeck", "Soul Sisters");
Session.set("_choosenDeckID1", null);
Session.set("_choosenDeckID2", null);
Session.set("_choosenDeckID3", null);



Template.examples_ROW.helpers({
    lastDecks : function(){
        return _Deck.find({}, {limit : 2});
    }
});


Template.examples_ROW.events({

});
Template.examples_ROW.onRendered(function(){

});
Template.examples_ROW.onCreated(function(){
    var instance = this;
    this.autorun(function(){
        instance.subscribe('joinExampleCards');
        instance.subscribe('event');
        instance.subscribe('images');
    });
});



Template.exampleDeck_COL.helpers({
    cardType : function(_deckID){
        var blocks = ["artifact", "creature", "enchantment", "instant", "land", "planeswalker", "sorcery"];
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
                var options = {land : true, creature : false, artifact : false}
                var quantity = getQuantity2(options, false, _deckID);
                if(quantity > 0){types.push({name : "Land", quantity : quantity, options : options})};
            }else if(blocks[i]=="planeswalker"){
                var options = {planeswalker : true};
                    var quantity = getQuantity2(options, false, _deckID);
                    if(quantity > 0){types.push({name : "Planeswalker", quantity : quantity, options : options})};
            }else if(blocks[i]=="sorcery"){
                var options = {sorcery : true}
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
        return 'AAAAAA';
    }
});

Template.playList_ROW.events({
   "click .addAYoutubeVideo" : function(evt, tmp){
       var link = $(evt.target).prev().val();
        Meteor.call('insertNewVideo', link);
   }
});

Template.playList_ROW.helpers({
    images : function(){

         return Images.find({});
    }
});