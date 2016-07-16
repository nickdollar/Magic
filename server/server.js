newGetOneDeckRank = function(_deckWithoutNameID){
    check(_deckWithoutNameID, String);
    var deckWithoutName = _Deck.findOne({_id : _deckWithoutNameID});

    var deckNames = _DeckNames.find({format : deckWithoutName.format}).fetch();

    var value = 0;
    var results = [];
    for(var i = 0; i < deckNames.length; i++){
        var _deckWithNames = _Deck.find({format : deckWithoutName.format, name : deckNames[i].name}, {limit : 3}).fetch();

        for(var j = 0; j < _deckWithNames.length; j++)
        {
            var _deckWithNameID = _deckWithNames[j]._id;

            var matches = getMatchesAndNonMatches(_deckWithoutNameID, _deckWithNameID);
            value = parseFloat(prettifyPercentage((matches.positive.length)/(matches.positive.length + matches.negative.length),2));

            if(value < 50){
                break;
            }

            if(value!==0){
                results.push({
                    value : value,
                    name : deckNames[i].name,
                    _deckNameID : _deckWithNameID,
                    matches : matches
                });
            }

            if(value > 85){
                console.log(deckNames[i].name);
                break;
            }
        }
    }

    results.sort(function(a, b){return b.value - a.value});
    results = results.slice(0,3);
    var finalResults = {id : _deckWithoutNameID, results : results};
    return finalResults;
}


getMatchesAndNonMatches = function(_deckWithoutNameID, _deckWithNameID){
    var results = {positive : [], negative: []};
    var deckWithNameCards = _DeckCards.find({_deckID : _deckWithNameID, sideboard : false}).map(function(card){ return card.name});
    //var nonLandCards = _CardDatabase.find({land : false, name : {$in : deckWithNameCards}}).map(function(card){ return card.name});;
//get the cards that matches
    results.positive = _DeckCards.find({_deckID : _deckWithoutNameID, sideboard : false, name : {$in : deckWithNameCards}}).map(function(card){ return card.name});
    results.positive = _CardDatabase.find({land : false, name : {$in : results.positive}}).map(function(card){ return card.name});;

    //get the cards that don't matches
    results.negative = _DeckCards.find({_deckID : _deckWithNameID, sideboard : false,  name : {$nin : results.positive}}).map(function(card){ return card.name});
    results.negative = _CardDatabase.find({land : false, name : {$in : results.negative}}).map(function(card){ return card.name});
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

getPlayListInformation = function(youtubeLink){
    var _playlistIDRegex = new RegExp('^.*(youtu.be\/|list=)([^#\&\?]*).*', 'i');
    var _playlistID = youtubeLink.match(_playlistIDRegex)[2];


    var request = APIRequestPlayListItems(_playlistID);

    var playListQuantity = request.pageInfo.totalResults;
    var snippetPlayListInfo = request.items[0].snippet;

    var information = {};
    information.date = new Date(snippetPlayListInfo.publishedAt);
    information.title = snippetPlayListInfo.title;
    information.channel = snippetPlayListInfo.channelTitle;
    information.link = youtubeLink;
    information.thumbnail = snippetPlayListInfo.thumbnails.medium.url;
    information.videosQuantity =  playListQuantity;

    return information;
}


defineDeckColors = function(){
    console.log("Start defineDeckColors");
    var decksNames = _DeckNames.find({}).fetch();

    var colorsOptions = ["G", "B", "R", "W", "U"]



    for(var i = 0; i < decksNames.length ; i++){
        var biggestValue = 0;

        for(var j = 0; j < colorsOptions.length; j++){
            if(decksNames[i].hasOwnProperty(colorsOptions[j])){
                if(decksNames[i][colorsOptions[j]] > biggestValue){
                    biggestValue = decksNames[i][colorsOptions[j]];
                }
            }
        }

        var colors = "";
        var minValues = 0.5;
        //check the number

        for(var j = 0; j < colorsOptions.length; j++) {
            if (decksNames[i].hasOwnProperty(colorsOptions[j])) {
                if ((decksNames[i][colorsOptions[j]] / biggestValue) > minValues) {
                    colors += colorsOptions[j];
                }
            }
        }

        var randomPrice = getRandomInt(0, 2000);
        var deckType = "";
        if(randomPrice % 3 == 0){
            deckType = "aggro";
        }else if(randomPrice % 3 ==1) {
            deckType = "combo";
        }else if(randomPrice % 3 ==2) {
            deckType = "control";
        }

        _DeckNames.update({_id : decksNames[i]._id},
        {
            $set : {colors : colors, price : randomPrice, type : deckType}
        });
    }
    console.log("End defineDeckColors");
}