Template.deckPlayList.helpers({
    playlist : function(){
        if(Session.get('deckSelectedData').playlists != null){
            return Session.get('deckSelectedData').playlists;
        }

    },
    playlistExist : function(){
        if(Session.get('deckSelectedData').playlists.length > 0){
            return true;
        }
        return false;
    },
    image : function(_imageID){
        return _Images.findOne({_id : _imageID});
    }
});

Template.deckPlayList.events({
    "click .addAYoutubeVideo" : function(evt, tmp){
        var link = $(evt.target).prev().val();
        Meteor.call('insertNewPlayList', link, Router.current().params.deckSelected.replace(/-/," "), Router.current().params.format);
    }
});

Template.deckPlayList.onRendered(function(){

    var owl = $("#owl-example");
    owl.owlCarousel({
        items : 5,
        itemsCustom : false,
        itemsDesktop : false,
        itemsDesktopSmall : false
    })
});