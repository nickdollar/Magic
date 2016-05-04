Template.deckList.helpers({
    decksName : function(){
        return _DeckNames.find({format : "modern"});
    },
    archetype : function(){
        var archetype = _deckArchetypes.findOne({deckNames : { $elemMatch: {name: this.name}}});
        if(archetype){
            return archetype.archetype.replace(/ /,"-");
        }else{
            return "NA";
        }
    }
});

