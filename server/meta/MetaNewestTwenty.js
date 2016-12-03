createMetaNewThings = function(format){
    console.log("createMetaNewThings");

    MetaNewest.remove({type : "lastTwenty", format : format});

    var metaNewThingsObj = {};
        metaNewThingsObj.type = "lastTwenty";
        metaNewThingsObj.format = format;
        metaNewThingsObj.newestDecks = createMetaNewDecks(format);
        metaNewThingsObj.newestArchetypes = createMetaArchetypesDecks(format);
        metaNewThingsObj.newestCards = createMetaNewCards(format);


    MetaNewest.insert(metaNewThingsObj);
    console.log("end");
}

createMetaNewThingsDaysAllFormats = function(){
    console.log("createMetaNewThingsDays");

    MetaNewest.remove({type : "lastDays"});

    var metaNewThingsObj = {};
        metaNewThingsObj.type = "lastDays";
        metaNewThingsObj.newestDecks = createMetaNewDecksLatestDaysAllFormats(14);
        metaNewThingsObj.newestArchetypes = createMetaArchetypesDecksLatestDaysAllFormats(14);
        metaNewThingsObj.newestCards = createMetaNewCardsLatestDaysAllFormats(14);

    MetaNewest.insert(metaNewThingsObj);
    console.log("end");
}

createMetaNewDecks = function(format){
    var newestDecks = DecksData.aggregate(
        [
            {
                $match : {
                    DecksNames_id : {$exists : 1}, format : format
                }
            },
            {
                $group : {
                    _id : "$DecksNames_id",
                    format : {$first : "$format"},
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
                    format : "$format",
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

createMetaArchetypesDecks = function(format){
    var newestArchetypes = DecksData.aggregate(
        [
            {
                $match : {
                    format : format,
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
                    format : {$first : "$format"},
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
                    format : {$first : "$format"},
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
                    format : "$format",
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
                                        format : "$format",
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
                                        format : "$format",
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
                format : {$first : "$cards.format"},
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
                    format : "$format",
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



createMetaNewDecksLatestDaysAllFormats = function(days){
    var date = new Date();
    date.setDate(date.getDate() - days);
    var newestDecks = DecksData.aggregate(
        [
            {
                $match : {
                    DecksNames_id : {$exists : 1}
                }
            },
            {
                $group : {
                    _id : {DecksNames_id : "$DecksNames_id", format : "$format"},
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
                $match : {date : {$gte : date}}
            },
            {
                $project : {
                    _id : "$_id.DecksNames_id",
                    format : "$_id.format",
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

createMetaArchetypesDecksLatestDaysAllFormats = function(days){
    var date = new Date();
    date.setDate(date.getDate() - days);
    var newestArchetypes = DecksData.aggregate(
        [
            {
                $sort : {
                    date : -1
                }
            },
            {
                $group : {
                    _id : {DecksNames_id : "$DecksNames_id"},
                    format : {$first : "$format"},
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
                    format : {$first : "$format"},
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
                $match : {date : {$gte : date}}
            },
            {
                $project : {
                    _id : "$_id.DecksArchetypes_id",
                    format : "$format",
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


createMetaNewCardsLatestDaysAllFormats = function(days){

    var date = new Date();
    date.setDate(date.getDate() - days);

    var newestCards = DecksData.aggregate(
        [
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
                                        format : "$format",
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
                                        format : "$format",
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
                _id : {name : "$cards.name", format : "$cards.format"},
                DecksData_id : {$first : "$cards.DecksData_id"},
                Events_id : {$first : "$cards.Events_id"},
                date : {$min : "$cards.date"}
            }
            },
            {
                $match : {date : {$gte : date}}
            },
            {$sort : {
                date : -1
            }},
            {
                $project : {
                    _id : "$_id",
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