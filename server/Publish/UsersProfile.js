Meteor.publish('UserProfilePublish', function() {
    return UsersProfile.find({_id : this.userId});
});