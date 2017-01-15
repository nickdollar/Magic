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
})

