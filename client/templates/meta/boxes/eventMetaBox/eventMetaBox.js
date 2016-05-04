Template.eventMetaBox.helpers({
    eventMetaChange : function() {
        return _simplifiedTables.findOne({format : "modern"}).events;
    }
});
