Meteor.methods({
    //CREATE NEW
    fixDecksNamesColorsAbbreviation: function () {
        console.log("START: " + fixDecksNamesColorsAbbreviation);
        
        DecksNames.find({}).forEach(function(obj){
            var name = deckNameAndArchetypeFix(obj.name);
            DecksNames.update({_id : obj._id}, {$set : {name : name}});
        })

        console.log("   END: " + fixDecksNamesColorsAbbreviation);

    },
    addDeckName(data){
        data.name = data.name.toTitleCase();
        DecksNames.update(data,
            {$set : data},
            {upsert : true}
        );
        return true;
    },
    removeDeckName(DecksNames_id){
        if(Roles.userIsInRole(Meteor.user(), ['admin'])){

            DecksData.update({DecksNames_id : DecksNames_id},
                {
                    $set : {state : "nameRemoved"},
                    $unset : {DecksNames_id : ""}
                },
                {
                    multi : true
                }
            )
            DecksDataUniqueWithoutQuantity.remove({DecksNames_id : DecksNames_id});
            DecksNames.remove({DecksNames_id : DecksNames_id});
        };
    },
    updateDeckName(form){
        if(Roles.userIsInRole(Meteor.user(), ['admin'])){

            DecksNames.update(  {_id : form._id},
                                {
                                    $set : form
                                }
                              )
        };
    }
})

