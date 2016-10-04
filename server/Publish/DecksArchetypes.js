Meteor.publish('testDecksArchetypes', function(format, weeksSpan, types) {
    return DecksArchetypes.find({ format : format });
});

Meteor.publish('DecksArchetypesByNameRegexLimit1', function(name) {
    return DecksArchetypes.find({ name : {$regex : name, $options : "g"}}, {limit : 1});
});

Meteor.publishComposite("deckSelectedArchetypesAndDecksNames", function(format, archetypeName) {
    return {
        find: function () {
            return DecksArchetypes.find({name: {$regex : archetypeName}, format : format});
        },
        children: [
            {
                find: function (deckArchetype) {
                    return DecksNames.find({DecksArchetypes_id : deckArchetype._id});
                }
            }
        ]
    }
});