Session.set('noNameSelectedDeck', null);

//++++++++++++++++++++++++
//searchedDeck           +
//++++++++++++++++++++++++
Template.searchedDeck.helpers({
    selectedDeck : function(){
        return Session.get('noNameSelectedDeck');
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

Template.searchedDeck.onRendered(function(){

});

Template.searchedDeck.events({
    'mouseenter .name' : function(evt,tmp){
        var $container = $("#imgPreviewWithStyles").first();
        var $img = $("#floatingImage").eq(0);
        var $deckPicture = $(".deckPicture");
        var $window = $(window);
        var $card = $(evt.target);

        if($container.find('img')[0]){
            $container.find('img')[0].remove();
        }

        var name = $card.text();
        console.log(name);
        var linkAddress = makeLinkFromName(name);
        $img = $('<img>', {class : "cardImage"}).attr("src", linkAddress);
        $container.append($img);
        $container.show();
        if ($window.width() < 980) {
            $container.appendTo('body');
            var offset = $card.offset();
            $container.css({
                top: offset.top - 30 + 'px',
                left: offset.left + $card.width() + 10 + 'px'
            });
        } else{
            $container.css({
                top: 0,
                left: 0
            });
            $container.appendTo($deckPicture);
        }
    },
    'mouseleave .name' : function(evt,tmp){
        var $container = $("#imgPreviewWithStyles").first();
        $container.hide();
    },
    'mousemove .cardRow' : function(evt,tmp){
        //var offset = $(".newdeckWrap").offset();
        //$("#imgPreviewWithStyles").css({
        //    top: (e.pageY - offset.top) + 10 + 'px',
        //    left: (e.pageX - offset.left) + 10 + 'px'
        //});
    }
});

Template.searchedDeck.onCreated(function(){
    var instance = this;
    this.autorun(function(){
        instance.subscribe('joinCards', Session.get("noNameSelectedDeck"));
    });
});

Template.searchedDeck.destroyed = function(){
    Session.set('noNameSelectedDeck', null);
    Session.set("noNameDeckFormat", null);
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
    "click .closeModal" : function(evt, tmp){
        Session.set('showDeckPopOutOption', false);
        //Session.set('badDeckChoose',false);
    },
    "click .selectDeckType" : function(evt, tmp){
        Meteor.call('updateDeckType', Session.get('noNameSelectedDeck'), $(evt.target).attr("data-deck-name"));
        //_Deck.update({_id : Session.get('noNameSelectedDeck')},{
        //    $set : {type : $(evt.target).attr("data-deck-type")}
        //});
    },
    "click .addNewDeck" : function(evt, tmp){
       var name = $(evt.target).prev().val();
       Meteor.call('addDeckName', Session.get('noNameSelectedDeck'), name);
       Meteor.call('findOneDeckWithoutName',Session.get('noNameSelectedDeck'), function (error, data) {
           if (error) {
               console.log(error);
               return;
           }
           Session.set('uniqueDeckPercentageOptions', data);
       });
    }
});
Template.deckPercentageOptions_COL.onRendered(function(){

});
Template.deckPercentageOptions_COL.onCreated(function(){

});


//+++++++++++++++++++++++++
//LISTdeckwithoutname_COL +
//+++++++++++++++++++++++++

Template.LISTdeckwithoutname_COL.helpers({
    deckOptions : function(){
        return _Deck.find({format : Session.get("noNameDeckFormat"), name :{$exists : false}  }, {limit : 8}).fetch();
        //return Session.get('deckPercentageOptions');
    }, isActive : function(){
        if(Session.get("noNameSelectedDeck") === this._id){
            return true;
        }
    }
    //,
    //format : function(){
    //    return Session.get("noNameDeckFormat");
    //}
});
Template.LISTdeckwithoutname_COL.events({
    "click .noNameDeckID" : function(evt, template){
    }
});
Template.LISTdeckwithoutname_COL.onRendered(function(){

});
Template.LISTdeckwithoutname_COL.onCreated(function(){

});

//+++++++++++++++++++
//topDeckList
//+++++++++++++++++++

Template.deckList_COL.helpers({

    artifact : function(){
        var names = [];
        _JoinCardsData.find({creature : false, artifact : true}).forEach(function(e){names.push(e.name);});
        return _DeckCards.find({sideboard : false, name : {$in : names}});
    }, artifactQuantity : function(){
        var options = { creature : false, artifact : true};
        return getQuantity(options, false);
    }, creature : function(){
        var names = [];
        _JoinCardsData.find({creature : true}).forEach(function(e){names.push(e.name);});
        return _DeckCards.find({sideboard : false, name : {$in : names}});
    }, creatureQuantity : function(){
        var options = { creature : true};
        return getQuantity(options, false);
    }, planeswalker : function(){
        var names = [];
        _JoinCardsData.find({planeswalker : true}).forEach(function(e){names.push(e.name);});
        return _DeckCards.find({sideboard : false, name : {$in : names}});
    }, planeswalkerQuantity : function(){
        var options = { planeswalker : true};
        return getQuantity(options, false);
    }, enchantment : function(){
        var names = [];
        _JoinCardsData.find({enchantment : true, creature : false, artifact : false}).forEach(function(e){names.push(e.name);});
        return _DeckCards.find({sideboard : false, name : {$in : names}});
    }, enchantmentQuantity : function(){
        var options = { enchantment : true, creature : false, artifact : false};
        return getQuantity(options, false);
    }, instant : function(){
        var names = [];
        _JoinCardsData.find({instant : true}).forEach(function(e){names.push(e.name);});
        return _DeckCards.find({sideboard : false, name : {$in : names}});
    }, instantQuantity : function() {
        var options = {instant : true};
        return getQuantity(options, false);
    }, sorcery : function(){
        var names = [];
        _JoinCardsData.find({sorcery : true}).forEach(function(e){names.push(e.name);});
        return _DeckCards.find({sideboard : false, name : {$in : names}});
    }, sorceryQuantity : function(){
        var options = { sorcery : true};
        return getQuantity(options, false);
    }, land : function(){
        var names = [];
        _JoinCardsData.find({land : true, creature : false, artifact : false}).forEach(function(e){names.push(e.name);});
        return _DeckCards.find({sideboard : false, name : {$in : names}});
    }, landQuantity : function(){
        var options = { land : true, creature : false, artifact : false};
        return getQuantity(options, false);
    }, sideboard : function(){
        var names = [];
        _JoinCardsData.find({}).forEach(function(e){names.push(e.name);});
        return _DeckCards.find({sideboard : true, name : {$in : names}});
    }, sideboardQuantity: function () {
        var options = {};
        return getQuantity(options, true);
    },
    Quantity : function(){
        var options = {};
        return getQuantity(options, true);
    }
});

//add a class where the object is hovered

Template.deckList_COL.events({
    //'mouseenter .cardRow' : function(evt,tmp){
    //
    //    if($(".deckPicture .cardImage")[0]){
    //        $(".deckPicture .cardImage")[0].remove();
    //    }
    //    $(".hoveredPicture .image").attr("src", finalDirectory);
    //    var cardName = $(evt.target).find(".name").text();
    //    var finalDirectory = makeLinkFromName(cardName);
    //    $img = $('<img>', {class : "cardImage img-responsive"}).attr("src", "http://69.195.122.106/nicholas/mtgpics/s/Spellskite.full.jpg");
    //    $img.attr("src", finalDirectory);
    //    $(".deckPicture").append($img);
    //}

    //'mouseenter .name' : function(evt,tmp){
    //    var $container = $("#imgPreviewWithStyles").first();
    //    var $img = $("#floatingImage").eq(0);
    //    var $deckPicture = $(".deckPicture");
    //    var $window = $(window);
    //    var $card = $(evt.target);
    //
    //    if($container.find('img')[0]){
    //        $container.find('img')[0].remove();
    //    }
    //
    //    var name = $card.text();
    //    console.log(name);
    //    var linkAddress = makeLinkFromName(name);
    //    $img = $('<img>', {class : "cardImage"}).attr("src", linkAddress);
    //    $container.append($img);
    //    $container.show();
    //    if ($window.width() < 980) {
    //        $container.appendTo('body');
    //        var offset = $card.offset();
    //        $container.css({
    //            top: offset.top - 30 + 'px',
    //            left: offset.left + $card.width() + 10 + 'px'
    //        });
    //    } else{
    //        $container.css({
    //            top: 0,
    //            left: 0
    //        });
    //        $container.appendTo($deckPicture);
    //    }
    //},
    //'mouseleave .name' : function(evt,tmp){
    //    var $container = $("#imgPreviewWithStyles").first();
    //    $container.hide();
    //},
    //'mousemove .cardRow' : function(evt,tmp){
    //    //var offset = $(".newdeckWrap").offset();
    //    //$("#imgPreviewWithStyles").css({
    //    //    top: (e.pageY - offset.top) + 10 + 'px',
    //    //    left: (e.pageX - offset.left) + 10 + 'px'
    //    //});
    //}

});




Template.deckList_COL.onRendered(function(){
    //console.log($(".newDeckColumn"));
    //console.log($(".typeBlock .sideboard"));
    //var sideboardQuantity = getQuantity({}, true);

    var cardQuantity = _DeckCards.find({sideboard : false});
    console.log(cardQuantity.count());
    //console.log(sideboardQuantity);

    $(".newDeckColumn").css({
        "-webkit-column-count" : "2",
        "-moz-column-count" : "2",
        "column-count" : "2"
    });
});

//+++++++++++++++++++
//sideBoard_COL
//+++++++++++++++++++

Template.sideBoard_COL.helpers({
    sideboard: function () {
        var names = [];
        _JoinCardsData.find({}).forEach(function (e) {
            names.push(e.name);
        });
        return _DeckCards.find({sideboard: true, name: {$in: names}});
    },sideboardQuantity: function () {
        var options = {};
        return getQuantity(options, true);
    }
});
