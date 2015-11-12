SV_decksSelectedDeckName = "selectedDeckName";
Session.set(SV_decksSelectedDeckName, "");
SV_decksSelectedFormat = "selectedFormat";
Session.set(SV_decksSelectedFormat, "");
SV_decksSelectedEventType = "eventType";
Session.set(SV_decksSelectedEventType, "daily");


Template.exampleDeck_COL.helpers({
    cardType : function(){
        var blocks = ["artifact", "creature", "enchantment", "instant", "planeswalker", "sorcery", "land"];
        var types = [];
        for(var i = 0; i< blocks.length; i++){
            if(blocks[i]=="artifact"){
                var options = {creature : false, artifact : true};
                var quantity = getQuantity2(options, false);
                if(quantity > 0){types.push({name : "Artifact", quantity : quantity, options : options});}
            }else if(blocks[i]=="creature"){
                var options = { creature : true};
                var quantity = getQuantity2(options, false);
                if(quantity > 0){types.push({name : "Creature", quantity : quantity, options : options})};
            }else if(blocks[i]=="enchantment"){
                var options = {enchantment : true, creature : false, artifact : false};
                var quantity = getQuantity2(options, false);
                if(quantity > 0){types.push({name : "Enchantment", quantity : quantity, options : options})};
            }else if(blocks[i]=="instant"){
                var options = {instant : true};
                var quantity = getQuantity2(options, false);
                if(quantity > 0){types.push({name : "Instant", quantity : quantity, options : options})};
            }else if(blocks[i]=="land"){
                var options = {land : true, creature : false, artifact : false};
                var quantity = getQuantity2(options, false);
                if(quantity > 0){types.push({name : "Land", quantity : quantity, options : options})};
            }else if(blocks[i]=="planeswalker"){
                var options = {planeswalker : true};
                    var quantity = getQuantity2(options, false);
                    if(quantity > 0){types.push({name : "Planeswalker", quantity : quantity, options : options})};
            }else if(blocks[i]=="sorcery"){
                var options = {sorcery : true};
                var quantity = getQuantity2(options, false);
                if(quantity > 0){ types.push({name : "Sorcery", quantity : quantity, options : options})};
            }
        }
        return types;
    },
    cards : function(options){
        var names = _CardDatabase.find(options).map(function(p) { return p.name });
        var deck = _Deck.findOne({eventType: Session.get(SV_decksSelectedEventType)});
        return _DeckCards.find({ _deckID : deck._id, sideboard : false, name : {$in : names}});
    },
    sideboard : function(){
        var names = _CardDatabase.find({}).map(function(p) { return p.name });
        var deck = _Deck.findOne({eventType: Session.get(SV_decksSelectedEventType)});
        return _DeckCards.find({_deckID : deck._id, sideboard : true, name : {$in : names}});
    },
    sideboardQuantity: function() {
        var options = {};
        return getQuantity2(options, true);
    },
    test : function(test){
        console.log(test);
        console.log(_DeckCards.find({}));
    },
    event : function(_deckID) {
        var _eventID = _Deck.findOne({_id: _deckID})._eventID;
        return _Event.findOne({_id: _eventID}).eventType;
    },
    manaCost : function(card){
        return '';
    }
});

Template.exampleDeck_COL.events({
    'click .getDaily' : function(){
        Session.set(SV_decksSelectedEventType, "daily");
    },
    'click .getPTQ' : function(){
        Session.set(SV_decksSelectedEventType, "ptq");
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
        var date = getWeekStartAndEnd();
        var weekQuantity = 6;
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
        return _cardBreakDownCards.find({format : Session.get(SV_decksSelectedFormat),  deckName: Session.get(SV_decksSelectedDeckName), type : false}, {sort : {weekTotal : -1}});
    },
    cardWeek : function(cardName){

        var date = getWeekStartAndEnd();
        var weekQuantity = 6;
        var week = 7;
        var oldDate = new Date(date.weekStart);
        oldDate.setDate(oldDate.getDate() - week*(weekQuantity-1));

        var values = [];

        createAFunctionForGradient();

        var oldValue = 0;
        var oldColor = "";
        for(var i = 0; i< weekQuantity ;i++){
            var newValue = 0;
            if(_cardBreakDownDate.find({name : cardName, date :  oldDate}, {limit : 1}).count() == 0){
                newValue = 0;
            }else{
                newValue = _cardBreakDownDate.findOne({name : cardName, date : oldDate}).quantity;
            }

            var newColor = "";
            if(oldValue > newValue){
                newColor = getColorForPercentageNegative(newValue/4);
            }else if (oldValue < newValue){
                newColor = getColorForPercentagePositive(newValue/4);
            }else{
                newColor = oldColor;
            }
            oldValue = newValue;
            oldColor = newColor;

            values.push({value : newValue, color : newColor});

            oldDate.setDate(oldDate.getDate() + week);
        }
        return values;
    }
});

Template.cardsPercentage_ROW.events({
   'click .getDeckPercentage' : function(){
        Meteor.call('cardsPercentage',Session.get(SV_decksSelectedFormat), Session.get(SV_decksSelectedDeckName));
   }
});