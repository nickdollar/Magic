Template.newPlayLists.helpers({
    playlists : function(){
        return DecksNamesPlaylists.find({}, {limit : 3});
    },
    image : function(_imageID){
        return Images.findOne({_id : _imageID});
    }
});