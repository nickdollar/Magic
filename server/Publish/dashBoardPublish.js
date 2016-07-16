Meteor.publish('allUsers', function(){
    if(Roles.userIsInRole(this.userId, "normal-user")){
        return Meteor.users.find({});
    }

});