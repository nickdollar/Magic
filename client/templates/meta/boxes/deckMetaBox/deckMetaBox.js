Template.deckMetaBox.helpers({
    meta : function(){
        return _simplifiedTables.findOne({format : this.format}).decks;
    },
    colors : function(name){
        var colors = _DeckNames.findOne({name : name}).colors;
        return colors;
    },
    type : function(name){
        return _DeckNames.findOne({name : name}).type;
    },
    format : function(){
        return Session.get(SV_metaEventsFormat);
    },
    checked : function(){
        return "checked";
    },
    position1 : function(upDown) {
        if(upDown == "neutral") {
            return true;
        }else{
            return false;
        }
    },
    position2 : function(upDown) {
        if (upDown == "up") {
            return true;
        }else{
            return false;
        }
    },
    pagination : function()
    {

    },
    previousDisabled : function(){
        if(Session.get(SV_metaDeckListPagination) == 0){
            return "disabled";
        }else{
            return "";
        }
    },
    nextDisabled : function(){
        if(Session.get(SV_metaDeckListPagination) + 40 > Counts.get('decknamesCounter')){
            return "disabled";
        }else{
            return "";
        }
    }
});


Template.deckMetaBox.onRendered(function(){

});