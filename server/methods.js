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
        addNameToDeck(_selectedDeckID, name);
    },
    showDeckWithoutName : function(link){
        return insertANewVideo();
    },
    findOneDeckWithoutName : function(_deckWithoutNameID){
        return newGetOneDeckRank(_deckWithoutNameID);
    },
    insertNewPlayList : function(youtubelink, deckName, format){
        var playListInformation = getPlayListInformation(youtubelink);
        var file = _Images.insert(playListInformation.thumbnail, function (err, fileObj) {
        });
        _DeckPlayList.insert({
            _deckName : deckName,
            _cfsImagesID : file._id,
            format : format,
            date : playListInformation.date,
            title : playListInformation.title,
            channel : playListInformation.channel,
            link : playListInformation.link,
            videosQuantity : playListInformation.videosQuantity
        });
    },
    getEvents : function(){
        metaPerWeek();
        //addAllCardsOnModernPerWeek();
        //makeCardDatabase();
        //updateMeta2();
        //cardsPercentageValues(format, deckName, 7);
        //simplifyData();
        //defineDeckColors();
        //console.log("getEvents");
        //getTheEvents("standard", "daily", 7);
        //downloadEvents("daily");
        //getTheEvents("legacy", "daily", 7);
        //downloadEvents("daily");
        //getTheEvents("vintage", "daily", 7);
        //downloadEvents("daily");
        //getTheEvents("modern", "daily", 7);
        //downloadEvents("daily");
        //console.log("Done getEvents");
    },
    updateDeckType : function(_id, name){
        addNameToDeck(_selectedDeckID, name);
        //_Deck.update({_id : _id},{
        //    $set : {name : name}
        //});
    },
    updateMetaMethod : function(){
        //makeDeck();
        weeklyCardChange();
    },

    cardsPercentage : function(format, deckName){
        cardsPercentageValues(format, deckName, 7);
    },
    cardUpdate : function(){
        lastCardValues();
        //addAllCardsOnModernPerWeek();
    },
    getCardMeta : function(options){

        var values = metaPerWeek(options);
        return values;
    },
    getDeckMeta : function(daily3_1, daily4_0, ptqTop8, ptqTop9_16, ptqTop17_32){
        var values = createTestMeta();
        //return values;
    },
    addAArchetypeAndNameToArchetype : function(deckName, archetype, format){
        addArchetypeAndDeckToArchetype(deckName, archetype, format);
    },
    removeArchetype : function(archetype){
        _deckArchetypes.remove({archetype : archetype});
    },
    getPlayListDataMETHOD : function(format, deckSelected){
        var data = {events : {}, playlist : []};
        data.events = getEvents(format, deckSelected);
        data.playlists = getPlayListData(format, deckSelected);
        return data;
    }
});

