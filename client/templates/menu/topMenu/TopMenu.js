Session.set("distance", 20);
Template.topMenu.helpers({
    format : function(){
        return Session.get("selectedMenuFormat");
    },
    active : function(link){
        if(Session.get("topMenuSite") == link){
            return 'active';
        }
    }
});

Template.topMenu.events({
    "change .distanceNumber" (evt){
        Session.set("distance", evt.target.value);
    }
});

Template.topMenu.events({
    "click .logout" : function(){
        // AccountsTemplates.logout()
        Meteor.logout(()=> {
            FlowRouter.go('/');
        });
    }
});

Template.topMenu.onRendered(function(){
    $(".distanceNumber").val(Session.get("distance"));
});
