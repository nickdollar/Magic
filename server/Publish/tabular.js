Meteor.publishComposite('testEventSmallTable', function(tableName, ids, fields) {
    console.log(ids);
    return {
        find : function(){
            return _Deck.find({_id: {$in: ids}}, {fields: fields});
        }

    }

});
