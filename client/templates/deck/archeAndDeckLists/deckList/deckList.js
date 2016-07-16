Template.deckList.helpers({
    decksName : function(){
        return _DeckNames.find({format : "modern"});
    },
    archetype : function(){
        var archetype = _deckArchetypes.findOne({deckNames : { $elemMatch: {name: this.name}}});
        if(archetype){
            return archetype.archetype;
        }else{
            return "NA";
        }
    },
    archetypeReplaceSpaceForDash : function(){
        var archetype = _deckArchetypes.findOne({deckNames : { $elemMatch: {name: this.name}}});
        if(archetype){
            return archetype.archetype.replace(/ /,"-");
        }else{
            return "NA";
        }
    }
});


Template.deckList.onRendered(function(){
    var table = $("#deckListTable").DataTable({
        pageLength : 25,
        //search : {
        //    regex : true
        //},
        dom : "<'row'<'col-xs-12't>>" +
        "<'row'<'col-xs-12'p>>"
    });
    tableColorsSearch();
    tableTypeSearch();
    tablePriceSearch();
});


