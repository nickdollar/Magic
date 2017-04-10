Meteor.methods({
    //CREATE NEW
    fixArchetypesColorsAbbreviation: function () {
        logFunctionsStart("fixArchetypesColorsAbbreviation");

        DecksArchetypes.find({}).forEach(function(obj){
            var name = deckNameAndArchetypeFix(obj.name);
            DecksArchetypes.update({_id : obj._id}, {$set : {name : name}});
        })

        logFunctionsEnd("fixArchetypesColorsAbbreviation");

    },
    addArchetype: function (form) {
        logFunctionsStart("addArchetype");

        form.name = form.name.toTitleCase();

        DecksArchetypes.update(form,
            {
                $set : form
            },
            {
                upsert : true
            })

        logFunctionsEnd("addArchetype");

    },
    updateDeckArchetype(form){
        if(Roles.userIsInRole(Meteor.user(), ['admin'])){
            DecksArchetypes.update(  {_id : form._id},
                {
                    $set : form
                }
            )
        };
    },
    removeDecksArchetypes(DecksArchetypes_id){
        if(Roles.userIsInRole(Meteor.user(), ['admin'])){
            var decksNames_ids = DecksNames.find({DecksArchetypes_id : DecksArchetypes_id}).map((deckName)=>{
                return deckName._id;
            })

            DecksNames.remove({DecksNames_id : {$in : decksNames_ids}});
            DecksData.update({DecksNames_id : {$in : decksNames_ids}},
                {
                    $set : {state : "nameRemoved"},
                    $unset : {DecksNames_id : ""}
                },
                {
                    multi : true
                }
            )
            DecksDataUniqueWithoutQuantity.remove({DecksNames_id : {$in : decksNames_ids}});
            DecksArchetypes.remove({_id : DecksArchetypes_id});
        };
    },

    createShellArchetype(DecksArchetypes_id){
        logFunctionsStart("DecksArchetypes_id");
        var DecksArchetypesAggregation = DecksArchetypes.aggregate(
            [
                {$match: {_id : DecksArchetypes_id}},
                {$lookup: {
                        "from" : "DecksNames",
                        "localField" : "_id",
                        "foreignField" : "DecksArchetypes_id",
                        "as" : "DecksNames"
                    }
                },
                {$unwind: {path : "$DecksNames"}},
                {$lookup: {
                        "from" : "DecksData",
                        "localField" : "DecksNames._id",
                        "foreignField" : "DecksNames_id",
                        "as" : "DecksData"
                }},
                {
                    $unwind: {
                        path : "$DecksData"
                    }
                },

                // Stage 6
                {
                    $project: {
                        _id : "$DecksData._id",
                        name : {
                            $map : {input : "$DecksData.main", as : "el", in : "$$el.name"}
                        }
                    }
                },

                // Stage 7
                {
                    $unwind: {
                        path : "$name",
                    }
                },

                // Stage 8
                {
                    $group: {
                        _id : "$name",
                        count : {$sum : 1}
                    }
                },

                // Stage 9
                {
                    $lookup: {
                        "from" : "CardDatabase",
                        "localField" : "_id",
                        "foreignField" : "name",
                        "as" : "cardData"
                    }
                },

                // Stage 10
                {
                    $unwind: {
                        path : "$cardData"

                    }
                },

                // Stage 11
                {
                    $match: {
                        "cardData.land" : false
                    }
                },
                {$group: {
                        _id : "$count",
                        cards : { $push : "$_id"}
                    }
                },
                {
                    $sort : {_id : -1}
                }

            ]


        );
        ArchetypesShells.update({DecksArchetypes_id : DecksArchetypes_id},{
                $set : {
                    cardTiers : DecksArchetypesAggregation
                }
            },
            {
                upsert : true
            }
        )
        logFunctionsEnd("DecksArchetypes_id");
    },
    createArchetypesShellsForFormat(Formats_id){
        logFunctionsStart("createShellForFormat");
        DecksArchetypes.find({Formats_id : Formats_id}).forEach((deckArchetype)=>{
            Meteor.call("createShellArchetype", deckArchetype._id);
        })
        logFunctionsEnd("createShellForFormat");
    },
    DecksArchetypesformatToFormats_idMethod(){
        logFunctionsStart("DecksArchetypesformatToFormats_idMethod")
        Formats.find({}).map(format => {
            var formatsRegex = [];
            for (var i = 0; i < format.names.length; i++) {
                formatsRegex[i] = new RegExp(format.names[i], "i");
            }
            DecksArchetypes.update({format : {$in : formatsRegex}},
                {
                    $set : {Formats_id : format._id},
                    $unset : {format : ""}
                },
                {
                    multi : true
                })
        });
        logFunctionsEnd("DecksArchetypesformatToFormats_idMethod")
    },
    DecksArchetypesCreateLinkNameMethod(){
        logFunctionsStart("DecksArchetypesCreateLinkNameMethod")

        DecksArchetypes.find({}).map(deckArchetype => {
            DecksArchetypes.update({_id : deckArchetype._id},
                {
                    $set : { link: deckArchetype.name.replace(/[^a-zA-Z0-9-_]/g, '')},
                },
                {
                    multi : true
                }
            )
        });
        logFunctionsEnd("DecksArchetypesCreateLinkNameMethod")
    }
})

