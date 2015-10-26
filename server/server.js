Meteor.methods({
    search: function(query, options) {
        options = options || {};

        // guard against client-side DOS: hard limit to 50
        if (options.limit) {
            options.limit = Math.min(50, Math.abs(options.limit));
        } else {
            options.limit = 50;
        }

        // TODO fix regexp to support multiple tokens
        var regex = new RegExp('^' + query, 'i');
        return _CardDatabase.find({name: {$regex:  regex}}).fetch();
    },
    removeDeck : function(_deckID) {
        _DeckNames.remove({_id : _deckID});
        _DeckNamesCards.remove({_deckNameID : _deckID});
    },
    removeCardFromDeck : function(card){
        _DeckNamesCards.remove(card);
    },
    updateDeckNameInformation : function(newDeckInformation, _deckID){
      _DeckNames.update({_id : _deckID},
          {$set :
              {
                  format : newDeckInformation.format,
                  type : newDeckInformation.type,
                  colors : newDeckInformation.colors,
                  name : newDeckInformation.name
              }
          });
    },
    addDeckName : function(_selectedDeckID, name){
        addDeckName(_selectedDeckID, name);
    },
    showDeckWithoutName : function(link){
        return insertANewVideo();

    },
    findOneDeckWithoutName : function(_deckWithoutNameID, format){
        return getOneDeckRank(_deckWithoutNameID, format);
    },
    insertNewPlayList : function(youtubelink, deckName){
        var playListInformation = getPlayListInformation(youtubelink);
        var file = _Images.insert(playListInformation.thumbnail, function (err, fileObj) {
        });
        _DeckPlayList.insert({
            _deckName : deckName,
            _cfsImagesID : file._id,
            date : playListInformation.date,
            title : playListInformation.title,
            channel : playListInformation.channel,
            link : playListInformation.link,
            videosQuantity : playListInformation.videosQuantity
        });
    },
    getEvents : function(){
        downloadEvents();
    },
    updateDeckType : function(_id, name){
        _Deck.update({_id : _id},{
            $set : {name : name}
        });
    },
    cardsPercentage : function(deckName){
        var date = getLastAndFirstDayOfWeekBefore();

        var cards = cardsPercentage("RWg Burn");


        //for(var i = 0 ; i < cards.length; i++){
        //    var options = {deckName : "RWg Burn", name : cards[i].name};
        //    if(_cardBreakDownCards.find(options, {limit : 1}).count() == 0){
        //        _cardBreakDownCards.insert({deckName : "RWg Burn", name : cards[i].name});
        //    }
        //}
    }
});

addCartsToDeckName = function(deckName){

}

cardsPercentage = function(deckName){
    var lastWeekDate = getLastAndFirstDayOfWeekBefore();

    var decks = _Deck.find({name : deckName}).fetch();
    var cardValues = {};

    console.log("length: " + decks.length);
    for(var i = 0; i < decks.length; i++){
        _DeckCards.find({_deckID : decks[i]._id, sideboard: false}).forEach(function(card){
            if(!cardValues.hasOwnProperty(card.name)){
                cardValues[card.name] = {total : 0};
            }
            cardValues[card.name].total += parseInt(card.quantity);
        });

    }
    var date = getLastAndFirstDayOfWeekBefore();
    for(var key in cardValues){
        cardValues[key].total = prettifyDecimails((cardValues[key].total/decks.length),2);

        _cardBreakDownCards.update({deckName : deckName, cardName : key},
            {
                $set : { weekTotal : cardValues[key].total},
                $setOnInsert : {deckName : deckName, cardName : key}
            },
            {upsert: true}
        );

        _cardBreakDownDate.update({
                    name : key,
                    deckName : deckName,
                    date : date.weekStart
                    },
                    {
                        $set : {quantity : cardValues[key].total},
                        $setOnInsert : {name : key,
                                        deckName : deckName,
                                        date : date.weekStart,
                                        quantity : cardValues[key].total
                        }
                    },
                    {upsert: true}
                    );
    }
}

function APIRequestPlayListItems(_playlistID){
    var key = "AIzaSyBqtEvO5BAMe3F4tQLwXiRuNvaflfKm3nk";
    var url = "https://www.googleapis.com/youtube/v3/playlistItems";
    var options = {
        'params': {
            key : key,
            playlistId : _playlistID,
            part: 'snippet'
        }
    };

    Future = Npm.require('fibers/future');

    var myFuture = new Future();

    HTTP.get(url, options, function(error, response){
        if ( error ) {
            myFuture.throw(error);
        } else {
            myFuture.return(response.data);
        }
    });

    return myFuture.wait();
}

