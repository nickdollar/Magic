Meteor.methods({
    reportAPlaylist: function (form) {
        if (form.reportString == "bad") {
            DecksNamesPlaylists.update(
                {
                    _id: form._id,
                    bad: {$ne: Meteor.user()._id}
                }, {
                    $inc: {badCount: 1},
                    $push: {bad: {_id: Meteor.user()._id}}
                }
            )
        }

        if (form.reportString == "wrong") {
            DecksNamesPlaylists.update(
                {
                    _id: form._id,
                    wrong: {$ne: Meteor.user()._id}
                }, {
                    $inc: {wrongCount: 1},
                    $push: {wrong: {_id: Meteor.user()._id}}
                }
            )
        }
    },
    insertNewPlayList: function (form) {
        var playListInformation = getPlayListInformation(form.playlistUrl);
        var file = Images.insert(playListInformation.thumbnail, function (err, fileObj) {
        });
        if (DecksNamesPlaylists.find({playlistId: playListInformation.playlistId}, {limit: 1}).count()) {
            console.log("Playlist already exists");
            return false;
        }

        DecksNamesPlaylists.insert({
            DecksNames_id: form.DecksNames_id,
            cfsImages_id: file._id,
            format: form.format,
            date: playListInformation.date,
            title: playListInformation.title,
            channel: playListInformation.channel,
            link: playListInformation.link,
            playlistId: playListInformation.playlistId,
            videosQuantity: playListInformation.videosQuantity,
            likeCount: 0
        });
        return true;
        console.log("Done insert new playlist");
    },
})


APIRequestPlayListItems = function(_playlistID){
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

getPlayListInformation = function(youtubeLink){
    var _playlistIDRegex = new RegExp('^.*(youtu.be\/|list=)([^#\&\?]*).*', 'i');
    var _playlistID = youtubeLink.match(_playlistIDRegex)[2];


    var request = APIRequestPlayListItems(_playlistID);

    var playListQuantity = request.pageInfo.totalResults;
    var snippetPlayListInfo = request.items[0].snippet;

    var information = {};
    information.date = new Date(snippetPlayListInfo.publishedAt);
    information.title = snippetPlayListInfo.title;
    information.channel = snippetPlayListInfo.channelTitle
    information.playlistId = snippetPlayListInfo.playlistId
    information.link = youtubeLink;
    information.thumbnail = snippetPlayListInfo.thumbnails.medium.url;
    information.videosQuantity =  playListQuantity;

    return information;
}

getPlayListInfo = function(id){
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



getVideoInfo = function(id) {
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
