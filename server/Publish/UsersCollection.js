Meteor.publish('UserCollection', function() {
    return UsersCollection.find({Users_id : this.userId});
});