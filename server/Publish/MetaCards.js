Meteor.publish('MetaByFormatTimeSpanOptions', function(format, timeSpan, options, fields) {
    if(!options.length){
        return MetaCards.find({_id : "AAAAA"});
    }
    return MetaCards.find({format : format, options : {$size : options.length, $all : options}, timeSpan : timeSpan}, {fields : {main : {$slice : 40},  sideboard : {$slice : 40},  mainSideboard : {$slice : 40}}});
});