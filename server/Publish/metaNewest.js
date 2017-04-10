Meteor.publish('metaNewestLatest', function() {
    return MetaNewest.find({type : "lastDays"});
});