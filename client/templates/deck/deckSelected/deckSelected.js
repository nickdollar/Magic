SV_decksSelectedDeckName = "selectedDeckName";
Session.set(SV_decksSelectedDeckName, "");
SV_decksSelectedEventType = "eventType";
Session.setDefault(SV_decksSelectedEventType, "daily");




Template.exampleDeck_COL.helpers({
    cardType : function(){
        var blocks = ["artifact", "creature", "enchantment", "instant", "planeswalker", "sorcery", "land"];
        var types = [];
        for(var i = 0; i< blocks.length; i++){
                var quantity = getQuantity2(blocks[i], false, Session.get(SV_decksSelectedEventType));
                if(quantity > 0){types.push({name : capitalizeFirstLetter(blocks[i]), quantity : quantity, block : blocks[i]});}
        }
        console.log(types);
        return types;
    },
    cards : function(block){
        var names = _CardDatabase.find(typeOptions[block]).map(function(p) { return p.name });
        var deck = _Deck.findOne({eventType: Session.get(SV_decksSelectedEventType)});
        return _DeckCards.find({ _deckID : deck._id, sideboard : false, name : {$in : names}});
    },
    sideboard : function(){
        var names = _CardDatabase.find({}).map(function(p) { return p.name });
        var deck = _Deck.findOne({eventType: Session.get(SV_decksSelectedEventType)});
        return _DeckCards.find({_deckID : deck._id, sideboard : true, name : {$in : names}});
    },
    sideboardQuantity: function() {
        return getQuantity2(null, true, Session.get(SV_decksSelectedEventType));
    },
    test : function(test){

    },
    event : function(_deckID) {
        var _eventID = _Deck.findOne({_id: _deckID})._eventID;
        return _Event.findOne({_id: _eventID}).eventType;
    },
    manaCost : function(card){
        return '';
    },
    daily : function(){
        return _Deck.findOne({eventType : "daily"}) != null ? "" : "disabled";
    },
    ptq : function(){
        return _Deck.findOne({eventType : "ptq"}) != null ? "" : "disabled";
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

Template.exampleDeck_COL.onRendered(function(){
    var values = this;
});


Template.playList_ROW.events({
   "click .addAYoutubeVideo" : function(evt, tmp){
       var link = $(evt.target).prev().val();
        Meteor.call('insertNewPlayList', link, Router.current().params.deckSelected.replace(/-/," "), Router.current().params.format);
   }
});

Template.playList_ROW.helpers({
    playlist : function(){
        return _DeckPlayList.find({_deckName : Router.current().params.deckSelected.replace(/-/," ")});
    },
    image : function(_imageID){
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
        return _deckCardsWeekChange.find({format : Router.current().params.format,
                                          deckName: Router.current().params.deckSelected.replace(/-/," "),
                                          land : false, sideboard : false}, {sort : {weekTotal : -1}});
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


            if(_deckCardsWeekChange.find({name : cardName, date :  oldDate}, {limit : 1}).count() == 0){
                newValue = 0;
            }else{
                newValue = _deckCardsWeekChange.findOne({name : cardName, date : oldDate}).quantity;
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


Template.cardsPercentageSideboard_ROW.helpers({
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
        return _deckCardsWeekChange.find({format : Router.current().params.format,
            deckName: Router.current().params.deckSelected.replace(/-/," "),
            land : false, sideboard : true}, {sort : {weekTotal : -1}});
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


            if(_deckCardsWeekChange.find({name : cardName, date :  oldDate}, {limit : 1}).count() == 0){
                newValue = 0;
            }else{
                newValue = _deckCardsWeekChange.findOne({name : cardName, date : oldDate}).quantity;
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


Template.deckOptions.helpers({
    decksOptions : function(){
       return _deckArchetypes.findOne({archetype : Router.current().params.archetype.replace(/-/g," ")});
    }
});

Template.deckOptions.events({
    "click .deckOptions" : function(evt, tmp){
        Router.go('deckSelected', {format : Router.current().params.format.replace(/ /g,"-"), archetype: Router.current().params.archetype.replace(/ /g,"-"), deckSelected : $(evt.target).html().replace(/ /g,"-")});
    }
});

Template.deckSelected.helpers({
    isSelected : function(){
        return Router.current().params.deckSelected != null ? true : false;
    }
});

Template.events_COL.helpers({
    event : function(){
        var decks = _Deck.find({}).fetch();
        var list = [];
        for(var i = 0; i < decks.length; i++){
            var eventData = {};
            var event = _Event.findOne({_id :decks[i]._eventID});

            eventData.position = decks[i].eventType == "ptq" ? decks[i].position : decks[i].victory + "-" + decks[i].loss;
            eventData.date = event.date;
            eventData.eventType = event.eventType;
            eventData.httpAddress = event.httpAddress;
            eventData._eventNumber = event._eventNumber;
            eventData.players = event.players;
            list.push(eventData);
        }

        return list;
    }
})

