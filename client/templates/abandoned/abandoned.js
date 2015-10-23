//{ removeField : function(field_id) {
//    _DeckNamesField.remove({_id : field_id});
//    _DeckNamesCards.remove({fieldName_id : field_id});
//},
//getLowestDeckNameID : function() {
//    var min = _DeckNamesId.findOne({}, {sort : {deck_id : 1}});
//    var max = _DeckNamesId.findOne({}, {sort : {deck_id : -1}});
//    var ids = _DeckNamesId.find({},{sort : {deck_id : 1}}).fetch();
//
//    if(min == null)
//    {
//        return 1;
//    }
//
//    min = parseInt(min.deck_id);
//    max = parseInt(max.deck_id);
//
//    console.log("Min: " + min);
//    console.log("Max: " + max);
//
//    console.log("Lenght: " + ids.length);
//
//    if(max == ids.length)
//    {
//        return max + 1;
//    }else
//    {
//        var position = 1;
//        console.log("Start Off");
//        for(var i = 0; i<ids.length; i++)
//        {
//            console.log(ids[i].deck_id);
//            if(position != ids[i].deck_id)
//            {
//                return position;
//            }
//            position++;
//        }
//    }
//},
//findBestResult : function(deckID) {
//    console.log("\r\n\r\n");
//    var deckWithoutName = _Deck.find({title: ""}).fetch();
//
//    var Results = [];
//
//    for(var i = 0; i< deckWithoutName.length ; i++)
//    {
//        positive = 0;
//        negative = 0;
//        _DeckCards.find({
//            deck_id : deckWithoutName[i]._id._str,
//            sideboard : false
//        }).forEach(function(card){
//            var result = _DeckNamesCards.find
//            ({
//                deckName_id : deckID,
//                type : 2,
//                name : card.name
//            }).fetch();
//
//            //console.log(result);
//
//            if(result.length == 1){
//                positive++;
//            }else
//            {
//                negative++;
//            }
//        });
//
//        console.log(deckWithoutName[i].playerName + "   \t" + (positive/(positive + negative)) );
//    }
//},
//findBestDeckNames : function(){
//    console.log("\r\n\r\n");
//    var deckWithoutName = _Deck.find({title: ""}).fetch();
//    var deckNameIds = _DeckNamesId.find({}).fetch();
//
//    var results = [];
//
//    for(var i = 0; i< deckWithoutName.length ; i++)
//    {
//        var decksresults = [];
//        var percentage = 0;
//        for(var j = 0 ; j < deckNameIDs.length ; j++){
//            var decknameidcards = _DeckNamesCards.find({deckName_id : decknameids[j]});
//
//            var deckWithoutNameCards = [];
//
//            _DeckCards.find({
//                deck_id : deckWithoutName[i]._id._str,
//                sideboard : false
//            }).forEach(function(card) {
//                deckWithoutNameCards.push(card.name);
//            });
//
//            var result = _DeckNamesCards.find({
//                deckName_id: deckNameIDs[j]._id,
//                type: 2,
//                name: {$in : deckWithoutNameCards}
//            }).fetch();
//
//            percentage = formatNum(result.length/deckWithoutNameCards.length);
//
//            if(percentage > 50)
//            {
//                decksresults.push({
//                    decknameID : deckNameIDs[j]._id,
//                    percentage : percentage
//                });
//
//            }
//        }
//        if(decksresults.length != 0)
//        {
//            results.push(
//                {
//                    id: deckWithoutName[i]._id,
//                    playerName: deckWithoutName[i].playerName,
//                    decksresults: decksresults
//                }
//            );
//        }
//    }
//    return results;
//},
//findZeroDeckNames : function(){
//    console.log("\r\n\r\n");
//    var deckWithoutName = _Deck.find({title: ""}).fetch();
//    var decknameids = _DeckNamesId.find({}).fetch();
//
//    var results = [];
//
//    for(var i = 0; i< deckWithoutName.length ; i++)
//    {
//        var decksresults = [];
//        var percentage = 0;
//        for(var j = 0 ; j < decknameids.length ; j++){
//
//            var decknameidcards = _DeckNamesCards.find({deckName_id : decknameids[j]});
//
//            var deckWithoutNameCards = [];
//
//            _DeckCards.find({
//                deck_id : deckWithoutName[i]._id._str,
//                sideboard : false
//            }).forEach(function(card) {
//                deckWithoutNameCards.push(card.name);
//            });
//
//            var result = _DeckNamesCards.find({
//                deckName_id: decknameids[j]._id,
//                type: 2,
//                name: {$in : deckWithoutNameCards}
//            }).fetch();
//
//            percentage = (result.length/deckWithoutNameCards.length) * 100;
//
//            if(percentage < 50)
//            {
//                decksresults.push({
//                    decknameID : decknameids[j]._id,
//                    percentage : percentage
//                });
//
//            }
//        }
//        if(decksresults.length != 0)
//        {
//            results.push(
//                {
//                    id: deckWithoutName[i]._id,
//                    playerName: deckWithoutName[i].playerName,
//                    decksresults: decksresults
//                }
//            );
//        }
//
//
//    }
//    for(var i = 0 ; i <results.length;i++)
//    {
//        console.log(results[i].playerName);
//        console.log(results[i].id);
//        for(var j = 0 ; j < results[i].decksresults.length; j++)
//        {
//            console.log(results[i].decksresults[j]);
//        }
//    }
//},

