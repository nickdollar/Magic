Meteor.methods({
    search: function(query, options) {
        options = options || {};

        // guard against client-side DOS: hard limit to 50
        if (options.limit) {
            options.limit = Math.min(50, Math.abs(options.limit));
        } else {
            options.limit = 50;
        }

        // TODO fix regexp to support multiple tokens
        var regex = new RegExp('^' + query, 'i');
        return _CardDatabase.find({name: {$regex:  regex}}).fetch();
    },
    removeDeck : function(_deckID) {
        _DeckNames.remove({_id : _deckID});
        _DeckNamesCards.remove({_deckNameID : _deckID});
    },
    removeCardFromDeck : function(card){
        _DeckNamesCards.remove(card);
    },
    updateDeckNameInformation : function(newDeckInformation, _deckID){
        _DeckNames.update({_id : _deckID},
            {$set :
            {
                format : newDeckInformation.format,
                type : newDeckInformation.type,
                colors : newDeckInformation.colors,
                name : newDeckInformation.name
            }
            });
    },
    addDeckName : function(_selectedDeckID, name){
        console.log(_selectedDeckID, name);
        addNameToDeck(_selectedDeckID, name);
    },
    showDeckWithoutName : function(link){
        return insertANewVideo();
    },
    findOneDeckWithoutName : function(_deckWithoutNameID){
        return newGetOneDeckRank(_deckWithoutNameID);
    },
    insertNewPlayList : function(youtubelink, deckName){
        var playListInformation = getPlayListInformation(youtubelink);
        var file = _Images.insert(playListInformation.thumbnail, function (err, fileObj) {
        });
        _DeckPlayList.insert({
            _deckName : deckName,
            _cfsImagesID : file._id,
            date : playListInformation.date,
            title : playListInformation.title,
            channel : playListInformation.channel,
            link : playListInformation.link,
            videosQuantity : playListInformation.videosQuantity
        });
    },
    getEvents : function(){
        getTheEvents("modern", "daily", 14);
        downloadEvents("daily");
    },
    updateDeckType : function(_id, name){
        addNameToDeck(_selectedDeckID, name);
        //_Deck.update({_id : _id},{
        //    $set : {name : name}
        //});
    },
    updateMetaMethod : function(){
        updateMeta2();
    },
    cardsPercentage : function(deckName){
        cardsPercentageValues("modern", deckName, 7);
    }
});