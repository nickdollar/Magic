Meteor.publishComposite('dashBoardDecksTables', function(tableName, ids, fields) {

    return {
        find: function () {
            return DecksData.find({_id: {$in: ids}}, {fields: fields});
        },
        children: [
            {
                find: function(deckData) {
                    // Publish the related user
                    console.log(deckData);
                    return DecksNames.find({_id: deckData.DecksNames_id}, {limit: 1, fields: {name : 1}, sort: {_id: 1}});
                }
            }
        ]
    };

});



Meteor.publishComposite('dacksWithoutNameTable', function(tableName, ids, fields) {

    return {
        find: function () {
            return DecksData.find({_id: {$in: ids}}, {fields: fields});
        },
        children: [
            {
                find: function(deckData) {
                    // Publish the related user
                    return DecksNames.find({_id: deckData.DecksNames_id}, {limit: 1, fields: {name : 1}, sort: {_id: 1}});
                }
            }
        ]
    };

});