//request(address, Meteor.bindEnvironment(function(error, response, body) {
//    if (!error && response.statusCode == 200) {
//        var $ = cheerio.load(body);
//        var field = $($('h5')[0]).html();
//        var quantityPatt = /x\d/i;
//        var xQuantityPatt = /\d/i;
//        var quantity = field.match(quantityPatt)[0].match(xQuantityPatt)[0];
//        console.log(quantity);
//        return quantity;
//    }
//}));


//+++++++++++++++++++++++++++
//deckPopOutOption          +
//+++++++++++++++++++++++++++

//Template.deckPopOutOption.helpers({
//    deckName : function(){
//        var selectedDeck = Session.get("selectedDeck");
//        var decks = Session.get("deckPercentageOptions");
//        console.log(decks);
//        for(var i = 0; i < decks.length; i++){
//            console.log(i);
//            if(decks[i].id === selectedDeck){
//                return decks[i];
//            }
//        }
//    }
//    //,
//    //thing : function(){
//    //    var decks = Session.get("deckPercentageOptions");
//    //    //return
//    //}
//});
//Template.deckPopOutOption.events({
//    "click .closeModal" : function(evt, template){
//        Session.set('showDeckPopOutOption', false);
//        //Session.set('badDeckChoose',false);
//    }
//});
//Template.deckPopOutOption.onRendered(function(){
//
//});
//Template.deckPopOutOption.onCreated(function(){
//
//});


//+++++++++++++++++++++++++
//deckPopOut              +
//+++++++++++++++++++++++++

//Template.deckPopOut.helpers({
//    badDeckChoose : function(){
//        return Session.get('badDeckChoose');
//    },
//    deckName : function(){
//        if(Session.get("Name")){
//            return Session.get("SelectedDeckName");
//        }
//        return "No Name Yet";
//    }
//});
//Template.deckPopOut.events({
//    "click .closeModal" : function(evt, template){
//        Session.set('showDeckPopOut', false);
//        Session.set('badDeckChoose',false);
//    },
//    "click .addName" : function(evt, tmp){
//        var name = tmp.find('.deckname').value;
//        Meteor.call('addDeckName', Session.get('selectedDeck'), name);
//    }
//    ,
//    "click .confirmDeckName" : function(evt, tmp){
//        console.log(Session.get('selectedDeck'));
//        console.log(Session.get("SelectedDeckName"));
//
//        _Deck.update(
//            {_id : new Mongo.ObjectID(Session.get('selectedDeck'))},
//            { $set :
//            {
//                title : Session.get("SelectedDeckName"),
//                titleID : Session.get("SelectedDeckNameID")
//            }
//            }
//        )
//    }
//});
//Template.deckPopOut.onRendered(function(){
//
//});
//Template.deckPopOut.onCreated(function(){
//    var instance = this;
//    this.autorun(function(){
//        instance.subscribe('joinCards' , Session.get('selectedDeck'));
//    });
//});


