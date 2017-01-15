getMetaAllDecksNames = function(format, optionsTypes, timeSpan, deckArchetypes){
    console.log("START: getMetaAllDecksNames");
    var startDate = new Date();
    var endDate = new Date();
    var days = optionsTimeSpanQuery[timeSpan];
    startDate.setDate(startDate.getDate() - days);

    var thatOptions = [];

    for(var i = 0; i < optionsTypes.length; ++i){
        thatOptions.push(optionsTypeQuery[optionsTypes[i]]);
    }

    var metaObj = {};
    var DecksNamesMeta = metaDecksNamesMetaPositionONESHOT(format, timeSpan, startDate, endDate, optionsTypes, thatOptions);
    metaObj.totalDecks = DecksNamesMeta.totalDecks;
    metaObj.DecksNamesMeta = DecksNamesMeta.DecksNamesMeta;

    console.log("END: getMetaAllDecksNames");
    return metaObj;
}

getMetaDecksNamesFromArchetype = function(format, optionsTypes, timeSpan, DecksArchetypes_id, positionChange){
    console.log("START: getMetaDecksNamesFromArchetype");
    var startDate = new Date();
    var endDate = new Date();
    var days = optionsTimeSpanQuery[timeSpan];
    startDate.setDate(startDate.getDate() - days);

    var thatOptions = [];

    for(var i = 0; i < optionsTypes.length; ++i){
        thatOptions.push(optionsTypeQuery[optionsTypes[i]]);
    }

    var metaObj = {};
    var DecksNamesMeta = getMetaDecksNamesFromArchetypeONESHOT(format, timeSpan, startDate, endDate, optionsTypes, thatOptions, DecksArchetypes_id, positionChange);
    metaObj.totalDecks = DecksNamesMeta.totalDecks;
    metaObj.DecksNamesMeta = DecksNamesMeta.DecksNamesMeta;
    console.log("END: getMetaDecksNamesFromArchetype");
    return metaObj;
}

getMetaAllArchetypes = function(format, optionsTypes, timeSpan, positionChange){
    console.log("START: getMetaAllArchetypes");
    var startDate = new Date();
    var endDate = new Date();
    var days = optionsTimeSpanQuery[timeSpan];
    startDate.setDate(startDate.getDate() - days);

    var thatOptions = [];

    for(var i = 0; i < optionsTypes.length; ++i){
        thatOptions.push(optionsTypeQuery[optionsTypes[i]]);
    }

    var metaObj = {};
    var DecksArchetypesMeta = metaDecksArchetypesMetaONESHOT(format, timeSpan, startDate, endDate, optionsTypes, thatOptions, positionChange);
    metaObj.totalDecks = DecksArchetypesMeta.total;
    metaObj.DecksArchetypesMeta = DecksArchetypesMeta.DecksArchetypesMeta;

    console.log(metaObj.totalDecks);
    console.log("END: getMetaAllArchetypes");
    return metaObj;
}