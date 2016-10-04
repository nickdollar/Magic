Meteor.publish('metaNewestFormat', function(format) {
    return MetaNewest.find({format : format});
});