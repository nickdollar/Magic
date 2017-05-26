getTotalMetaCardsMainSideboard = function({Formats_id, options, LGS_ids}){
    var DecksArchetypesMeta = DecksArchetypes.aggregate([
        {$project : {"Formats_id" : 1}},
        {$lookup : {"from" : "DecksData", "localField" : "_id", "foreignField" : "DecksArchetypes_id", "as" : "DecksData"}},
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

getMetaCardsMainSideboard = function({Formats_id, options, LGS_ids}){
    var DecksArchetypesMeta = DecksArchetypes.aggregate([
        {$project : {"Formats_id" : 1}},
        {$match : {Formats_id : Formats_id}},
        {$lookup : {"from" : "DecksData", "localField" : "_id", "foreignField" : "DecksArchetypes_id", "as" : "DecksData"}},
        {$unwind : "$DecksData"},
        {$project : {
                _id : "$DecksData._id",
                cards : {"$setUnion" :
                    [
                        {$cond : {if : options.main, then : {$map : {input : "$DecksData.main", as: "el", in : {name : "$$el.name", qty : "$$el.qty", class : {"$const" : "main"}}}}, else : []}},
                        {$cond : {if : options.sideboard, then : {$map : { input : "$DecksData.sideboard", as: "el", in : { name : "$$el.name", qty : "$$el.qty", class : {"$const" : "sideboard"}}}}, else : []}},
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
        {$group : {"_id": { _id : "$_id", name: "$cards.name" }, qty : {$sum : "$cards.qty"}}},
        {$group : {	_id : "$_id.name", total: {$sum : "$qty"}, count: {$sum : 1}}},
        {$sort : {count : -1}}
    ]);
    return DecksArchetypesMeta;
};