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

insertANewVideo = function(youtubeLink){
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
