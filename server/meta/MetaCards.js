createDeckCardsMeta = function(format, startDate, endDate){
    console.log("start createDeckCardsMeta");
    var optionsTypes = ["league5_0", "daily3_1", "daily4_0", "ptqTop8", "ptqTop9_16", "ptqTop17_32"];
    var optionsTypes = ["league5_0", "daily3_1", "daily4_0"];
    var optionsTimeSpan = ["month", "twoMonths"
        // , "sixMonths"
    ];

    MetaCards.remove({format : format});
    var permComb = permutationAndCombination(optionsTypes);
    permComb.forEach(function(optionsTypesObj, optionsTypesIndex){
        console.log(optionsTypesObj.length, optionsTypesIndex)
        optionsTimeSpan.forEach(function(timeSpanObj){
            var days = optionsTimeSpanQuery[timeSpanObj];
            var startDate = new Date();
            var endDate = new Date();

            startDate.setDate(startDate.getDate() - days);

            var thatOptions = [];
            for(var i = 0; i < optionsTypes.length; ++i){
                thatOptions.push(optionsTypeQuery[optionsTypes[i]]);
            }

            var result = {};
            result.options = optionsTypesObj;
            result.timeSpan = timeSpanObj;
            result.format = format;
            result.totalDecks = metaTotalDecksCards(format, timeSpanObj, startDate, endDate, optionsTypes, thatOptions);
            result.main = metaCardsMain(format, timeSpanObj, startDate, endDate, optionsTypes, thatOptions);
            result.sideboard = metaCardsSideboard(format, timeSpanObj, startDate, endDate, optionsTypes, thatOptions);
            result.mainSideboard = metaCardsMainSideboard(format, timeSpanObj, startDate, endDate, optionsTypes, thatOptions);
            MetaCards.insert(result);
        });
    });
    // metaCardsSortArrays();
    console.log("end create meta 2");
}



metaTotalDecksCards = function(format, timeSpan, startDate, endDate, options, thatOptions){
    var totalAggregation = DecksNames.aggregate([
        {$project : {"format" : 1}},
        {$match : {format : format}},
        {$lookup : {"from" : "DecksData", "localField" : "_id", "foreignField" : "DecksNames_id", "as" : "DecksData"}},
        {$unwind : "$DecksData"},
        {$project : {format : "$format", date : "$DecksData.date", victory : "$DecksData.victory", loss : "$DecksData.loss", eventType : "$DecksData.eventType"}},
        {$match : {date : {$gte : startDate, $lte : endDate}, $or : thatOptions}},
        {$group : {_id : "$format", total : {$sum : 1}}}
    ]);


    if(totalAggregation.length){
        return totalAggregation[0].total;
    }
    return 0;


    // MetaCards.update(
    //     {format : format, options : options, timeSpan : timeSpan, format : format},
    //     {
    //         $set : {totalDecks : totalDecks},
    //     },
    //     {
    //         upsert : true
    //     }
    // );
};


metaCardsMain = function(format, timeSpan, startDate, endDate, options, thatOptions){
    var mainCards = DecksData.aggregate(
        [
            {$match : {date: {$gte: startDate, $lte: endDate}, format : format, $or: thatOptions, DecksNames_id : {$ne : null}}},
            {$unwind : "$main"},
            {$group : {_id : "$main.name", total : {$sum : "$main.quantity"}, count : {$sum : 1}}},
            {$sort : {total : -1}}
        ]
    );
    return mainCards;
};

metaCardsSideboard = function(format, timeSpan, startDate, endDate, options, thatOptions){
    var sideboard = DecksData.aggregate(
        [
            {$match : {date: {$gte: startDate, $lte: endDate}, format : format, $or: thatOptions, DecksNames_id : {$ne : null}}},
            {$unwind : "$sideboard"},
            {$group : {_id : "$sideboard.name", total : {$sum : "$sideboard.quantity"}, count : {$sum : 1}}},
            {$sort : {total : -1}}
        ]
    );
    return sideboard;
};

metaCardsMainSideboard = function(format, timeSpan, startDate, endDate, options, thatOptions){

    var mainSideboard = DecksData.aggregate(
        [
            {$match : {date: {$gte: startDate, $lte: endDate}, format : format, $or: thatOptions, DecksNames_id : {$ne : null}}},
            {$project : {cards : {"$setUnion" : [{$map : {input : "$main", as: "el", in : {name : "$$el.name", quantity : "$$el.quantity", class : {"$const" : "main"}}}},
                {$map : { input : "$sideboard", as: "el", in : { name : "$$el.name", quantity : "$$el.quantity", class : {"$const" : "sideboard"}}}}]}}},
            {$unwind : "$cards"},
            {$group : {"_id": { _id : "$_id", class: "$cards.class", name: "$cards.name" }, quantity : {$sum : "$cards.quantity"}}},
            {$group : {_id : {_id : "$_id._id", name : "$_id.name"}, quantity: {$sum : "$quantity"}}},
            {$group : {	_id : "$_id.name", total: {$sum : "$quantity"}, count: {$sum : 1}}}
        ]
    );
    return mainSideboard;
};


metaCardsSortArrays = function(){
    MetaCards.find({}).forEach(function(obj){
        obj.main.sort(function(a, b){
            return b.count - a.count;
        });

        obj.sideboard.sort(function(a, b){
            return b.count - a.count;
        });

        obj.mainSideboard.sort(function(a, b){
            return b.count - a.count;
        });

        MetaCards.update(
            {_id : obj._id},
            {
                $set : obj
            })
    })
};