Template.topMenu.helpers({
    format : function(){
        return Router.current().params.format;
    },
    active : function(link){
        if(Session.get("topMenuSite") == link){
            return 'active';
        }
    }
});