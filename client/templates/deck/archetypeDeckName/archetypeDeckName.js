Template.archetypeDeckName.helpers({
    thisarchetype : function(){
        return _deckArchetypes.findOne({archetype : Router.current().params.archetype.replace("-", " ")});
    },
    name : function(){
        return Router.current().params.archetype.replace("-", " ");
    },
    colors : function(){
        console.log(_deckArchetypes.findOne({archetype : Router.current().params.archetype.replace("-", " ")}).colors);

        return _deckArchetypes.findOne({archetype : Router.current().params.archetype.replace("-", " ")}).colors;
    }

});

