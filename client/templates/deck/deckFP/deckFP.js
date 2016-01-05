Template.deckFP.helpers({
    metas : function(){
        var metas = ['standard', 'modern', 'legacy', 'vintage'];
        return metas;
    }
});




Template.newPlayLists.helpers({
    playlists : function(){
        return _DeckPlayList.find({});
    }
});