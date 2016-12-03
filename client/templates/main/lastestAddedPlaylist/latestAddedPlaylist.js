Template.latestAddedPlaylist.onCreated(function(){
    this.autorun(()=>{
        this.subscribe('metaNewestLatest');
    });
});

Template.latestAddedPlaylist.helpers({


});

Template.latestAddedPlaylist.onRendered(function(){
    var owl3 = $("#js-latesAddedPlaylist");
    owl3.owlCarousel({
        items : 5,
        itemsCustom: false,
        itemsDesktop: false,
        itemsDesktopSmall: false
    });
    this.autorun(()=>{
        if(this.subscriptionsReady()){
            DecksNamesPlaylists.find({}, {sort : {date : -1}}).forEach(function(DecksNamesPlaylistsObj){
                var content = "";
                content += '<div class="playListItem">' +
                    '<div class="topPlayListRow">' +
                    '<div class="playListImage">' +
                    '<a href="{{link}}">' +
                    '<img src="' + Images.findOne({_id : DecksNamesPlaylistsObj.cfsImages_id}).url() + '" alt class="playListThumbnail"/>' +
                    '</a>' +
                    '</div>'+
                    '</div>' +
                    '<div class="bottomPlayListRow">' +
                    '<div class="caption">' +
                    '<div class="title">' +
                    '<a href="' +DecksNamesPlaylistsObj.link+'">' +
                    DecksNamesPlaylistsObj.title +
                    '</a>' +
                    '</div>' +
                    '<div class="channel">by <a href="http://www.youtube.com/user/' + DecksNamesPlaylistsObj.channel +'">' +DecksNamesPlaylistsObj.channel + '</a>' +
                    '</div>'+
                    '</div>';
                owl3.data('owlCarousel').addItem(content);
            })
        }

    })

});


