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

    upADeckPlayListVote : function(playlist){
        DecksNamesPlaylists.update(
            {
                _id : playlist._id,
                dislikes : {_id : Meteor.user()._id}
            },{
                $inc : {likeCount : 1},
                $pull : {dislikes : {_id : Meteor.user()._id}}
            }
        )

        DecksNamesPlaylists.update(
            {
                _id : playlist._id,
                likes : {$ne : Meteor.user()._id}
            },{
                $inc : {likeCount : 1},
                $push : {likes : {_id : Meteor.user()._id}}
            }
        )
    },
    removeUpADeckPlayListVote : function(playlist){
        DecksNamesPlaylists.update(
            {
                _id : playlist._id,
                likes : {_id : Meteor.user()._id}
            },{
                $inc : {likeCount : -1},
                $pull : {likes : {_id : Meteor.user()._id}}
            }
        )
    },
    downADeckPlayListVote : function(playlist){
        DecksNamesPlaylists.update(
            {
                _id : playlist._id,
                likes : {_id : Meteor.user()._id}
            },{
                $inc : {likeCount : -1},
                $pull : {likes : {_id : Meteor.user()._id}}
            }
        )

        DecksNamesPlaylists.update(
            {
                _id : playlist._id,
                dislikes : {$ne : {_id : Meteor.user()._id}}
            },{
                $inc : {likeCount : -1},
                $push : {dislikes : {_id : Meteor.user()._id}}
            }
        )
    },
    removeDownADeckPlayListVote : function(playlist){
        DecksNamesPlaylists.update(
            {
                _id : playlist._id,
                dislikes : {_id : Meteor.user()._id}
            },{
                $inc : {likeCount : 1},
                $pull : {dislikes : {_id : Meteor.user()._id}}
            }
        )
    },


    addDeckName : function(_selectedDeckID, name){
        addNameToDeck(_selectedDeckID, name);
    },
    reportAPlaylist : function(form){

        if(form.reportString == "bad"){
            DecksNamesPlaylists.update(
                {
                    _id : form._id,
                    bad : {$ne : Meteor.user()._id}
                },{
                    $inc : {badCount : 1},
                    $push : {bad : {_id : Meteor.user()._id}}
                }
            )
        }

        if(form.reportString == "wrong"){
            DecksNamesPlaylists.update(
                {
                    _id : form._id,
                    wrong : {$ne : Meteor.user()._id}
                },{
                    $inc : {wrongCount : 1},
                    $push : {wrong : {_id : Meteor.user()._id}}
                }
            )
        }
    },
    showDeckWithoutName : function(link){
        return insertANewVideo();
    },
    findOneDeckWithoutName : function(_deckWithoutNameID){
        return newGetOneDeckRank(_deckWithoutNameID);
    },
    insertNewPlayList : function(form){

        console.log(form);
        var playListInformation = getPlayListInformation(form.playlistUrl);
        var file = Images.insert(playListInformation.thumbnail, function (err, fileObj) {
        });

        DecksNamesPlaylists.insert({
            DecksNames_id : form.DecksNames_id,
            _cfsImagesID : file._id,
            format : form.format,
            date : playListInformation.date,
            title : playListInformation.title,
            channel : playListInformation.channel,
            link : playListInformation.link,
            videosQuantity : playListInformation.videosQuantity,
            likeCount : 0
        });
        console.log("Done insert new playlist");
    },
    removeEvent : function(_id){
        _Event.remove({_id : _id, eventCreator : Meteor.user()._id});
    },
    getEvents : function(){
        metaPerWeek();
    },
    updateDeckType : function(_id, name){
        addNameToDeck(_selectedDeckID, name);
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
        //values.upVotes = DecksNamesPlaylists.find({
        //    format : format,
        //    _deckName : new RegExp(deckSelected.replace("-", " "), 'i'),
        //    likes : Meteor.user()._id
        //})
        //    .fetch()
        //    .length;
        //values.downVotes = DecksNamesPlaylists.find({
        //    format : format,
        //    _deckName : new RegExp(deckSelected.replace("-", " "), 'i'),
        //    dislikes : Meteor.user()._id
        //})
        //    .fetch()
        //    .length;
        var test = DecksNamesPlaylists.find({format : format, _deckName : new RegExp(deckSelected.replace("-", " "), 'i')},
                {fields :{
                    _deckName : 1,
                    _cfsImagesID : 1,
                    format : 1,
                    date : 1,
                    title : 1,
                    channel : 1,
                    link : 1,
                    videoQuantity : 1,
                    likeCount : 1,
                    likes : {$elemMatch : {_id : Meteor.user()._id}},
                    dislikes : {
                        $elemMatch : {
                            _id : Meteor.user()._id}
                    }
                }
                }
            ).fetch();
        return test;
    },
    getPlayListDataMETHODUpvote : function(format, deckSelected){
        return DecksNamesPlaylists.find({format : format, _deckName : new RegExp(deckSelected.replace("-", " "), 'i')}, {fields : {likes : Meteor.user()._id}}).fetch();
    },
    getPlayListDataMETHODDownvote : function(format, deckSelected){
        return DecksNamesPlaylists.find({format : format, _deckName : new RegExp(deckSelected.replace("-", " "), 'i')}, {fields : {likes : Meteor.user()._id}}).fetch();
    },
    addAFutureEvent : function(futureEvent){
        var extraInfo = {deckStored : false, customEvent : true};
        for(var key in extraInfo){
            futureEvent[key] = extraInfo[key];
        }
        _Event.insert(futureEvent);
    },
    addVODToEvent : function(_id, vod){
        _Event.update({_id : _id},
            {
                $set : {vod : vod}
            }
        );
    },
    addYoutubePlaylist : function(_id, playlist){
        _futureEvents.update({_id : _id},
            {
                $set : {playlist : playlist}
            }
        );
    },
    testEvent : function(){
        queryInsideASubset();
        //getMtgoPtqEvents("standard", 5);
        //getMtgoPtq8();
        //getDailyEvents("vintage", 5);
        //extractInfoFromDaily();

        //getMtgoPtqEvents();
        //getMtgoPtq8();
        //getProTourLinks();
        //getProTour();
        //getProTourLinks();


        //PRO TOUR
        //getProTourLinks();
        //getProTourHtml();
        //getProTourDeckLinks();
        //getProTourRankingsTableHtml();
        //getProTourRankings();
        //getPtTop8Bracket();
        //getProTourDecks();
    },
    get5MoreDaysLeague : function(){

    },
    methodEventLeagueDownloadHtml : function(_id){
        eventLeagueDownloadHTML(_id);
    },
    methodEventLeagueExtractDecks : function(_id){
        eventLeagueExtractDecks(_id);
    },
    methodEventLeagueGetInfoNew : function(){
        eventLeagueGetInfoNew("modern");
    },
    methodEventLeagueGetInfoOld : function(){
        eventLeagueGetInfoOld("modern", 5);
    },
    methodEventLeagueGetInfoOld : function(){
        eventLeagueGetInfoOld("modern", 5);
    },
    methodFixAllEvents : function(){
        // fixAllEvents();


        // createDeckCardsMeta2();
        // createMeta2();
        createMetaNewThings();

        // fixNamesOnDecksNames();


    },
    methodAddNameToDeck : function(data){
        var name = deckNameAndArchetype(data.deckName);

        createANewDeckName(name, data.format);
        removeNameFromDeck(data.DecksData_id);
        addNameToDeck(name, data.DecksData_id);
    },
    methodFindDeckComparison : function(_id){
        return findDeckComparison(_id);
    },
    methodCreateArchetype : function(data){
        var name = deckNameAndArchetype(data.deckName);
        addArchetype(name, data.format, data.type);
    },
    methodAddDeckToArchetype : function(data){
        addArchetypeToDeck(data.archetypeName, data.deckNameID);
    },
    methodresetArchetype : function(data){
        DecksNames.update({},
            {$unset : {DecksArchetypes_id : ""}},
            {multi : true})

        DecksArchetypes.update({},
            {$unset : {decksName : ""}},
            {multi : true}
        )
    },
    methodRemoveDeck : function(deckData_id){
        DecksData.remove({_id : deckData_id});
        DecksNames.update(
            {"decksList._id" : deckData_id},
            {$inc : {decks : -1}, $pull : {decksList : {_id : deck._id}}},
            {multi : true}
        );
    },
    methodRemoveADeckNameFromArchetype : function(data){
        
        var deckName = DecksNames.findOne({_id : data._id});

        DecksData.update({ DecksNames_id : deckName._id},
            {$unset : {DecksArchetypes_id : ""}},
            {multi : true}
        )

        DecksNames.update({ _id : deckName._id},
            {$unset : {DecksArchetypes_id : ""}},
            {multi : true}
        )

        DecksArchetypes.update({"DecksNames._id" : deckName._id},
            {
                $pull : {
                    DecksNames : {
                        _id: deckName._id,
                    }
                }
            },
            {multi: true}
        );

        console.log("Updated");
    },
    methodRemoveArchetype : function(archetype) {
        DecksNames.update({DecksArchetypes_id: archetype._id},
            {$unset: {DecksArchetypes_id : ""}},
            {multi: true}
        )

        DecksArchetypes.remove({_id: archetype._id})
    },
    methodGetDeckNamePercentage : function(data) {
        return getDeckNamePercentage(data._id);
    }
});

 fixNamesOnDecksNames = function(){
    DecksNames.find({}).forEach(function(obj){
      var name = deckNameAndArchetype(obj.name);
       console.log(name);
       DecksNames.update({_id : obj._id},
           {$set : {name : name}}
       )
    });

     DecksArchetypes.find({}).forEach(function(obj){
         var name = deckNameAndArchetype(obj.name);
         console.log(name);
         DecksArchetypes.update({_id : obj._id},
             {$set : {name : name}}
         )
     });
 };