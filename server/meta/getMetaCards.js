getMetaCards = function(format, optionsTypes, timeSpan, mainSideboard){
    console.log("start createDeckCardsMeta");
    var days = optionsTimeSpanQuery[timeSpan];
    var startDate = new Date();
    var endDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    var thatOptions = [];
    for(var i = 0; i < optionsTypes.length; ++i){
        thatOptions.push(optionsTypeQuery[optionsTypes[i]]);
    }

    var result = {};
    result.totalDecks = metaTotalDecksCards(format, timeSpan, startDate, endDate, optionsTypes, thatOptions);
    
    if(mainSideboard == "main"){
        result.cards = metaCardsMain(format, timeSpan, startDate, endDate, optionsTypes, thatOptions);
    }else if(mainSideboard == "sideboard") {
        result.cards = metaCardsSideboard(format, timeSpan, startDate, endDate, optionsTypes, thatOptions);
    }else {
        result.cards = metaCardsMainSideboard(format, timeSpan, startDate, endDate, optionsTypes, thatOptions);
    }
    
    
    
    return result;
    console.log("end create meta 2");
}
