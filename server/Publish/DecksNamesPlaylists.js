Meteor.publish('DecksNamesPlaylists', function(DecksNames_id){
    return DecksNamesPlaylists.find({DecksNames_id : DecksNames_id});
});