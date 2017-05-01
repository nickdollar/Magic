Meteor.methods({
    getMetaLastAdditionMethod(){
         return MetaLastDayAddition.findOne();
    },
    createMetaNewestFormatMethod(){
        createMetaNewestFormats();
    }
})


createMetaNewestFormats = function(Formats_id){
    logFunctionsStart("createMetaNewThings");
    var metaNewThingsObj = {};
    metaNewThingsObj.Formats_id = Formats_id;
    metaNewThingsObj.newestDecks = createMetaNewDecks(Formats_id);
    metaNewThingsObj.newestArchetypes = createMetaArchetypesDecks(Formats_id);
    metaNewThingsObj.newestCards = createMetaNewCards(Formats_id);

    MetaLastAddition.update({},
        {$set : {metaNewThingsObj}},
        {upsert : true}
    )
    logFunctionsEnd("end");
}



createMetaNewDecks = function(Formats_id){
    var newestDecks = DecksData.aggregate(
        [
            {
                $match : {
                    DecksNames_id : {$exists : 1}, Formats_id : Formats_id
                }
            },
            {
                $group : {
                    _id : "$DecksNames_id",
                    Formats_id : {$first : "$Formats_id"},
                    DecksData_id : {$first : "$_id"},
                    Events_id : {$first : "$Events_id"},
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
                    Formats_id : "$Formats_id",
                    DecksData_id : "$DecksData_id",
                    Events_id : "$Events_id",
                    date : "$date",
                    t : {$const : 1}
                }
            }
        ]
    )
    return newestDecks;
}


createMetaArchetypesDecks = function(Formats_id){
    var newestArchetypes = DecksData.aggregate(
        [
            {
                $match : {
                    Formats_id : Formats_id,
                }
            },
            {
                $sort : {
                    date : -1
                }
            },
            {
                $group : {
                    _id : {DecksNames_id : "$DecksNames_id"},
                    Formats_id : {$first : "$Formats_id"},
                    DecksData_id : {$first : "$_id"},
                    Events_id : {$first : "$Events_id"},
                    date : {$min : "$date"}
                }
            },
            {
                $lookup : {
                    "from" : "DecksNames",
                    "localField" : "_id.DecksNames_id",
                    "foreignField" : "_id",
                    "as" : "DecksNames"
                }
            },
            {
                $unwind : "$DecksNames"
            },
            {
                $group : {
                    _id : {DecksArchetypes_id : "$DecksNames.DecksArchetypes_id"},
                    Formats_id : {$first : "$Formats_id"},
                    DecksNames_id : {$first : "$DecksNames._id"},
                    DecksData_id : {$first : "$DecksData_id"},
                    Events_id : {$first : "$Events_id"},
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
                    _id : "$_id.DecksArchetypes_id",
                    Formats_id : "$Formats_id",
                    DecksNames_id : "$DecksNames_id",
                    DecksData_id : "$DecksData_id",
                    Events_id : "$Events_id",
                    date : "$date",
                    t : {$const : 2}
                }
            }
        ]
    )
    return newestArchetypes;
}



createMetaNewCards = function(Formats_id){
    var newestCards = DecksData.aggregate(
        [
            {
                $match : {
                    Formats_id : Formats_id,
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
                                            Formats_id : "$Formats_id",
                                            class : {"$const" : "main"},
                                            date : "$date",
                                            DecksData_id : "$_id",
                                            Events_id : "$Events_id"
                                        }
                                    }
                                },
                                {
                                    $map : {
                                        input : "$sideboard",
                                        as: "el",
                                        in : {
                                            name : "$$el.name",
                                            Formats_id : "$Formats_id",
                                            class : {"$const" : "sideboard"},
                                            date : "$date",
                                            DecksData_id : "$_id",
                                            Events_id : "$Events_id"
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
                    Formats_id : {$first : "$cards.Formats_id"},
                    DecksData_id : {$first : "$cards.DecksData_id"},
                    Events_id : {$first : "$cards.Events_id"},
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
                    Formats_id : "$Formats_id",
                    DecksData_id : "$DecksData_id",
                    Events_id : "$Events_id",
                    date : "$date",
                    t : {$const : 3}
                }
            }
        ]
    )
    return newestCards;
}