Meteor.methods({
    MethodCreateMeta(format){
        createMeta(format);
    },
    createMetaNewThingsDaysAllFormats(){
        createMetaNewThingsDaysAllFormats();
    },
    createMetaNewest(format) {
        createMetaNewThings(format);
    },
    getMeta(format, optionsTypes, timeSpan, deckArchetypes){
        return getMeta(format, optionsTypes, timeSpan, deckArchetypes);
    },
    MethodGetMetaAllArchetypes(format, optionsTypes, location, distance, positionOption, state, ZIP){
        return getMetaAllArchetypes(format, optionsTypes, location, distance, positionOption, state, ZIP);
    },
    getMetaDecksNamesFromArchetype(format, optionsTypes, timeSpan, DecksArchetypes_id, positionChange){
        return getMetaDecksNamesFromArchetype(format, optionsTypes, timeSpan, DecksArchetypes_id, positionChange);
    },
    getMetaCards(format, options){
        return getMetaCards(format, options);
    }
})