getMetaCards = function(format, options){
    console.log("Start: getMetaCards");
    var result = {};
    result.totalDecks = metaTotalDecksCards(format, options);
    result.cards = [];
    if(options.mainSide.length==0){
        return result
    }
    if(options.mainSide.length == 2){
        result.cards = metaCardsMainSideboard(format, options);
    }else if(options.mainSide[0] == "main") {
        result.cards = metaCardsMain(format, options);
    }else if(options.mainSide[0] == "side") {
        result.cards = metaCardsSideboard(format, options);
    }
    console.log("   End: getMetaCards");
    return result;
}
