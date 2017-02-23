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



metaTotalDecksCards = function(format, options){

    var DecksArchetypesMeta = DecksArchetypes.aggregate([
        {$project : {"format" : 1}},
        {$match : {format : format}},
        {$lookup : {"from" : "DecksNames", "localField" : "_id", "foreignField" : "DecksArchetypes_id", "as" : "DecksNames"}},
        {$unwind : "$DecksNames"},
        {$project : {DecksNames_id : "$DecksNames._id"}},
        {$lookup : {"from" : "DecksData", "localField" : "DecksNames_id", "foreignField" : "DecksNames_id", "as" : "DecksData"}},
        {$unwind : "$DecksData"},
        {$project : {_id : "$_id", date : "$DecksData.date", position : "$DecksData.position", victory : "$DecksData.victory", type : "$DecksData.type"}},
        {$match : {date : {$gte : options.startDate, $lte : options.endDate}, type : {$in : options.types}, $or : [{position : {$gte : options.startPosition, $lte : options.endPosition}}, {victory : {$exists : true}, position : null}], }},
        // {$group : {	_id : "$DecksArchetypes", quantity : {$sum : 1}}}
    ]);
    return DecksArchetypesMeta.length;
};


metaCardsMain = function(format, options){
    var mainCards = DecksArchetypes.aggregate([
        {$project : {"format" : 1}},
        {$match : {format : format}},
        {$lookup : {"from" : "DecksNames", "localField" : "_id", "foreignField" : "DecksArchetypes_id", "as" : "DecksNames"}},
        {$unwind : "$DecksNames"},
        {$project : {DecksNames_id : "$DecksNames._id"}},
        {$lookup : {"from" : "DecksData", "localField" : "DecksNames_id", "foreignField" : "DecksNames_id", "as" : "DecksData"}},
        {$unwind : "$DecksData"},
        {$project : {_id : "$DecksData._id", main : "$DecksData.main", date : "$DecksData.date", position : "$DecksData.position", victory : "$DecksData.victory", type : "$DecksData.type"}},
        {$match : {date : {$gte : options.startDate, $lte : options.endDate}, type : {$in : options.types}, $or : [{position : {$gte : options.startPosition, $lte : options.endPosition}}, {victory : {$exists : true}, position : null}], }},
        {$unwind : "$main"},
        {$group : {"_id": { _id : "$_id", name: "$main.name" }, quantity : {$sum : "$main.quantity"}}},
        {$group : {_id : {_id : "$_id._id", name : "$_id.name"}, quantity: {$sum : "$quantity"}}},
        {$group : {	_id : "$_id.name", total: {$sum : "$quantity"}, count: {$sum : 1}}},
    ]);
    return mainCards;
};

metaCardsSideboard = function(format, options){

    var mainCards = DecksArchetypes.aggregate([
        {$project : {"format" : 1}},
        {$match : {format : format}},
        {$lookup : {"from" : "DecksNames", "localField" : "_id", "foreignField" : "DecksArchetypes_id", "as" : "DecksNames"}},
        {$unwind : "$DecksNames"},
        {$project : {DecksNames_id : "$DecksNames._id"}},
        {$lookup : {"from" : "DecksData", "localField" : "DecksNames_id", "foreignField" : "DecksNames_id", "as" : "DecksData"}},
        {$unwind : "$DecksData"},
        {$project : {_id : "$DecksData._id", cards : "$DecksData.sideboard", date : "$DecksData.date", position : "$DecksData.position", victory : "$DecksData.victory", type : "$DecksData.type"}},
        {$match : {date : {$gte : options.startDate, $lte : options.endDate}, type : {$in : options.types}, $or : [{position : {$gte : options.startPosition, $lte : options.endPosition}}, {victory : {$exists : true}, position : null}], }},
        {$unwind : "$cards"},
        {$group : {"_id": { _id : "$_id", name: "$cards.name" }, quantity : {$sum : "$cards.quantity"}}},
        {$group : {_id : {_id : "$_id._id", name : "$_id.name"}, quantity: {$sum : "$quantity"}}},
        {$group : {	_id : "$_id.name", total: {$sum : "$quantity"}, count: {$sum : 1}}},
    ]);
    return mainCards;
};

metaCardsMainSideboard = function(format, options){
    var DecksArchetypesMeta = DecksArchetypes.aggregate([
        {$project : {"format" : 1}},
        {$match : {format : format}},
        {$lookup : {"from" : "DecksNames", "localField" : "_id", "foreignField" : "DecksArchetypes_id", "as" : "DecksNames"}},
        {$unwind : "$DecksNames"},
        {$project : {DecksNames_id : "$DecksNames._id"}},
        {$lookup : {"from" : "DecksData", "localField" : "DecksNames_id", "foreignField" : "DecksNames_id", "as" : "DecksData"}},
        {$unwind : "$DecksData"},
        {$project : {_id : "$DecksData._id", main : "$DecksData.main", sideboard : "$DecksData.sideboard", date : "$DecksData.date", position : "$DecksData.position", victory : "$DecksData.victory", type : "$DecksData.type"}},
        {$match : {date : {$gte : options.startDate, $lte : options.endDate}, type : {$in : options.types}, $or : [{position : {$gte : options.startPosition, $lte : options.endPosition}}, {victory : {$exists : true}, position : null}], }},
        {$project : {cards : {"$setUnion" :
            [
                {$map : {input : "$main", as: "el", in : {name : "$$el.name", quantity : "$$el.quantity", class : {"$const" : "main"}}}},
                {$map : { input : "$sideboard", as: "el", in : { name : "$$el.name", quantity : "$$el.quantity", class : {"$const" : "sideboard"}}}}
            ]}}},
        {$unwind : "$cards"},
        {$group : {"_id": { _id : "$_id", class: "$cards.class", name: "$cards.name" }, quantity : {$sum : "$cards.quantity"}}},
        {$group : {_id : {_id : "$_id._id", name : "$_id.name"}, quantity: {$sum : "$quantity"}}},
        {$group : {	_id : "$_id.name", total: {$sum : "$quantity"}, count: {$sum : 1}}},
    ]);
    return DecksArchetypesMeta;
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