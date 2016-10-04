Meteor.publish('metaFormatTimeSpanOptions', function(format, timeSpan, options) {
    return Meta.find({format : format, options : {$size : options.length, $all : options}, timeSpan : timeSpan});
});