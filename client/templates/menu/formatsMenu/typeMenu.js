Session.setDefault("selectedMenuFormat", '');

Template.typeMenu.helpers({
   path : function(){
       if(FlowRouter.getRouteName() == "metaFP"){
           return "selectedMeta";
       }else if (FlowRouter.getRouteName() == "deckFP"){
           return "decks";
       }else if(FlowRouter.getRouteName() == "eventsFP"){
           return "events";
       }
       return FlowRouter.getRouteName();
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