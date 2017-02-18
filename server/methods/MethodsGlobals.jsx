Meteor.methods({
    insertToCollection(collection, document){
        global[collection].update(document, {$set : document}, {upsert : true});
        return true;
    },
    getLastTwenty(format){
         return MetaNewest.findOne({format : format, type : "lastTwenty"});
    }
})


