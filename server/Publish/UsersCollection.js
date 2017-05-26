Meteor.publish('UserCollectionPublish', function() {
    return UsersCollection.find({_id : this.userId});
});