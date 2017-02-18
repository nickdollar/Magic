Meteor.methods({
    //CREATE NEW
    fixArchetypesColorsAbbreviation: function () {
        console.log("START: fixArchetypesColorsAbbreviation");

        DecksArchetypes.find({}).forEach(function(obj){
            var name = deckNameAndArchetypeFix(obj.name);
            DecksArchetypes.update({_id : obj._id}, {$set : {name : name}});
        })

        console.log("END: fixArchetypesColorsAbbreviation");

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

        console.log("END: addArchetype");

    },
})