//,
//mainPictureOption1 : function(){
//
//    var selected = _SelectNameDeckFieldCards.find(
//        {
//            name : this.name,
//            mainPicture : true
//        }).fetch();
//    if(selected.length){
//        return true;
//    }
//
//},
//mainPictureOption2 : function(){
//    var selected = _SelectNameDeckFieldCards.find(
//        {
//            $or : [ {mainPicture : true},
//                {smallPicture1 : true, name : this.name},
//                {smallPicture2 : true, name : this.name}
//            ]
//        }).fetch();
//    if(selected.length){
//        return true;
//    }
//    return false;
//},
//smallPicture1Option1 : function(){
//    var selected = _SelectNameDeckFieldCards.find(
//        {
//            name : this.name,
//            smallPicture1 : true
//        }).fetch();
//    if(selected.length){
//        return true;
//    }
//},
//smallPicture1Option2 : function(){
//    var selected = _SelectNameDeckFieldCards.find(
//        {
//            $or : [ {mainPicture : true, name : this.name},
//                {smallPicture1 : true},
//                {smallPicture2 : true, name : this.name}
//            ]
//        }).fetch();
//    if(selected.length){
//        return true;
//    }
//    return false;
//},
//smallPicture2Option1 : function(){
//    var selected = _SelectNameDeckFieldCards.find(
//        {
//            name : this.name,
//            smallPicture2 : true
//        }).fetch();
//    if(selected.length){
//        return true;
//    }
//},
//smallPicture2Option2 : function(){
//    var selected = _SelectNameDeckFieldCards.find(
//        {
//            $or : [ {mainPicture : true, name : this.name},
//                {smallPicture1 : true, name : this.name},
//                {smallPicture2 : true},
//            ]
//        }).fetch();
//    if(selected.length){
//        return true;
//    }
//    return false;
//}


//Template.cards.events({
//    'click .removeCard' : function(evt, tmp){
//        _DeckNamesCards.remove({ _id : this._id});
//    },
//    'click .mainCard' : function(evt, tmp){
//        _DeckNamesCards.update(
//            {_id : this._id},
//            {$set : {mainPicture : true}}
//        )
//    },
//    'click .mainCardRemove' : function(evt, tmp){
//        _DeckNamesCards.update(
//            {_id : this._id},
//            {$set : {mainPicture : false}}
//        )
//    },
//    'click .smallPic1' : function(evt, tmp){
//        _DeckNamesCards.update(
//            {_id : this._id},
//            {$set : {smallPicture1 : true}}
//        )
//    },
//    'click .smallPicture1Remove' : function(evt, tmp){
//        _DeckNamesCards.update(
//            {_id : this._id},
//            {$set : {smallPicture1 : false}}
//        )
//    },
//    'click .smallPic2' : function(evt, tmp){
//        _DeckNamesCards.update(
//            {_id : this._id},
//            {$set : {smallPicture2 : true}}
//        )
//    },
//    'click .smallPicture2Remove' : function(evt, tmp){
//        _DeckNamesCards.update(
//            {_id : this._id},
//            {$set : {smallPicture2 : false}}
//        )
//    }
//
//});


