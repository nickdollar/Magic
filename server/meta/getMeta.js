getMetaAllDecksNames = function(format, optionsTypes, timeSpan, deckArchetypes){
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
    console.log("   END: getMetaDecksNamesFromArchetype");
    return metaObj;
}

getMetaAllArchetypes = function(format, options, location, distance, positionOption, state, ZIP){
    var list = [];
    if(positionOption == "state" && state !="" && state){
        list.push(LGS.find({state : "confirmed", "location.state" : state}).fetch());
    }else if(positionOption == "ZIP" && ZIP != '' && ZIP){
        distance = parseInt(distance);
        ZIP = parseInt(ZIP);
        var zipInfo = ZipCodes.findOne({ZIP : ZIP});
        list.push(LGS.find({state : "confirmed", "location.coords" : {$geoWithin : {$centerSphere: [[zipInfo.LNG, zipInfo.LAT], distance / 3963.2]}}}).fetch());
    }else if(positionOption == "GPS" && distance && location){
        distance = parseInt(distance);
        list.push(LGS.find({state : "confirmed", "location.coords" : {$geoWithin : {$centerSphere: [location, distance / 3963.2]}}}).fetch());
    }

    return metaDecksArchetypesMetaONESHOT(format, options, list);
}