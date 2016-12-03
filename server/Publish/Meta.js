Meteor.publish('metaFormatTimeSpanOptionsNonReactive', function(format, timeSpan, options) {
    return Meta.find({format : format, timeSpan : timeSpan, options : {$size : options.length, $all : options}});
});