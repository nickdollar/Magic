Template.dashBoard.onCreated(function(){
    var that = this;
    this.autorun(function(){
       that.subscribe("allUsers");
    });

})

Template.dashBoard.helpers({
    admin : function(){
        console.log(Meteor.userId());
        return Roles.userIsInRole(Meteor.userId(), 'normal-user');
    },
    users : function(){
        return Meteor.users.find();
    },
    emails : function(){
        return this.emails[0].address;
    }
})