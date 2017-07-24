Meteor.methods({
    createMetaLastAdditionMethod(){
        createMetaLastAddition();
    },
    getMetaLastAddition({Formats_id}){
        return MetaLastAddition.findOne({Formats_id : Formats_id});
    }
})


createMetaLastAddition = ()=>{
    logFunctionsStart("createMetaNewThingsDaysAllFormats");
        Formats.find({active : 1}).map((format)=>{
            var metaLastAddition = {};
            metaLastAddition.newestArchetypes = metaLastAdditionArchetypes({Formats_id : format._id});
            metaLastAddition.newestCards = metaLastAdditionCards({Formats_id : format._id});

            MetaLastAddition.update({Formats_id : format._id},
                {$set : metaLastAddition},
                {upsert : true}
            );
        });
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    DailyProcessConfirmation.update({date : date},
        {
            $push : {date : date, createMetaLastAddition : true}
        },
        {
            upsert : 1
        })
    logFunctionsEnd("createMetaNewThingsDaysAllFormats");
}



metaLastAdditionArchetypes = function({Formats_id}){

    var newestArchetypes = DecksData.aggregate(

        // Pipeline
        [
            // Stage 1
            {
                $match: {
                    DecksArchetypes_id : {$exists : true},
                    Formats_id : Formats_id
                }
            },

            // Stage 2
            {
                $sort: {
                    date : 1
                }
            },

            // Stage 3
            {
                $group: {
                    _id : "$DecksArchetypes_id",
                    date : {$first : "$date"},
                }
            },

            // Stage 4
            {
                $sort: {
                    date : -1
                }
            },

            // Stage 5
            {
                $limit: 20
            },
            {
                $project : {
                    date : 1,
                    t : {$const : 1}
                }
            }

        ]
    );
    return newestArchetypes;
}


metaLastAdditionCards = function(){
    var newestCards = DecksData.aggregate(
        [
            {
                $match: {
                    DecksArchetypes_id : {$exists : true},
                    Formats_id : "sta"
                }
            },
            {
                $project: {
                    main : 1,
                    date : 1,
                    Events_id : 1,
                    Formats_id : 1
                }
            },
            {
                $sort: {
                    date : 1
                }
            },
            {
                $unwind: {
                    path : "$main"
                }
            },
            {
                $group: {
                    _id : "$main.Cards_id",
                    date : {$first : "$date"},
                    DecksData_id : {$first : "$_id"},
                    Events_id : {$first : "$Events_id"},
                    Formats_id : {$first : "$Formats_id"}

                }
            },
            {
                $limit: 20

            },
            {
                $project : {
                    date : 1,
                    DecksData_id : 1,
                    Events_id : 1,
                    Formats_id : 1,
                    t : {$const : 2}
                }
            }
        ]
    );
    return newestCards;
}