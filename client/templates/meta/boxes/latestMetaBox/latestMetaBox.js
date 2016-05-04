Template.lastestMetaBox.helpers({
    newDecks : function(){
        return _simplifiedTables.findOne({format : "modern"}).newDecks;
    },
    newCards : function(){
        return _simplifiedTables.findOne({format : "modern"}).newCards;
    },
    mana : function(){

    }
});


Template.lastestMetaBox.onRendered(function(){

});