Meteor.methods({
    methodsCardsData : function(){
        makeCardsData()
    },

    //META
    getEvents : function(){
        metaPerWeek();
    },
    updateMetaCards : function(){
        console.log("BBBBBBBBBBBBB");
        createDeckCardsMeta2();
    },
    createMetaNewest : function(){
        createMetaNewThings();
    },
    
    
    //CREATE NEW
    createNewDecksArchetype : function(form){

        var queryCheck = DecksArchetypes.find({format : form.format, name : {$regex : new RegExp(form.name, 'i')}});

        if(queryCheck.count()){
            return false;
        }
        form.name = deckNameAndArchetype(form.name);
        DecksArchetypes.insert(form);

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
    insertNewPlayList : function(form){
        console.log(form);

        var playListInformation = getPlayListInformation(form.playlistUrl);
        var file = Images.insert(playListInformation.thumbnail, function (err, fileObj) {
        });
        if(DecksNamesPlaylists.find({playlistId : playListInformation.playlistId}, { limit : 1}).count()){
            console.log("Playlist already exists");
            return false;
        }

        DecksNamesPlaylists.insert({
            DecksNames_id : form.DecksNames_id,
            cfsImages_id : file._id,
            format : form.format,
            date : playListInformation.date,
            title : playListInformation.title,
            channel : playListInformation.channel,
            link : playListInformation.link,
            playlistId : playListInformation.playlistId,
            videosQuantity : playListInformation.videosQuantity,
            likeCount : 0
        });
        return true;
        console.log("Done insert new playlist");
    },

    updateDeckType : function(_id, name){
        addNameToDeck(_id, name);
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
    createMeta : function(){
        createMeta2();
    },

    createMetaNewThingsDays : function(){
        createMetaNewThingsDays();
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
        fixAllEvents();
        // createMetaNewThingsDays();
        // createMetaNewThings();
        // moveHtml();
    },
    methodAddNameToDeck : function(data){
        removeNameFromDeck(data._id);
        addNameToDeck(data._id, data.DecksNames_id);
    },

    methodFindDeckComparison : function(_id){
        return findDeckComparison(_id);
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
    },
    MethodFormTest : function(data) {
        console.log(data);
    },
    addEvents : function(form){
        EventsCalendar.insert(form);
        console.log(form);
    },
    createNewDecksNames : function(form){
        var queryCheck = DecksNames.find({format : form.format, name : {$regex : new RegExp(form.name, 'i')}});

        if(queryCheck.count()){
            return false;
        }
        form.name = deckNameAndArchetype(form.name);

        console.log(form);
        DecksNames.insert(form);
    },

});

 fixNamesOnDecksNames = function(){
    DecksNames.find({}).forEach(function(obj){
      var name = deckNameAndArchetype(obj.name);
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