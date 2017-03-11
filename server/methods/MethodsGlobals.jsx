Meteor.methods({
    insertToCollection(collection, document){
        global[collection].update(document, {$set : document}, {upsert : true});
        return true;
    },
    getLastTwenty(format){
         return MetaNewest.find({format : format, type : "lastTwenty"}, {limit : 1}).fetch()[0];
    }
})


