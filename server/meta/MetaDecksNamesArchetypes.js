createMeta = function(format){
    console.log("START: createMeta");
    Meta.remove({format : format});
    var optionsTypes = ["league5_0", "daily3_1", "daily4_0", "MTGOPTQ", "MTGOPTQ9-16", "MTGOPTQ17+", "GP1-8", "GP9-16", "GP17+", "SCGSuperIQ", "SCGOpen1-8", "SCGOpen9-16", "SCGOpen17+", "InviQualifier", "SCGInvitational", "SCGClassic1-8", "SCGClassic9+", "LegacyChamps", "WorldMagicCup"];
    var optionsTimeSpan = ["month", "twoMonths"];



    var permComb = permutationAndCombination(optionsTypes);
    console.log(permComb.length * optionsTimeSpan.length);
    var count = 0;
    permComb.forEach(function(optionsTypesObj){


        var startDate = new Date();
        var endDate = new Date();
        optionsTimeSpan.forEach(function(timeSpanObj){
            count++;
            console.log(count);

            var days = optionsTimeSpanQuery[timeSpanObj];

            startDate.setDate(startDate.getDate() - days);
            var thatOptions = [];
            for(var i = 0; i < optionsTypes.length; ++i){
                thatOptions.push(optionsTypeQuery[optionsTypes[i]]);
            }

            var metaObj = {};
            metaObj = metaDecksNamesMetaPositionONESHOT(format, timeSpanObj, startDate, endDate, optionsTypesObj, thatOptions);
            metaObj.DecksArchetypesMeta = metaDecksArchetypesMetaONESHOT(format, timeSpanObj, startDate, endDate, optionsTypesObj, thatOptions);
            metaObj.options = optionsTypesObj;
            metaObj.timeSpan = timeSpanObj;
            metaObj.format = format;

            Meta.insert(metaObj);
        });
    })
    console.log("END: createM eta");
}

metaDecksNamesMetaPositionONESHOT = function(format, timeSpan, startDate, endDate, options, thatOptions){
    // console.log("creating DecksNames Meta ONESHOT  ");

    var DecksNamesMeta = DecksNames.aggregate([
        {$project : {"format" : 1}},
        {$match : {format : format}},
        {$lookup : {"from" : "DecksData", "localField" : "_id", "foreignField" : "DecksNames_id", "as" : "DecksData"}},
        {$unwind : "$DecksData"},
        {$project : {date : "$DecksData.date", victory : "$DecksData.victory", loss : "$DecksData.loss", type : "$DecksData.type"}},
        {$match : {date : {$gte : startDate, $lte : endDate}, $or : thatOptions}},
        {$group : {_id : "$_id",quantity : {$sum : 1}}},
        {$sort : {quantity : -1}}
    ]);

    var total = DecksNamesMeta.reduce((previousValue, current)=>{
        return current.quantity + previousValue;
    }, 0);

    //give Positions
    var currentQuantity = 9999;
    var position = 0;
    DecksNamesMeta.forEach(function(DecksNamesMetaObj){
        if(DecksNamesMetaObj.quantity < currentQuantity){
            position++;
            currentQuantity = DecksNamesMetaObj.quantity;
            DecksNamesMetaObj.position = position;
        }else{
            DecksNamesMetaObj.position = position;
        }
    });

    var optionsDays = [ {name : "week", days : 7}, {name : "twoWeeks", days : 14},
        // {name : "month", days : 30}
    ];


    optionsDays.forEach(function(optionsDaysObj){

        //old date query
        var endDateBeforeDate = new Date(endDate.getTime());
        endDateBeforeDate.setDate(endDateBeforeDate.getDate() - optionsDaysObj.days);

        var DecksNamesMetaBeforeDate = DecksNames.aggregate([
            {$project : {"format" : 1}},
            {$match : {format : format}},
            {$lookup : {"from" : "DecksData", "localField" : "_id", "foreignField" : "DecksNames_id", "as" : "DecksData" }},
            {$unwind : "$DecksData"},
            {$project : {date : "$DecksData.date", victory : "$DecksData.victory", loss : "$DecksData.loss", type : "$DecksData.type"}},
            {$match : {date : {$gte : startDate, $lte : endDateBeforeDate},$or : thatOptions}},
            {$group : {_id : "$_id", quantity : {$sum : 1}}},
            {$sort : {quantity : -1}}
        ]);

        //give Positions
        var currentQuantity = 9999;
        var position = 0;

        DecksNamesMetaBeforeDate.forEach(function(DecksNamesMetaBeforeDateObj){
            if(DecksNamesMetaBeforeDateObj.quantity < currentQuantity){
                position++;
                currentQuantity = DecksNamesMetaBeforeDateObj.quantity;
                DecksNamesMetaBeforeDateObj.position = position;
            }else{
                DecksNamesMetaBeforeDateObj.position = position;
            }
        });

        DecksNamesMeta.forEach(function(DecksNamesMetaObj){
            var DecksNamesMetaBeforeDateQuery = DecksNamesMetaBeforeDate.find(function(DecksNamesMetaBeforeDateObj){
                return DecksNamesMetaBeforeDateObj._id == DecksNamesMetaObj._id;
            });

            if(DecksNamesMetaBeforeDateQuery){
                var change = DecksNamesMetaBeforeDateQuery.position - DecksNamesMetaObj.position;
            }else{
                var change = 999;
            }
            if(!DecksNamesMetaObj["positions"]){
                DecksNamesMetaObj["positions"] = {};
            }
            DecksNamesMetaObj["positions"][optionsDaysObj.name] = change;
        });
    });

    return {totalDecks : total, DecksNamesMeta : DecksNamesMeta};
};


