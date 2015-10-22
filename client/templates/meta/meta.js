Template.newMetaTable_COL.helpers({
   meta : function(){
       var _MetaDateID = _MetaDate.findOne({},{sort : {date : 1}})._id;
       return _MetaValues.find({_MetaDateID : _MetaDateID}, {sort : {percent : -1}});
   },
    colors : function(name){
        var colors = _DeckNames.findOne({name : name}).colors;
        return colors;
    },
    type : function(name){
        return _DeckNames.findOne({name : name}).type;
    }
});

Template.newMetaTable_COL.onCreated(function(){
    var instance = this;
    this.autorun(function(){
        instance.subscribe('metaDate');
        instance.subscribe('metaValues');
        instance.subscribe('decknames');
        instance.subscribe('event');
    });
});

Handlebars.registerHelper("math", function(lvalue, operator, rvalue, options) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);

    return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
    }[operator];
});

Template.eventsTable_COL.helpers({
    event : function(){
        return _Event.find({format : "modern"}, {sort : {date : -1}});
    }
});



