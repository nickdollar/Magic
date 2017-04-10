Meteor.methods({
    insertToCollection(collection, document){
        global[collection].update(document, {$set : document}, {upsert : true});
        return true;
    },
    getLastTwenty(Formats_id){
         return MetaNewest.find({Formats_id : Formats_id, type : "lastTwenty"}, {limit : 1}).fetch()[0];
    }
})


