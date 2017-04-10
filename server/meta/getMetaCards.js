 getMetaCards = function({Formats_id, options, LGS_ids}){
    var result = {};
    result.totalDecks = getTotalMetaCardsMainSideboard({Formats_id, Formats_id, options : options, LGS_ids : LGS_ids});
    result.cards = getMetaCardsMainSideboard({Formats_id, Formats_id, options : options, LGS_ids : LGS_ids});
    return result;
}
