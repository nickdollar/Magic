SV_metaSelectedFormat = "selectedFormat";
Session.set(SV_metaSelectedFormat, "");

SV_metaDaily3_1 = "daily3_1";
Session.set(SV_metaDaily3_1, true);

SV_metaDaily4_0 = "daily4_0";
Session.set(SV_metaDaily4_0, true);

Template.newMetaTable_COL.helpers({
   meta : function(){
        var deckNames = _DeckNames.find({format : "modern"}).map(function(deckName){ return deckName.name});
        var metaValues = _MetaValues.findOne({format : "modern"}, {sort : {date : -1}});
        var results = [];

        var total = 0;
        if(Session.get(SV_metaDaily3_1) == true){
            total += metaValues.type.daily3_1.deckTotal;
        }

        if(Session.get(SV_metaDaily4_0) == true){
            total += metaValues.type.daily4_0.deckTotal;
        }
       var results = [];
       for(var i = 0; i < deckNames.length; i++){
            var quantity = 0;
            if(Session.get(SV_metaDaily3_1) == true){
                quantity += metaValues.type.daily3_1.decks[deckNames[i]];
            }

            if(Session.get(SV_metaDaily4_0) == true){
                quantity += metaValues.type.daily4_0.decks[deckNames[i]];
            }
            results.push({name : deckNames[i], percent : prettifyDecimails((quantity/total), 2)});
        }
       results.sort(function(a, b){return b.percent - a.percent});

       return results;
   },
    colors : function(name){
        var colors = _DeckNames.findOne({name : name}).colors;
        return colors;
    },
    type : function(name){
        return _DeckNames.findOne({name : name}).type;
    },
    format : function(){
        return Session.get(SV_metaSelectedFormat);
    },
    checked : function(){
        return "checked";
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

Template.newMetaTable_COL.events({
   'click .updateMeta' : function(evt, tmp){
        Meteor.call('updateMetaMethod');
   },
    'change .checkbox-inline input' : function(evt, tmp){
        if(event.target.value == "daily3_1"){
            Session.set(SV_metaDaily3_1, event.target.checked);
        }

        if(event.target.value == "daily4_0"){
            Session.set(SV_metaDaily4_0, event.target.checked);
        }
    }
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



