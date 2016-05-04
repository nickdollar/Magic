Template.archetypesList.helpers({
    archetypesName : function(){
        return _deckArchetypes.find({format : Router.current().params.format, deckNames : { $ne : []}});
    },
    archetypeLinkFix : function(){
        return this.archetype.replace(/ /g, "-");
    },
    deckName : function(){
        return this.deckNames[0].name.replace(/ /g,"-");
    }
});

