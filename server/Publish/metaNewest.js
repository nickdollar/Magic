Meteor.publish('metaNewestFormatLastTwenty', function(format) {
    return MetaNewest.find({format : format, type : "lastTwenty"});
});

Meteor.publish('metaNewestLatest', function() {
    return MetaNewest.find({type : "lastDays"});
});