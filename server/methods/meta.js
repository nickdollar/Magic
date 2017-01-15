Meteor.methods({

    MethodCreateMeta : function(format){
        createMeta(format);
    },
    //META
    updateMetaCards: function (format) {
        createDeckCardsMeta(format);
    },
    createMetaNewThingsDaysAllFormats : function(){
        createMetaNewThingsDaysAllFormats();
    },
    createMetaNewest: function (format) {
        createMetaNewThings(format);
    },
    getMeta : function(format, optionsTypes, timeSpan, deckArchetypes){
        return getMeta(format, optionsTypes, timeSpan, deckArchetypes);
    },
    getMetaAllArchetypes : function(format, optionsTypes, timeSpan, positionChange){
        return getMetaAllArchetypes(format, optionsTypes, timeSpan, positionChange);
    },
    getMetaDecksNamesFromArchetype : function(format, optionsTypes, timeSpan, DecksArchetypes_id, positionChange){
        return getMetaDecksNamesFromArchetype(format, optionsTypes, timeSpan, DecksArchetypes_id, positionChange);
    },
    getMetaCards : function(format, optionsTypes, timeSpan, mainSideboard){
        return getMetaCards(format, optionsTypes, timeSpan, mainSideboard);
    }
})

