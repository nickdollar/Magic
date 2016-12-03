Meteor.methods({
    cardUpdate : function(){
        lastCardValues();
        //addAllCardsOnModernPerWeek();
    },

    methodFindDeckComparison : function(_id){
        return findDeckComparison(_id);
    },
    methodRemoveArchetype : function(archetype) {
        DecksNames.update({DecksArchetypes_id: archetype._id},
            {$unset: {DecksArchetypes_id : ""}},
            {multi: true}
        )

        DecksArchetypes.remove({_id: archetype._id})
    },

});