getMetaDecksNamesFromArchetypeONESHOT = function(format, timeSpan, startDate, endDate, options, thatOptions, DecksArchetypes_id, positionChange){
    // console.log("creating DecksNames Meta ONESHOT  ");

    var DecksNamesMeta = DecksNames.aggregate([
        {$match : {DecksArchetypes_id : DecksArchetypes_id}},
        {$lookup : {"from" : "DecksData", "localField" : "_id", "foreignField" : "DecksNames_id", "as" : "DecksData"}},
        {$unwind : "$DecksData"},
        {$project : {date : "$DecksData.date", victory : "$DecksData.victory", loss : "$DecksData.loss", type : "$DecksData.type"}},
        {$match : {date : {$gte : startDate, $lte : endDate}, $or : thatOptions}},
        {$group : {_id : "$_id",quantity : {$sum : 1}}},
        {$sort : {quantity : -1}}
    ]);

    var total = DecksNamesMeta.reduce((previousValue, current)=>{
        return current.quantity + previousValue;
    }, 0);

    //give Positions
    var currentQuantity = 9999;
    var position = 0;
    DecksNamesMeta.forEach(function(DecksNamesMetaObj){
        if(DecksNamesMetaObj.quantity < currentQuantity){
            position++;
            currentQuantity = DecksNamesMetaObj.quantity;
            DecksNamesMetaObj.position = position;
        }else{
            DecksNamesMetaObj.position = position;
        }
    });

    var optionsDays = {week : 7, twoWeeks : 14};

    //old date query
    var endDateBeforeDate = new Date(endDate.getTime());
    endDateBeforeDate.setDate(endDateBeforeDate.getDate() - optionsDays[positionChange]);

    var DecksNamesMetaBeforeDate = DecksNames.aggregate([
        {$lookup : {"from" : "DecksData", "localField" : "_id", "foreignField" : "DecksNames_id", "as" : "DecksData"}},
        {$lookup : {"from" : "DecksData", "localField" : "_id", "foreignField" : "DecksNames_id", "as" : "DecksData" }},
        {$unwind : "$DecksData"},
        {$project : {date : "$DecksData.date", victory : "$DecksData.victory", loss : "$DecksData.loss", type : "$DecksData.type"}},
        {$match : {date : {$gte : startDate, $lte : endDateBeforeDate},$or : thatOptions}},
        {$group : {_id : "$_id", quantity : {$sum : 1}}},
        {$sort : {quantity : -1}}
    ]);

    //give Positions
    var currentQuantity = 9999;
    var position = 0;

    DecksNamesMetaBeforeDate.forEach(function(DecksNamesMetaBeforeDateObj){
        if(DecksNamesMetaBeforeDateObj.quantity < currentQuantity){
            position++;
            currentQuantity = DecksNamesMetaBeforeDateObj.quantity;
            DecksNamesMetaBeforeDateObj.position = position;
        }else{
            DecksNamesMetaBeforeDateObj.position = position;
        }
    });

    DecksNamesMeta.forEach(function(DecksNamesMetaObj){
        var DecksNamesMetaBeforeDateQuery = DecksNamesMetaBeforeDate.find(function(DecksNamesMetaBeforeDateObj){
            return DecksNamesMetaBeforeDateObj._id == DecksNamesMetaObj._id;
        });

        if(DecksNamesMetaBeforeDateQuery){
            var change = DecksNamesMetaBeforeDateQuery.position - DecksNamesMetaObj.position;
        }else{
            var change = 999;
        }
        if(!DecksNamesMetaObj.positionChange){
            DecksNamesMetaObj.positionChange = {};
        }
        DecksNamesMetaObj.positionChange = change;
    });

    return {totalDecks : total, DecksNamesMeta : DecksNamesMeta};
};

