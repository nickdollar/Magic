Meteor.methods({
    //CREATE NEW
    fixDecksNamesColorsAbbreviation: function () {
        console.log("START: " + fixDecksNamesColorsAbbreviation);
        
        DecksNames.find({}).forEach(function(obj){
            var name = deckNameAndArchetypeFix(obj.name);
            DecksNames.update({_id : obj._id}, {$set : {name : name}});
        })

        console.log("END: " + fixDecksNamesColorsAbbreviation);

    },
})

