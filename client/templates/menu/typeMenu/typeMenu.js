Template.typeMenu.helpers({
   path : function(){
       console.log(Session.get("topMenuSite"));
        return Session.get("currentRouter");
   },
    active : function(format){
        if(Router.current().params.format == null && format == ''){
            return 'active';
        }

        if(Router.current().params.format == format){
            return 'active';
        }
    }
});