Meteor.methods({
    insertToCollection(collection, document){
        console.log(document);
        // global[collection].update(document, {$set : document}, {upsert : true});
        return true;
    }
})


