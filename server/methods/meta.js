Meteor.methods({
    getMetaAllArchetypesMethod({Formats_id, options, LGS_ids}){
        return getMetaAllArchetypes({Formats_id : Formats_id, options : options, LGS_ids : LGS_ids});
    },
    getLGSMetaAllArchetypesMethod({Formats_id, options, LGS_id}){
        return getLGSMetaAllArchetypes({Formats_id : Formats_id, options : options, LGS_id : LGS_id});
    },
    getMetaCardsMethod({Formats_id, options, LGS_ids}){
        var response = {};
        response.totalDecks = getTotalMetaCardsMainSideboard({Formats_id : Formats_id, options : options, LGS_ids : LGS_ids});
        response.cards = getMetaCardsMainSideboard({Formats_id : Formats_id, options : options, LGS_ids : LGS_ids});
        return response;
    }
})