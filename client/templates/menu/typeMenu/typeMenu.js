Template.typeMenu.helpers({
   path : function(){
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