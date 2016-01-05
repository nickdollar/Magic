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


Template.adminArea.helpers({
    archetypesOptions : function() {
        console.log(_deckArchetypes.find({}));
        return _deckArchetypes.find({});
    },
    selected : function()
    {
       if(this.archetype == Router.current().params.archetype.replace(/-/," ")){
                return "selected";
       }
       return "";
    }
});

Template.adminArea.events({
    "click .updateArchetype" : function(evt, tmp){
        var archetype = $(tmp.find('.custom-combobox-input')).val();
        var deckName = Router.current().params.deckSelected.replace(/-/g," ");
        var format = Router.current().params.format;
        if(archetype != ""){
            Meteor.call("addAArchetypeAndNameToArchetype", deckName, archetype, format);
        }
    },
    'click .getDeckPercentage' : function(){
        Meteor.call('cardsPercentage', Router.current().params.format, Router.current().params.deckSelected.replace(/-/g," "));
    },
    'click .removeArchetype' : function(evt, tmp){
        Meteor.call('removeArchetype', Router.current().params.archetype);
    }
});

Template.adminArea.onRendered(function(){

    (function( $ ) {
        $.widget( "custom.combobox", {
            _create: function() {
                this.wrapper = $( "<span>" )
                    .addClass( "custom-combobox" )
                    .insertAfter( this.element );

                this.element.hide();
                this._createAutocomplete();
                this._createShowAllButton();
            },

            _createAutocomplete: function() {

                var selected = this.element.children( ":selected" ),
                    value = selected.val() ? selected.text() : "No Archetype Yet";
                this.input = $( "<input>" )
                    .appendTo( this.wrapper )
                    .val( value )
                    .attr( "title", "" )
                    .addClass( "custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left" )
                    .autocomplete({
                        delay: 0,
                        minLength: 0,
                        source: $.proxy( this, "_source" )
                    })
                    .tooltip({
                        tooltipClass: "ui-state-highlight"
                    });

                this._on( this.input, {
                    autocompleteselect: function( event, ui ) {
                        ui.item.option.selected = true;
                        this._trigger( "select", event, {
                            item: ui.item.option
                        });
                    }
                    //,
                    //autocompletechange: "_removeIfInvalid"
                });
            },

            _createShowAllButton: function() {
                var input = this.input,
                    wasOpen = false;

                $( "<a>" )
                    .attr( "tabIndex", -1 )
                    .attr( "title", "Show All Items" )
                    .tooltip()
                    .appendTo( this.wrapper )
                    .button({
                        icons: {
                            primary: "ui-icon-triangle-1-s"
                        },
                        text: false
                    })
                    .removeClass( "ui-corner-all" )
                    .addClass( "custom-combobox-toggle ui-corner-right" )
                    .mousedown(function() {
                        wasOpen = input.autocomplete( "widget" ).is( ":visible" );
                    })
                    .click(function() {
                        input.focus();

                        // Close if already visible
                        if ( wasOpen ) {
                            return;
                        }

                        // Pass empty string as value to search for, displaying all results
                        input.autocomplete( "search", "" );
                    });
            },

            _source: function( request, response ) {
                var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
                response( this.element.children( "option" ).map(function() {
                    var text = $( this ).text();
                    if ( this.value && ( !request.term || matcher.test(text) ) )
                        return {
                            label: text,
                            value: text,
                            option: this
                        };
                }) );
            },

            _removeIfInvalid: function( event, ui ) {

                // Selected an item, nothing to do
                if ( ui.item ) {
                    return;
                }

                // Search for a match (case-insensitive)
                var value = this.input.val(),
                    valueLowerCase = value.toLowerCase(),
                    valid = false;
                this.element.children( "option" ).each(function() {
                    if ( $( this ).text().toLowerCase() === valueLowerCase ) {
                        this.selected = valid = true;
                        return false;
                    }
                });

                // Found a match, nothing to do
                if ( valid ) {
                    return;
                }

                // Remove invalid value
                this.input
                    .val( "" )
                    .attr( "title", value + " didn't match any item" )
                    .tooltip( "open" );
                this.element.val( "" );
                this._delay(function() {
                    this.input.tooltip( "close" ).attr( "title", "" );
                }, 2500 );
                this.input.autocomplete( "instance" ).term = "";
            },

            _destroy: function() {
                this.wrapper.remove();
                this.element.show();
            }
        });
    })( jQuery );

    $(function() {
        $( "#combobox" ).combobox();
    });

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