metaDecksArchetypesMetaONESHOT = function(format, timeSpan, startDate, endDate, options, thatOptions, positionChange){
    console.log("START: metaDecksArchetypesMetaONESHOT");

    var DecksArchetypesMeta = DecksArchetypes.aggregate([
        {$project : {"format" : 1}},
        {$match : {format : format}},
        {$lookup : {"from" : "DecksNames", "localField" : "_id", "foreignField" : "DecksArchetypes_id", "as" : "DecksNames"}},
        {$unwind : "$DecksNames"},
        {$project : {DecksNames_id : "$DecksNames._id"}},
        {$lookup : {"from" : "DecksData", "localField" : "DecksNames_id", "foreignField" : "DecksNames_id", "as" : "DecksData"}},
        {$unwind : "$DecksData"},
        {$project : {DecksNames_id : "$DecksNames_id", date : "$DecksData.date", victory : "$DecksData.victory", loss : "$DecksData.loss", type : "$DecksData.type"}},
        {$match : {date : {$gte : startDate, $lte : endDate}, $or : thatOptions}},
        {$group : {	_id : "$_id", quantity : {$sum : 1}}},
        {$sort : {quantity : -1}}
    ]);

    var total = DecksArchetypesMeta.reduce((previousValue, current)=>{
        return current.quantity + previousValue;
    }, 0);

    //give Positions
    var currentQuantity = 9999;
    var position = 0;
    DecksArchetypesMeta.forEach(function(DecksArchetypesMetaObj){
        if(DecksArchetypesMetaObj.quantity < currentQuantity){
            position++;
            currentQuantity = DecksArchetypesMetaObj.quantity;
            DecksArchetypesMetaObj.position = position;
        }else{
            DecksArchetypesMetaObj.position = position;
        }
    });


    var optionsDays = {week : 7, twoWeeks : 14};

    var endDateBeforeDate = new Date(endDate.getTime());
    endDateBeforeDate.setDate(endDateBeforeDate.getDate() - optionsDays[positionChange].days);

    var DecksArchetypesMetaBeforeDate = DecksArchetypes.aggregate([
        {$project : {"format" : 1}},
        {$match : {format : format}},
        {$lookup : {"from" : "DecksNames", "localField" : "_id", "foreignField" : "DecksArchetypes_id", "as" : "DecksNames"}},
        {$unwind : "$DecksNames"},
        {$project : {DecksNames_id : "$DecksNames._id"}},
        {$lookup : {"from" : "DecksData", "localField" : "DecksNames_id", "foreignField" : "DecksNames_id", "as" : "DecksData"}},
        {$unwind : "$DecksData"},
        {$project : {DecksNames_id : "$DecksNames_id", date : "$DecksData.date", victory : "$DecksData.victory", loss : "$DecksData.loss", type : "$DecksData.type"}},
        {$match : {date : {$gte : startDate, $lte : endDateBeforeDate}, $or : thatOptions}},
        {$group : {	_id : "$_id", quantity : {$sum : 1}}},
        {$sort : {quantity : -1}}
    ]);

    //give Positions
    var currentQuantity = 9999;
    var position = 0;

    DecksArchetypesMetaBeforeDate.forEach(function(DecksArchetypesMetaBeforeDateObj){
        if(DecksArchetypesMetaBeforeDateObj.quantity < currentQuantity){
            position++;
            currentQuantity = DecksArchetypesMetaBeforeDateObj.quantity;
            DecksArchetypesMetaBeforeDateObj.position = position;
        }else{
            DecksArchetypesMetaBeforeDateObj.position = position;
        }
    });

    DecksArchetypesMeta.forEach(function(DecksNamesMetaObj){
        var DecksNamesMetaBeforeDateQuery = DecksArchetypesMetaBeforeDate.find(function(DecksNamesMetaBeforeDateObj){
            return DecksNamesMetaBeforeDateObj._id == DecksNamesMetaObj._id;
        });

        if(DecksNamesMetaBeforeDateQuery){
            var change = DecksNamesMetaBeforeDateQuery.position - DecksNamesMetaObj.position;
        }else{
            var change = 999;
        }
        DecksNamesMetaObj.positionChange = change;
    });

    return {DecksArchetypesMeta : DecksArchetypesMeta, total : total};
};

