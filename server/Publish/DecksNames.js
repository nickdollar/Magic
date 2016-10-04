Meteor.publish('DecksNamesById', function(DecksNames_id) {
    return DecksNames.find({_id : DecksNames_id});
});

Meteor.publish('DecksNamesByArchetypeNameRegex', function(archetypeName) {
    var deckArchetype = DecksArchetypes.findOne({name : {$regex : archetypeName}});
    console.log(deckArchetype);

    return DecksNames.find({DecksArchetypes_id : deckArchetype._id});
});

Meteor.publish('testDecksNames', function(format) {
    return DecksNames.find({DecksArchetypes_id : {$exists : true}}, {fields : {name : 1, DecksArchetypes_id : 1, colors : 1, type : 1}});
});

