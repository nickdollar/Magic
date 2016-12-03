Meteor.publish('MetaByFormatTimeSpanOptions', function(format, timeSpan, options) {
    return MetaCards.find({format : format, options : {$size : options.length, $all : options}, timeSpan : timeSpan}, {fields : {main : {$slice : 40},  sideboard : {$slice : 40},  mainSideboard : {$slice : 40}}, reactive : false});
});