Meteor.publish('DecksNamesPlaylists', function(DecksNames_id){
    return DecksNamesPlaylists.find({DecksNames_id : DecksNames_id});
});

Meteor.publishComposite('DecksNamesPlaylistsByDaysAndImages', function(days){

    return {
        find : function(){
            var date = new Date();
            date.setDate(date.getDate() - days);
            return DecksNamesPlaylists.find({date : {$gte : date}}, { reactive : false});

        },
        children : [
            {
                find: function (playlist) {
                    return Images.find({_id : playlist.cfsImages_id});
                }
            }
        ]
    }
});

Meteor.publish('selectADeckDeckPlaylist', function(){
    return DecksNamesPlaylists.find({});
});

Meteor.publish('deckSelectedDeckPlaylistUpvotes', function(userId){
    if(this.userId == null){
        return DecksNamesPlaylists.find({likes : ""} , { fields  : {likes : "", dislikes : ""}});
    }
    var currentUserId = this.userId;
    return DecksNamesPlaylists.find({$or : [{likes : currentUserId}, {dislikes : currentUserId}]} , { fields  : {likes : currentUserId, dislikes: currentUserId}});
    //return DecksNamesPlaylists.find({likes : {$elemMatch : {"_id" : currentUserId}}} , { fields  : {likes : { $elemMatch: {_id : currentUserId}}}});
});

Meteor.publish('deckSelectedDeckPlaylist', function(){
    return DecksNamesPlaylists.find({});
});

Meteor.publish('deckSelectedDeckPlaylistResults', function(){
    return DecksNamesPlaylists.find({}, {fields : {likeCount : 1}});
});

