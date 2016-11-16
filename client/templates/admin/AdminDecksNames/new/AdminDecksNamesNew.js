Template.AdminDecksNamesNew.onCreated(function(){

});

Template.AdminDecksNamesNew.helpers({
    DecksNamesSchema : function(){
        return Schemas.DecksNames;
    },
    DecksArchetypesSchema : function(){
        return Schemas.DecksArchetypes;
    },
    currentFieldValue : function(){
        return AutoForm.getFieldValue("format", "adminNewsDeckNames");
    }
});

Template.AdminDecksNamesNew.onRendered(function(){

});

