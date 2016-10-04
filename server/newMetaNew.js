createMetaNewThings = function(){
    var formats = ["standard","modern","legacy", "vintage"];
    console.log("createMetaNewThings");
    for(var i = 0; i < formats.length; ++i){
        createMetaNewDecks(formats[i]);
        createMetaArchetypesDecks(formats[i]);
        createMetaNewCards(formats[i]);
    }
    console.log("end");
}

createMetaNewDecks = function(format){
    var newestDecks = DecksData.aggregate(
        [
            {
                $match : {
                    format : format,
                }
            },
            {
                $group : {
                    _id : "$DecksNames_id",
                    date : {
                        $min : "$date"
                    }
                }

            },
            {
                $sort : {
                    date : -1
                }
            },
            {
                $limit : 20
            },
            {
                $project : {
                    _id : "$_id",
                    date : "$date",
                    t : {$const : 1}
                }
            }
        ]
    )

    MetaNewest.update(
        {format : format},
        {$set : {newestDecks : newestDecks}},
        {upsert : true}
    )
}

createMetaArchetypesDecks = function(format){
    var newestArchetypes = DecksData.aggregate(
        [
            {
                $match : {
                    format : format,
                }
            },
            {
                $group : {
                    _id : "$DecksNames_id",
                    date :
                    {
                        $min : "$date"
                    }
                }
            },
            {
                $lookup : {
                    "from" : "DecksNames",
                    "localField" : "_id",
                    "foreignField" : "_id",
                    "as" : "DecksNames"
                }
            },
            {
                $unwind : "$DecksNames"
            },
            {
                $group : {
                    _id : "$DecksNames.DecksArchetypes_id",
                    date : { $min : "$date"}
                }
            },
            {
                $sort : {
                    date : -1
                }
            },
            {
                $limit : 20
            },
            {
                $project : {
                    _id : "$_id",
                    date : "$date",
                    t : {$const : 2}
                }
            }

        ]
    )

    MetaNewest.update(
        {format : format},
        {$set : {newestArchetypes : newestArchetypes}},
        {upsert : true}
    )
}


createMetaNewCards = function(format){
    var newestCards = DecksData.aggregate(
        [
            {
                $match : {
                    format : format,
                }
            },
            { $project :
                {
                    cards : {
                        "$setUnion" :
                            [
                                {
                                    $map : {
                                        input : "$main",
                                        as: "el",
                                        in : {
                                            name : "$$el.name",
                                            class : {"$const" : "main"},
                                            date : "$date"
                                        }
                                    }
                                },
                                {
                                    $map : {
                                        input : "$sideboard",
                                        as: "el",
                                        in : {
                                            name : "$$el.name",
                                            class : {"$const" : "sideboard"},
                                            date : "$date",
                                            DeckDate_id : "$_id"
                                        }
                                    }
                                }
                            ]
                    }
                }
            },
            {$unwind : "$cards"},
            {$sort : {
                "cards.date" : -1
            }},
            {$group:
                {
                    _id : "$cards.name",
                    DecksData_id : {$first : "$_id"},
                    date : {$min : "$cards.date"}
                }
            },
            {$sort : {
                date : -1
            }},
            {
                $limit : 20
            },
            {
                $project : {
                    _id : "$_id",
                    DecksData_id : "$DecksData_id",
                    date : "$date",
                    t : {$const : 3}
                }
            }
        ]
    )
    MetaNewest.update(
        {format : format},
        {$set : {newestCards : newestCards}},
        {upsert : true}
    )
}