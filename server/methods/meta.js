Meteor.methods({
    createMetaNewThingsDaysAllFormats(){
        createMetaNewThingsDaysAllFormats();
    },
    createMetaNewest(format) {
        createMetaNewThings(format);
    },
    getMetaAllArchetypesMethod({format, options, LGS_ids}){
        return getMetaAllArchetypes({format : format, options : options, LGS_ids : LGS_ids});
    },
    getMetaCardsMethod({format, options, LGS_ids}){
        var response = {};
        response.totalDecks = getTotalMetaCardsMainSideboard({format : format, options : options, LGS_ids : LGS_ids});
        response.cards = getMetaCardsMainSideboard({format : format, options : options, LGS_ids : LGS_ids});
        return response;
    }
})