//,
//getTheDeckRankings : function(type, format) {
//    _Meta.remove({});
//    var format = ["Modern", "Standard", "Vintage", "Legacy"];
//    var type = ["Aggro", "Combo", "Control"];
//
//
//    for (var i = 0; i < format.length; i++) {
//        for (var j = 0; j < type.length; j++) {
//            var deckTypesID = [];
//            _DeckNames.find({
//                format: format[i],
//                type: type[j]
//            }).forEach(function (deck) {
//                deckTypesID.push(deck._id);
//                _Meta.insert({
//                    _id: deck._id,
//                    type: type[j],
//                    format: format[i],
//                    colors : deck.colors
//                });
//            });
//
//            _Meta.find({}).forEach(function (deckType) {
//                var name = _DeckNames.findOne({deckName_id: deckType._id}, {sort: {vote: 1}});
//                _Meta.update(
//                    {_id: deckType._id},
//                    {$set: {name: name.name}}
//                )
//            });
//            _Deck.find({titleID: {$in: deckTypesID}}).forEach(function (deck) {
//                _Meta.update(
//                    {_id: deck.titleID},
//                    {$inc: {quantity: 1}}
//                )
//            });
//
//            _Meta.find({}).forEach(function (deck) {
//                var percentage = formatNum(deck.quantity / _Deck.find({}).count());
//                _Meta.update({_id: deck._id},
//                    {
//                        $set: {
//                            percentage: percentage
//                        }
//                    }
//                )
//            });
//
//
//            _Meta.find({}).forEach(function (deck) {
//
//                var mainPicture = _DeckNamesCards.findOne({
//                    deckName_id: deck._id,
//                    mainPicture: true
//                });
//
//                if (mainPicture) {
//                    mainPicture = mainPicture.name;
//                } else {
//                    mainPicture = "missing";
//                }
//
//                var smallPicture1 = _DeckNamesCards.findOne({
//                    deckName_id: deck._id,
//                    smallPicture1: true
//                });
//                if (smallPicture1) {
//                    smallPicture1 = smallPicture1.name;
//                } else {
//                    smallPicture1 = "missing";
//                }
//
//
//                var smallPicture2 = _DeckNamesCards.findOne({
//                    deckName_id: deck._id,
//                    smallPicture2: true
//                });
//                if (smallPicture2) {
//                    smallPicture2 = smallPicture2.name;
//                } else {
//                    smallPicture2 = "missing";
//                }
//                _Meta.update({_id: deck._id},
//                    {
//                        $set: {
//                            mainPicture: mainPicture,
//                            smallPicture1: smallPicture1,
//                            smallPicture2: smallPicture2
//                        }
//                    }
//                );
//
//            });
//        }
//    }
//}

