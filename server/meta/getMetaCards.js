getMetaCards = function(format, options){
    var result = {};
    result.totalDecks = metaTotalDecksCards(format, options);
    result.cards = [];
    if(options.mainSide==0){
        return result
    }


    if(options.mainSide.length == 2){
        result.cards = metaCardsMainSideboard(format, options);
    }else if(options.mainSide[0] == "main") {
        result.cards = metaCardsSideboard(format, options);
    }else {
        result.cards = metaCardsMain(format, options);
    }


    return result;
}
