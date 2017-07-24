Meteor.methods({
    getMetaLastDaysAdditionMethod(){
         return MetaLastDaysAdditions.findOne();
    },
    createMetaLastDaysAdditionsMethod(){
        createMetaLastDaysAdditions();
    }
})

createMetaLastDaysAdditions = function(){
    logFunctionsStart("createMetaLastDaysAdditions");
        var metaLastDaysAdditions = {};
        metaLastDaysAdditions.newestArchetypes = createMetaArchetypesDecks();
        metaLastDaysAdditions.newestCards = createMetaNewCards();
        MetaLastDaysAdditions.update({},
            {$set : metaLastDaysAdditions},
            {upsert : true}
        )
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    DailyProcessConfirmation.update({date : date},
        {
            $set : {date : date, createMetaLastDaysAdditions : true}
        },
        {
            upsert : 1
        })
    logFunctionsEnd("createMetaLastDaysAdditions");
}

createMetaArchetypesDecks = function(){
    var date = new Date();
    date = date.addDays(-30);
    var newestArchetypes = DecksData.aggregate(
        [
            {
                $match: {
                    DecksArchetypes_id : {$exists : true},
                    EventsTypes_id : {$ne : "LGS"}
                }
            },
            {
                $project: {
                    DecksArchetypes_id : 1,
                    Events_id : 1,
                    date : 1,
                    Formats_id : 1
                }
            },
            {
                $sort: {
                    date : 1
                }
            },
            {
                $group: {
                    _id : "$DecksArchetypes_id",
                    date : {$first : "$date"},
                    Events_id : {$first : "$Events_id"},
                    Formats_id : {$first : "$Formats_id"}
                }
            },
            {
                $project: {
                    DecksData_id : 1,
                    date : 1,
                    Events_id : 1,
                    Formats_id : 1,
                    t : {$const : 1}
                }
            },
            {
                $match: {
                    date : {$gt : date}
                }
            },
        ]
    );

    return newestArchetypes;
}

createMetaNewCards = function(){
    var date = new Date();
    date = date.addDays(-30);
    var newestCards = DecksData.aggregate(
        [
            {
                $match: {
                    DecksArchetypes_id : {$exists : true},
                    EventsTypes_id : {$ne : "LGS"}
                }
            },
            {
                $project: {
                    main : 1,
                    Events_id : 1,
                    date : 1,
                    Formats_id : 1
                }
            },
            {
                $unwind: "$main"
            },
            {
                $sort: {
                    date : 1
                }
            },
            {
                $group: {
                    _id : {Cards_id : "$main.Cards_id", Formats_id : "$Formats_id"},
                    DecksData_id : {$first : "$_id"},
                    date : {$first : "$date"},
                    Events_id : {$first : "$Events_id"},
                }
            },
            {
                $project: {
                    DecksData_id : 1,
                    date : 1,
                    Events_id : 1,
                    Formats_id : 1,
                    t : {$const : 2}
                }
            },
            {
                $match: {
                    date : {$gt : date}
                }
            }
        ]
    );
    return newestCards;
}