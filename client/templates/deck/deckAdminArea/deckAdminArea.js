Template.deckAdminArea.helpers({
    archetypesOptions : function() {
        return _deckArchetypes.find({});
    },
    selected : function()
    {
        if(this.archetype == Router.current().params.archetype.replace(/-/," ")){
            return "selected";
        }
        return "";
    }
});

Template.deckAdminArea.events({
    "click .updateArchetype" : function(evt, tmp){
        var archetype = $(tmp.find('.custom-combobox-input')).val();
        var deckName = Router.current().params.deckSelected.replace(/-/g," ");
        var format = Router.current().params.format;
        if(archetype != ""){
            Meteor.call("addAArchetypeAndNameToArchetype", deckName, archetype, format);
        }
    },
    'click .getDeckPercentage' : function(){
        Meteor.call('cardsPercentage', Router.current().params.format, Router.current().params.deckSelected.replace(/-/g," "));
    },
    'click .removeArchetype' : function(evt, tmp){
        Meteor.call('removeArchetype', Router.current().params.archetype);
    }
});

Template.deckAdminArea.onRendered(function(){
    $('.combobox').combobox();
});
