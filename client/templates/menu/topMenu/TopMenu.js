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
    "click .logout" : function(){
        AccountsTemplates.logout()
    }
});


