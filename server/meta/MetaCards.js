getTotalMetaCardsMainSideboard = function({format, options, LGS_ids}){
    var DecksArchetypesMeta = DecksArchetypes.aggregate([
        {$project : {"format" : 1}},
        {$match : {format : format}},
        {$lookup : {"from" : "DecksNames", "localField" : "_id", "foreignField" : "DecksArchetypes_id", "as" : "DecksNames"}},
        {$unwind : "$DecksNames"},
        {$project : {DecksNames_id : "$DecksNames._id"}},
        {$lookup : {"from" : "DecksData", "localField" : "DecksNames_id", "foreignField" : "DecksNames_id", "as" : "DecksData"}},
        {$unwind : "$DecksData"},
        {$project : {
            _id : "$DecksData._id",
            date : "$DecksData.date",
            LGS_id : "$DecksData.LGS_id",
            position : "$DecksData.position",
            victory : "$DecksData.victory",
            EventsTypes_id : "$DecksData.EventsTypes_id"
        }
        },
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
    ]);
    return DecksArchetypesMeta.length;
};

getMetaCardsMainSideboard = function({format, options, LGS_ids}){
    var DecksArchetypesMeta = DecksArchetypes.aggregate([
        {$project : {"format" : 1}},
        {$match : {format : format}},
        {$lookup : {"from" : "DecksNames", "localField" : "_id", "foreignField" : "DecksArchetypes_id", "as" : "DecksNames"}},
        {$unwind : "$DecksNames"},
        {$project : {DecksNames_id : "$DecksNames._id"}},
        {$lookup : {"from" : "DecksData", "localField" : "DecksNames_id", "foreignField" : "DecksNames_id", "as" : "DecksData"}},
        {$unwind : "$DecksData"},
        {$project : {
                _id : "$DecksData._id",
                cards : {"$setUnion" :
                    [
                        {$cond : {if : options.main, then : {$map : {input : "$DecksData.main", as: "el", in : {name : "$$el.name", quantity : "$$el.quantity", class : {"$const" : "main"}}}}, else : []}},
                        {$cond : {if : options.sideboard, then : {$map : { input : "$DecksData.sideboard", as: "el", in : { name : "$$el.name", quantity : "$$el.quantity", class : {"$const" : "sideboard"}}}}, else : []}},
                    ]},
                date : "$DecksData.date",
                LGS_id : "$DecksData.LGS_id",
                position : "$DecksData.position",
                victory : "$DecksData.victory",
                EventsTypes_id : "$DecksData.EventsTypes_id"
            }
        },
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
        {$unwind : "$cards"},
        {$group : {"_id": { _id : "$_id", name: "$cards.name" }, quantity : {$sum : "$cards.quantity"}}},
        {$group : {	_id : "$_id.name", total: {$sum : "$quantity"}, count: {$sum : 1}}},
        {$sort : {count : -1}}
    ]);
    return DecksArchetypesMeta;
};