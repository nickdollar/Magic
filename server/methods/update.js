Meteor.methods({
    updateArchetypes: function (doc, _id) {
        DecksArchetypes.update({_id : _id }, doc)
    },
});

