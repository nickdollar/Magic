Session.set('_selectedEventID', null);
Session.set('_selectedDeckID', null);

//++++++++++++++++++++++++
//searchedDeck           +
//++++++++++++++++++++++++
Template.event.helpers({
    selectedDeck : function(){
        return Session.get('_selectedDeckID');
    }
});
Template.event.events({

});

Template.event.onRendered(function(){

});

Template.event.events({
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

Template.event.onCreated(function(){
    var instance = this;
    this.autorun(function(){
        instance.subscribe('joinCards', Session.get("_selectedDeckID"));
        instance.subscribe('deck');
        console.log(_JoinCardsData.find());
    });
});

Template.event.destroyed = function(){
    Session.set('noNameSelectedDeck', null);
    Session.set("noNameDeckFormat", null);
};


//+++++++++++++++++++++++++
//LISTdeckwithoutname_COL +
//+++++++++++++++++++++++++

Template.event_LISTdeckwithoutname_COL.helpers({
    deckOptions : function(){
        console.log(_Deck.find());
        console.log("deckOptions");
        console.log(Session.get("_selectedEventID"));
        console.log(_Deck.find({_eventID : Session.get("_selectedEventID")}, {limit : 8}).fetch());
        return _Deck.find({_eventID : Session.get("_selectedEventID")}, {limit : 8}).fetch();
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
Template.event_LISTdeckwithoutname_COL.events({
    "click .noNameDeckID" : function(evt, template){
    }
});
Template.event_LISTdeckwithoutname_COL.onRendered(function(){

});
Template.event_LISTdeckwithoutname_COL.onCreated(function(){

});

//+++++++++++++++++++
//topDeckList
//+++++++++++++++++++

Template.event_deckList_COL.helpers({

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

Template.event_deckList_COL.events({
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


function makeLinkFromName(cardName){
    cardName = encodeURI(cardName);
    cardName = cardName.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "%22;").replace(/'/g, "%27");
    var linkBase = "http://69.195.122.106/nicholas/mtgpics/";
    var folderLetter = cardName.charAt(0).toLocaleLowerCase();
    var finalDirectory = linkBase+folderLetter+"/"+cardName+".full.jpg";
    return finalDirectory;
}

Template.event_deckList_COL.onRendered(function(){
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

//+++++++++++++++++
//sideBoard_COL   +
//+++++++++++++++++

Template.event_sideBoard_COL.helpers({
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