//artifact : function(_deckID){
//    var names = [];
//    _JoinExampleCards.find({creature : false, artifact : true}).forEach(function(e){names.push(e.name);});
//    return _DeckCards.find({_deckID : _deckID, sideboard : false, name : {$in : names}});
//}, artifactQuantity : function(_deckID){
//    var options = { creature : false, artifact : true};
//    return getQuantity(options, false, _deckID);
//}, creature : function(_deckID){
//    var names = [];
//    _JoinExampleCards.find({creature : true}).forEach(function(e){names.push(e.name);});
//    return _DeckCards.find({_deckID : _deckID, sideboard : false, name : {$in : names}});
//}, creatureQuantity : function(_deckID){
//    var options = { creature : true};
//    return getQuantity2(options, false, _deckID);
//}, planeswalker : function(_deckID){
//    var names = [];
//    _JoinExampleCards.find({planeswalker : true}).forEach(function(e){names.push(e.name);});
//    return _DeckCards.find({_deckID : _deckID, sideboard : false, name : {$in : names}});
//}, planeswalkerQuantity : function(_deckID){
//    var options = { planeswalker : true};
//    return getQuantity2(options, false, _deckID);
//}, enchantment : function(_deckID){
//    var names = [];
//    _JoinExampleCards.find({enchantment : true, creature : false, artifact : false}).forEach(function(e){names.push(e.name);});
//    return _DeckCards.find({_deckID : _deckID, sideboard : false, name : {$in : names}});
//}, enchantmentQuantity : function(_deckID){
//    var options = { enchantment : true, creature : false, artifact : false};
//    return getQuantity2(options, false, _deckID);
//}, instant : function(_deckID){
//    var names = [];
//    _JoinExampleCards.find({instant : true}).forEach(function(e){names.push(e.name);});
//    return _DeckCards.find({_deckID : _deckID, sideboard : false, name : {$in : names}});
//}, instantQuantity : function(_deckID) {
//    var options = {instant : true};
//    return getQuantity2(options, false, _deckID);
//}, sorcery : function(_deckID){
//    var names = [];
//    _JoinExampleCards.find({sorcery : true}).forEach(function(e){names.push(e.name);});
//    return _DeckCards.find({_deckID : _deckID, sideboard : false, name : {$in : names}});
//}, sorceryQuantity : function(_deckID){
//    var options = { sorcery : true};
//    return getQuantity2(options, false, _deckID);
//}, land : function(_deckID){
//    var names = [];
//    _JoinExampleCards.find({land : true, creature : false, artifact : false}).forEach(function(e){names.push(e.name);});
//    return _DeckCards.find({_deckID : _deckID, sideboard : false, name : {$in : names}});
//}, landQuantity : function(_deckID){
//    var options = { land : true, creature : false, artifact : false};
//    return getQuantity2(options, false, _deckID);
//}, sideboard : function(_deckID){
//    var names = [];
//    _JoinExampleCards.find({}).forEach(function(e){names.push(e.name);});
//    return _DeckCards.find({_deckID : _deckID, sideboard : true, name : {$in : names}});
//}, sideboardQuantity: function (_deckID) {
//    var options = {};
//    return getQuantity2(options, true, _deckID);
//},

//findDeckByType : function(){
//    var deckNameIDs = _DeckNames.find({}).fetch();
//    var deckWithoutName = _Deck.find({title: ""}).fetch();
//
//    var results = [];
//
//    for(var i = 0; i< deckNameIDs.length ; i++)
//    {
//        var decksResults = [];
//        var deckNameIDCards = [];
//        _DeckNamesCards.find({
//            deckName_id : deckNameIDs[i]._id
//        }).forEach(function(card){
//            deckNameIDCards.push(card.name);
//        });
//        var deckNameIDCardsWithoutLands = getCardFromArrayWithoutLands(deckNameIDCards);
//
//        for(var j = 0 ; j < deckWithoutName.length ; j++){
//
//            var result =_DeckCards.find({
//                deck_id : deckWithoutName[j]._id._str,
//                sideboard : false,
//                name : {$in : deckNameIDCardsWithoutLands}
//            }).fetch();
//
//            var percentage = formatNum(result.length/deckNameIDCardsWithoutLands.length);
//
//            if(percentage > 70)
//            {
//                decksResults.push({
//                    decknameID : deckWithoutName[j]._id,
//                    percentage : percentage
//                });
//            }
//        }
//        if(decksResults.length != 0)
//        {
//            var mostVoted =_DeckNames.findOne({deckName_id : deckNameIDs[i]._id}, {sort : {vote : 1}});
//
//            results.push(
//                {
//                    deckNameID : deckNameIDs[i]._id,
//                    name : mostVoted.name,
//                    decksResults: decksResults
//                }
//            );
//        }
//    }
//    return results;
//},


//var meteor_root = Npm.require('fs').realpathSync( process.cwd() + '/../' );
//var application_root = Npm.require('fs').realpathSync( meteor_root + '/../' );
//
//// if running on dev mode
//if( Npm.require('path').basename( Npm.require('fs').realpathSync( meteor_root + '/../../../' ) ) == '.meteor' ){
//    application_root =  Npm.require('fs').realpathSync( meteor_root + '/../../../../' );
//}