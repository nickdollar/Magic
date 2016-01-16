Template.newPlayLists.helpers({
    playlists : function(){
        return _DeckPlayList.find({}, {limit : 3});
    },
    image : function(_imageID){
        return _Images.findOne({_id : _imageID});
    }
});