function combinations(str) {
    var fn = function(active, rest, a) {
        if (!active && !rest)
            return;
        if (!rest) {
            a.push(active);
        } else {
            fn(active + rest[0], rest.slice(1), a);
            fn(active, rest.slice(1), a);
        }
        return a;
    }
    return fn("", str, []);
}


permutationAndCombination = function(a) {
    var fn = function(n, src, got, all) {
        if (n == 0) {
            if (got.length > 0) {
                all[all.length] = got;
            }
            return;
        }
        for (var j = 0; j < src.length; j++) {
            fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
        }
        return;
    }
    var all = [];
    for (var i=0; i < a.length; i++) {
        fn(i, a, [], all);
    }
    all.push(a);
    return all;
};

optionsTimeSpanQuery = {
    "month" : 30,
    "twoMonths" : 60,
    "sixMonths" : 180
}

optionsTypeQuery = {
    "league5_0": {victory: 5, loss: 0, type: "league"},
    "daily4_0": {victory: 4, loss: 0, type: "daily"},
    "daily3_1": {victory: 3, loss: 1, type: "daily"},
    "MTGOPTQ1-8": {position: {$gte: 1, $lte: 8}, type: "MTGOPTQ"},
    "MTGOPTQ9-16": {position: {$gte: 9, $lte: 16}, type: "MTGOPTQ"},
    "MTGOPTQ17+": {position: {$gte: 17}, type: "MTGOPTQ"},
    "GP1-8": {position: {$gte: 1, $lte: 8}, type: "GP"},
    "GP9-16": {position: {$gte: 9, $lte: 16}, type: "GP"},
    "GP17+": {position: {$gte: 17}, type: "GP"},
    "SCGSuperIQ" : {type : "SCGSuperIQ"},
    "SCGOpen1-8": {position: {$gte: 1, $lte: 8}, type: "ptq"},
    "SCGOpen9-16": {position: {$gte: 9, $lte: 16}, type: "ptq"},
    "SCGOpen17+": {position: {$gte: 17}, type: "ptq"},
    "InviQualifier": {type: "inviQualifier"},
    "SCGInvitational": {type: "SCGInvitational"},
    "SCGClassic1-8": {position: {$gte: 1, $lte: 8}, type: "SCGClassic"},
    "SCGClassic9+": {position: {$gte: 9}, type: "SCGClassic"},
    "LegacyChamps": {type: "LegacyChamps"},
    "WorldMagicCup": {type: "WorldMagicCup"},
}
