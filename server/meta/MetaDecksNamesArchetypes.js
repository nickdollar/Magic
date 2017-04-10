getMetaAllArchetypes = function({Formats_id, options, LGS_ids}){
    var DecksArchetypesMeta = DecksArchetypes.aggregate([
        {$project : {"Formats_id" : 1}},
        {$match : {Formats_id : Formats_id}},
        {$lookup : {"from" : "DecksNames", "localField" : "_id", "foreignField" : "DecksArchetypes_id", "as" : "DecksNames"}},
        {$unwind : "$DecksNames"},
        {$project : {DecksNames_id : "$DecksNames._id"}},
        {$lookup : {"from" : "DecksData", "localField" : "DecksNames_id", "foreignField" : "DecksNames_id", "as" : "DecksData"}},
        {$unwind : "$DecksData"},
        {$project : {
            DecksNames_id : "$DecksNames_id",
            date : "$DecksData.date", position : "$DecksData.position", victory : "$DecksData.victory", EventsTypes_id : "$DecksData.EventsTypes_id", LGS_id : "$DecksData.LGS_id"}},
        {$match : {
            date : {$gte : options.startDate, $lte : options.endDate},
            $and : [
                {
                    $or : [
                        {EventsTypes_id : {$in : options.EventsTypes_ids, $ne : "LGS"}},
                        {EventsTypes_id : {$in : options.EventsTypes_ids}, LGS_id : {$in : LGS_ids}},
                    ],
                },
                {
                    $or : [
                        {position : {$gte : options.startPosition, $lte : options.endPosition}}, {victory : {$exists : true}, position : null}
                    ]
                }
            ]
        }},
        {$group : {	_id : "$_id", quantity : {$sum : 1}}},
        {$sort : {quantity : -1}}
    ]);

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

    var DecksArchetypesMetaBeforeDate = DecksArchetypes.aggregate([
        {$project : {"Formats_id" : 1}},
        {$match : {Formats_id : Formats_id}},
        {$lookup : {"from" : "DecksNames", "localField" : "_id", "foreignField" : "DecksArchetypes_id", "as" : "DecksNames"}},
        {$unwind : "$DecksNames"},
        {$project : {DecksNames_id : "$DecksNames._id"}},
        {$lookup : {"from" : "DecksData", "localField" : "DecksNames_id", "foreignField" : "DecksNames_id", "as" : "DecksData"}},
        {$unwind : "$DecksData"},
        {$project : {
            DecksNames_id : "$DecksNames_id",
            date : "$DecksData.date", position : "$DecksData.position", victory : "$DecksData.victory", EventsTypes_id : "$DecksData.EventsTypes_id", LGS_id : "$DecksData.LGS_id"}},
        {$match : {
            date : {$gte : options.startDate, $lte : options.positionChange},
            $and : [
                {
                    $or : [
                        {EventsTypes_id : {$in : options.EventsTypes_ids, $ne : "LGS"}},
                        {EventsTypes_id : {$in : options.EventsTypes_ids}, LGS_id : {$in : LGS_ids}},
                    ],
                },
                {
                    $or : [
                        {position : {$gte : options.startPosition, $lte : options.endPosition}}, {victory : {$exists : true}, position : null}
                    ]
                }
            ]
        }},
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
    return DecksArchetypesMeta;
};