function getPlayListInfo(id){
    var key = "AIzaSyBqtEvO5BAMe3F4tQLwXiRuNvaflfKm3nk";
    var url = "https://www.googleapis.com/youtube/v3/playlists";
    var options = {
        'params': {
            key : key,
            id : id,
            part: 'snippet'
        }
    };

    Future = Npm.require('fibers/future');

    var myFuture = new Future();

    HTTP.get(url, options, function(error, response){
        if ( error ) {
            myFuture.throw(error);
        } else {
            myFuture.return(response.data);
        }
    });

    return myFuture.wait();
}


function insertANewVideo(youtubeLink){
    var idRegex = new RegExp('(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})', 'i');
    var id = youtubeLink.match(idRegex)[1];

    var snippet = getVideoInfo(id).items[0].snippet;

    var information = {};
    information.channel = snippet.channelTitle;
    information.title = snippet.title;
    information.date = new Date(snippet.publishedAt);
    information.link = youtubeLink;
    information.thumbnail = snippet.thumbnails.medium.url;

    _Images.insert(information.thumbnail, function (err, fileObj) {
        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
    });
}



function getVideoInfo(id) {
    var key = "AIzaSyBqtEvO5BAMe3F4tQLwXiRuNvaflfKm3nk";
    var url = "https://www.googleapis.com/youtube/v3/videos";
    var options = {
        'params': {
            key : key,
            id : id,
            part: 'snippet'
        }
    };

    Future = Npm.require('fibers/future');

    var myFuture = new Future();

     HTTP.get(url, options, function(error, response){
        if ( error ) {
            myFuture.throw(error);
        } else {
            myFuture.return( JSON.parse( response.content));
        }
    });

    return myFuture.wait();
}



function getOneDeckRank(_deckWithoutNameID){
    var _deckNames = _DeckNames.find({}).fetch();
    var results = [];
    for(var j = 0; j < _deckNames.length; j++)
    {
        var _deckNameID = _deckNames[j]._id;

        var cardDeckNames = [];
        _DeckNamesCards.find({_deckNameID : _deckNameID}).forEach(function(card){
            cardDeckNames.push(card.name);
        });

        var matches = getMatchesAndNonMatches(_deckWithoutNameID, cardDeckNames, _deckNameID);
        var value = prettifyDecimails((matches.positive.length)/cardDeckNames.length,2);
        var name = _DeckNames.findOne({_id : _deckNameID}).name;

        if(value!==0){
            results.push({
                value : value,
                name : name,
                deckNameID : _deckNameID._id,
                matches : matches
            });
        }
    }
    results.sort(function(a, b){return b.value - a.value});
    results = results.slice(0,3);
    var finalResults = {id : _deckWithoutNameID, results : results};
    return finalResults;
}
function getMatchesAndNonMatches(_deckWithoutNameID, cardDeckNames, _deckNameID){

    var results = {positive : [], negative: []};
    //get the cards that matches
    _DeckCards.find({_deckID : _deckWithoutNameID, sideboard : false, name : {$in : cardDeckNames}}).forEach(function(card){
        results.positive.push(card.name);
    });

    //get the cards that don't matches
    _DeckNamesCards.find({_deckNameID : _deckNameID, name : {$not : {$in : results.positive}}}).forEach(function(card){
        results.negative.push(card.name);
    });
    //console.log(results.positive);
    return results;
}

function getFile(address){
    Future = Npm.require('fibers/future');
    var myFuture = new Future();
    HTTP.get(url, options, function(error, response){
        if ( error ) {
            myFuture.throw(error);
        } else {
            myFuture.return(response);
        }
    });
    return myFuture.wait();
}



function getPlayListInformation(youtubeLink){
    var _playlistIDRegex = new RegExp('^.*(youtu.be\/|list=)([^#\&\?]*).*', 'i');
    var _playlistID = youtubeLink.match(_playlistIDRegex)[2];

    var playListQuantity = APIRequestPlayListItems(_playlistID).pageInfo.totalResults;
    var snippetPlayListInfo = APIRequestPlayListItems(_playlistID).items[0].snippet;

    var information = {};
    information.date = new Date(snippetPlayListInfo.publishedAt);
    information.title = snippetPlayListInfo.title;
    information.channel = snippetPlayListInfo.channelTitle;
    information.link = youtubeLink;
    information.thumbnail = snippetPlayListInfo.thumbnails.medium.url;
    information.videosQuantity =  playListQuantity;

    return information;
}




addCron = function(){
    SyncedCron.add({
        name: 'get new decks',
        schedule: function(parser) {
            // parser is a later.parse object
            return parser.text('every 6 hours');
        },
        job: function() {

        }
    });
}

Meteor.startup(function() {
    addCron();
    SyncedCron.start();

});