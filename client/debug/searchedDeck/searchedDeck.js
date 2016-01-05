SV_deckNamingFormat = "deckNamingFormat";
Session.set(SV_deckNamingFormat, "");
//++++++++++++++++++++++++
//searchedDeck           +
//++++++++++++++++++++++++
Template.searchedDeck.helpers({
    selectedDeck : function(){
        return Router.current().params.deckID;
    }
});
Template.searchedDeck.events({
    'click .goodDecks' : function(evt, tmp) {
        Meteor.call('findDeckByType', function(error, data) {
            if (error) {
                console.log(error);
                return;
            }
            Session.set('thing', data);
        });
    }, 'click .getEvents' : function(evt, tmp) {
        Meteor.call('getEvents', function (error, data) {
            if (error) {
                console.log(error);
                return;
            }
        });
    }
});

Template.searchedDeck.destroyed = function(){
    //Session.set('noNameSelectedDeck', null);
    //Session.set("noNameDeckFormat", null);
};

//+++++++++++++++++++++++++++
//deckPercentageOptions_COL +
//+++++++++++++++++++++++++++

Template.deckPercentageOptions_COL.helpers({
    deckName : function(){
        return Session.get("uniqueDeckPercentageOptions");
    }
});
Template.deckPercentageOptions_COL.events({
    "click .selectDeckType" : function(evt, tmp){
        Session.set("uniqueDeckPercentageOptions", null);
        Meteor.call('addDeckName', Router.current().params.deckID, $(evt.target).attr("data-deck-name"), function(error, data){
            var deckID = _Deck.findOne();
            Meteor.defer(function () {
                Router.go('debug', {format: Session.get(SV_deckNamingFormat), deckID: deckID._id});
            });
        });
    },
    "click .addNewDeck" : function(evt, tmp){
       var name = $(evt.target).prev().val();
       Session.set("uniqueDeckPercentageOptions", null);
       //Meteor.call('findOneDeckWithoutName',Router.current().params.deckID, function (error, data) {
       //    if (error) {
       //        console.log(error);
       //        return;
       //    }
       //    Session.set('uniqueDeckPercentageOptions', data);
       //});
        Meteor.call('addDeckName', Router.current().params.deckID, name, function(error,data) {
            var deckID = _Deck.findOne();
            Router.go('debug', {format: Router.current().params.format, deckID: deckID._id})
        });


    }
});

//+++++++++++++++++++++++++
//LISTdeckwithoutname_COL +
//+++++++++++++++++++++++++

Template.LISTdeckwithoutname_COL.helpers({
    deckOptions : function(){
        return _Deck.find({});
    }, isActive : function(){
        if(Router.current().params.deckID === this._id){
            return true;
        }
    }
});

//+++++++++++++++++++
//deckList_COL
//+++++++++++++++++++

Template.deckList_COL.helpers({
    cardType : function(){
        var blocks = ["artifact", "creature", "enchantment", "instant", "planeswalker", "sorcery", "land"];
        var types = [];
        for(var i = 0; i< blocks.length; i++){
            if(blocks[i]=="artifact"){
                var options = {creature : false, artifact : true};
                var quantity = getQuantity(options, false);
                if(quantity > 0){types.push({name : "Artifact", quantity : quantity, options : options});}
            }else if(blocks[i]=="creature"){
                var options = { creature : true};
                var quantity = getQuantity(options, false);
                if(quantity > 0){types.push({name : "Creature", quantity : quantity, options : options})};
            }else if(blocks[i]=="enchantment"){
                var options = {enchantment : true, creature : false, artifact : false};
                var quantity = getQuantity(options, false);
                if(quantity > 0){types.push({name : "Enchantment", quantity : quantity, options : options})};
            }else if(blocks[i]=="instant"){
                var options = {instant : true};
                var quantity = getQuantity(options, false);
                if(quantity > 0){types.push({name : "Instant", quantity : quantity, options : options})};
            }else if(blocks[i]=="land"){
                var options = {land : true, creature : false, artifact : false};
                var quantity = getQuantity(options, false);
                if(quantity > 0){types.push({name : "Land", quantity : quantity, options : options})};
            }else if(blocks[i]=="planeswalker"){
                var options = {planeswalker : true};
                var quantity = getQuantity(options, false);
                if(quantity > 0){types.push({name : "Planeswalker", quantity : quantity, options : options})};
            }else if(blocks[i]=="sorcery"){
                var options = {sorcery : true};
                var quantity = getQuantity(options, false);
                if(quantity > 0){ types.push({name : "Sorcery", quantity : quantity, options : options})};
            }
        }
        return types;
    }
    ,cards : function(options){
        var names = _CardDatabase.find(options).map(function(p) { return p.name });
        return _DeckCards.find({_deckID : Router.current().params.deckID, sideboard : false, name : {$in : names}});
    }, sideboard : function(){
        return _DeckCards.find({_deckID : Router.current().params.deckID, sideboard : true});
    },
    sideboardQuantity: function () {
        var options = {};
        return getQuantity(options, true);
    },
    manaCost : function(card){
        return '';
    }

});

//add a class where the object is hovered

Template.deckList_COL.events({
    'mouseenter .name' : function(evt,tmp){
        if($('#imgPreviewWithStyles')[0]){
            $('#imgPreviewWithStyles')[0].remove();
        }

        $container = $("<div>", {id: "imgPreviewWithStyles", class: "a"});
        var $deckPicture = $(".deckPicture");

        var $window = $(window);
        var $card = $(evt.target);

        var name = $card.text();
        var linkAddress = makeLinkFromName(name);
        $img = $('<img>', {class : "cardImage"}).attr("src", linkAddress).load(function() {

        });
        $container.append($img);
        $container.show();
        if ($window.width() < 980) {
            $container.appendTo('body');
            var offset = $card.offset();
            $container.css({
                top: offset.top - 30 + 'px',
                left: offset.left + $card.width() + 10 + 'px'
            });
        } else {
            $container.css({
                top: 0,
                left: 0
            });
            $container.appendTo($deckPicture);
        }
    },
    'mouseleave .name' : function(evt,tmp){
        $container.remove();
    },
    'mousemove .cardRow' : function(evt,tmp){
        //var offset = $(".newdeckWrap").offset();
        //$("#imgPreviewWithStyles").css({
        //    top: (e.pageY - offset.top) + 10 + 'px',
        //    left: (e.pageX - offset.left) + 10 + 'px'
        //});
    }
});


Template.deckList_COL.onRendered(function(){
    //console.log($(".newDeckColumn"));
    //console.log($(".typeBlock .sideboard"));
    //var sideboardQuantity = getQuantity({}, true);

    var cardQuantity = _DeckCards.find({sideboard : false});

    $(".newDeckColumn").css({
        "-webkit-column-count" : "2",
        "-moz-column-count" : "2",
        "column-count" : "2"
    });
});

//var userIds = topPostsCursor.map(function(p) { return p.userId });