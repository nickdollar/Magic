Meteor.methods({
    //CREATE NEW
    fixArchetypesColorsAbbreviation: function () {
        console.log("START: fixArchetypesColorsAbbreviation");

        DecksArchetypes.find({}).forEach(function(obj){
            var name = deckNameAndArchetypeFix(obj.name);
            DecksArchetypes.update({_id : obj._id}, {$set : {name : name}});
        })

        console.log("   END: fixArchetypesColorsAbbreviation");

    },
    addArchetype: function (form) {
        console.log("START: addArchetype");

        form.name = form.name.toTitleCase();

        DecksArchetypes.update(form,
            {
                $set : form
            },
            {
                upsert : true
            })

        console.log("   END: addArchetype");

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
            console.log(DecksArchetypes_id);
            var decksNames_ids = DecksNames.find({DecksArchetypes_id : DecksArchetypes_id}).map((deckName)=>{
                return deckName._id;
            })

            console.log(decksNames_ids);
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
            DecksDataUniqueWithoutQuantity.remove({DecksNames_id : {$n : decksNames_ids}});
        };
    },
})

