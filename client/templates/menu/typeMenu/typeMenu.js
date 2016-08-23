Session.setDefault("selectedMenuFormat", '');

Template.typeMenu.helpers({
   path : function(){
       if(Router.current().route.getName() == "metaFP"){
           return "selectedMeta";
       }else if (Router.current().route.getName() == "deckFP"){
           return "selectADeck";
       }else if(Router.current().route.getName() == "selectedEvent"){
           return "events";
       }
       return Router.current().route.getName();
   },
    active : function(format){
        if(Session.get("selectedMenuFormat") == format){
            return 'active';
        }
    }
});

Template.typeMenu.events({
    "click .selectedFormat" : function(evt, tmp){
        Session.set("selectedMenuFormat", $(evt.target).attr("name"));
    }
});