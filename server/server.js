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
    insertNewVideo : function(youtubelink){
        insertANewVideo(youtubelink);
    },
    getEvents : function(){
        getVideoInfo();
        //makeCardDatabase();
        //setUpColorForDeckName("yjodm3c3bZ7t34piz");
        //makeMeta();
        //getLastEvents();
        //_Event.find({}).forEach(function(event){
        //    if(!event.hasOwnProperty('deckStored')){
        //        console.log("Added Event");
        //        getEventDeckInformation(event);
        //        _Event.update({ _id : event._id},
        //            {
        //            $set : {
        //                deckStored : true
        //            }
        //        });
        //    } else{
        //        console.log("Events Exists");
        //    };
        //});

    },
    downloadEventsAndDecks : function(){

    },
    updateDeckType : function(_id, name){
        _Deck.update({_id : _id},{
            $set : {name : name}
        });
    }
});

//AIzaSyBqtEvO5BAMe3F4tQLwXiRuNvaflfKm3nk
//https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=zOYW7FO9rzA,zOYW7FO9rzA,-vH2eZAM30s&key={Your API KEY}
//    var searchResult = HTTP.get("https://www.googleapis.com/youtube/v3/videos?part=snippet&id=BdXdaAjbWEA&key=AIzaSyBqtEvO5BAMe3F4tQLwXiRuNvaflfKm3nk");

function insertANewVideo(youtubeLink){
    var playlist = new RegExp('^.*(youtu.be\/|list=)([^#\&\?]*).*', 'i');
    var idRegex = new RegExp('(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})', 'i');
    var id = youtubeLink.match(idRegex)[1];

    var snippet = getVideoInfo(id).items[0].snippet;

    var information = {};
    information.channel = snippet.channelTitle;
    information.title = snippet.title;
    information.date = new Date(snippet.publishedAt);
    information.link = youtubeLink;
    information.thumbnail = snippet.thumbnails.medium.url;


    Images.insert(information.thumbnail, function (err, fileObj) {
        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
    });

    console.log(information);




}

function saveFile(url) {
    // Get file name from url.
    var filename = url.substring(url.lastIndexOf("/") + 1).split("?")[0];
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function() {
        var a = document.createElement('a');
        a.href = window.URL.createObjectURL(xhr.response); // xhr.response is a blob
        a.download = filename; // Set the file name.
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        delete a;
    };
    xhr.open('GET', url);
    xhr.send();
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
        var value = formatNum((matches.positive.length)/cardDeckNames.length);
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






