SV_metaSelectedFormat = "selectedFormat";
Session.set(SV_metaSelectedFormat, "");

SV_metaDaily3_1 = "metaDaily3_1";
Session.set(SV_metaDaily3_1, true);

SV_metaDaily4_0 = "metaDaily4_0";
Session.set(SV_metaDaily4_0, true);

SV_metaPtqTop8 = "metaPtqTop8";
Session.set(SV_metaPtqTop8, true);

SV_metaPtqTop9_16 = "metaPtqTop9_16";
Session.set(SV_metaPtqTop9_16, true);
SV_metaPtqTop17_32 = "SV_metaPtqTop17_32";
Session.set(SV_metaPtqTop17_32, true);


Template.metaBase.helpers({
    metas : function(){
        var metas = ['standard', 'modern', 'legacy', 'vintage'];
        return metas;
    },
    values : function(){
        var metas = ['standard', 'modern', 'legacy', 'vintage'];
        return metas;
    }


});

Template.tileFormat.helpers({
    meta : function(format){
        var deckNames = _DeckNames.find({format : format}).map(function(deckName){ return deckName.name});
        var date = getWeekStartAndEnd();
        var weekStart = new Date(date.weekStart);
        var weekEnd = new Date(date.weekEnd);

        var metaValues = _MetaValues.find({format: format}, {sort: {date: -1}}).fetch();
        var weeksTotal = [];
        var total = 0;

        for(var i = 0; i < metaValues.length; i++) {
                total += metaValues[i].type.daily3_1.deckTotal;
                total += metaValues[i].type.daily4_0.deckTotal;
                total += metaValues[i].type.ptqTop8.deckTotal;
                total += metaValues[i].type.ptqTop9_16.deckTotal;
                total += metaValues[i].type.ptqTop17_32.deckTotal;
                weeksTotal.push(total);
        }

        var results = [];
        var totalPercent = 0;
        for(var i = 0; i < deckNames.length; i++){
            var quantity = 0;
            var bars = [];
            for(var j = 0; j < metaValues.length; j++) {
                    quantity += metaValues[j].type.daily3_1.decks[deckNames[i]];
                    quantity += metaValues[j].type.daily4_0.decks[deckNames[i]];
                    quantity += metaValues[j].type.ptqTop8.decks[deckNames[i]];
                    quantity += metaValues[j].type.ptqTop9_16.decks[deckNames[i]];
                    quantity += metaValues[j].type.ptqTop17_32.decks[deckNames[i]];
                    bars.push(prettifyPercentage((quantity/weeksTotal[j]), 2));
            }

            totalPercent += parseFloat(prettifyPercentage((quantity/total), 2));

            bars = bars.slice(bars.length-6,bars.length);
            var barColors = [];


            for(var k = 0; k < bars.length -1; k++){
                if(bars[k] > bars[k+1]){
                    barColors.push("red");
                }else if(bars[k] < bars[k+1]){
                    barColors.push("green");
                }else{
                    barColors.push("gray");
                }
            }
            results.push({name : deckNames[i], percent : parseFloat(prettifyPercentage((quantity/total), 2)), quantity : quantity, bars : barColors });
        }

        weekStart.setDate(weekStart.getDate() - 7);
        weekEnd.setDate(weekEnd.getDate() - 7);

        results.sort(function(a, b){return b.percent - a.percent});
        return results;
    }
});


Template.newMetaTable_COL.helpers({
   meta : function(){
        var deckNames = _DeckNames.find({format : "modern"}).map(function(deckName){ return deckName.name});
        var date = getWeekStartAndEnd();
        var weekStart = new Date(date.weekStart);
        var weekEnd = new Date(date.weekEnd);

        var metaValues = _MetaValues.find({format: "modern"}, {sort: {date: -1}}).fetch();
        var weeksTotal = [];
        var total = 0;

       for(var i = 0; i < metaValues.length; i++) {
            if (Session.get(SV_metaDaily3_1) == true) {
                total += metaValues[i].type.daily3_1.deckTotal;
            }
            if (Session.get(SV_metaDaily4_0) == true) {
                total += metaValues[i].type.daily4_0.deckTotal;
            }
            if (Session.get(SV_metaPtqTop8) == true) {
                total += metaValues[i].type.ptqTop8.deckTotal;
            }
            if (Session.get(SV_metaPtqTop9_16) == true) {
                total += metaValues[i].type.ptqTop9_16.deckTotal;
            }
            if (Session.get(SV_metaPtqTop17_32) == true) {
                total += metaValues[i].type.ptqTop17_32.deckTotal;
            }
            weeksTotal.push(total);
        }

        var results = [];
        var totalPercent = 0;
        for(var i = 0; i < deckNames.length; i++){
            var quantity = 0;
            var bars = [];
            for(var j = 0; j < metaValues.length; j++) {
                if (Session.get(SV_metaDaily3_1) == true) {
                    quantity += metaValues[j].type.daily3_1.decks[deckNames[i]];
                }
                if (Session.get(SV_metaDaily4_0) == true) {
                    quantity += metaValues[j].type.daily4_0.decks[deckNames[i]];
                }
                if (Session.get(SV_metaPtqTop8) == true) {
                    quantity += metaValues[j].type.ptqTop8.decks[deckNames[i]];
                }
                if (Session.get(SV_metaPtqTop9_16) == true) {
                    quantity += metaValues[j].type.ptqTop9_16.decks[deckNames[i]];
                }
                if (Session.get(SV_metaPtqTop17_32) == true) {
                    quantity += metaValues[j].type.ptqTop17_32.decks[deckNames[i]];
                }
                bars.push(prettifyPercentage((quantity/weeksTotal[j]), 2));
            }

            totalPercent += parseFloat(prettifyPercentage((quantity/total), 2));

            bars = bars.slice(bars.length-6,bars.length);
            var barColors = [];


            for(var k = 0; k < bars.length -1; k++){
                if(bars[k] > bars[k+1]){
                    barColors.push("red");
                }else if(bars[k] < bars[k+1]){
                    barColors.push("green");
                }else{
                    barColors.push("gray");
                }
            }
            results.push({name : deckNames[i], percent : parseFloat(prettifyPercentage((quantity/total), 2)), quantity : quantity, bars : barColors });
        }

            weekStart.setDate(weekStart.getDate() - 7);
            weekEnd.setDate(weekEnd.getDate() - 7);

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

        if(event.target.value == "ptqTop8"){
            Session.set(SV_metaPtqTop8, event.target.checked);
        }

        if(event.target.value == "ptqTop9_16"){
            Session.set(SV_metaPtqTop9_16, event.target.checked);
        }

        if(event.target.value == "ptqTop17_32"){
            Session.set(SV_metaPtqTop17_32, event.target.checked);
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



