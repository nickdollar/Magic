Meteor.publish('DecksDataOnlyDecksNames_id', function() {
    return DecksData.find({}, {DecksNames_id : 1});
});