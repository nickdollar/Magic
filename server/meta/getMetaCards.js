 getMetaCards = function({format, options, LGS_ids}){
    var result = {};
    result.totalDecks = getTotalMetaCardsMainSideboard({format, format, options : options, LGS_ids : LGS_ids});
    result.cards = getMetaCardsMainSideboard({format, format, options : options, LGS_ids : LGS_ids});
    return result;
}
