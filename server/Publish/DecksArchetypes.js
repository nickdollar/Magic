Meteor.publish('DecksArchetypesGlobal', function() {
    return DecksArchetypes.find({});
});

Meteor.publish('DecksArchetypesFormat', function(Formats_id) {
    return DecksArchetypes.find({Formats_id : Formats_id});
});