Template.cardMetaBox.helpers({
    cardsMetaChange : function() {
        return _simplifiedTables.findOne({format : "modern"}).cards;
    }
});