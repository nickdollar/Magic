import moment from "moment";

Template.registerHelper('arrayify',function(obj){
    var result = [];
    for (var key in obj) result.push({name:key,value:obj[key]});
    return result;
});

Template.registerHelper("getManaCss", function(value) {
    return getManaCss(value);
});

getCssManaFromDeck = function(colors){
    var str = [];
    for(var obj in colors){
             if(obj === "B" && colors[obj]){str.push('b')}
        else if(obj === "G" && colors[obj]){str.push('g')}
        else if(obj === "C" && colors[obj]){str.push('c')}
        else if(obj === "R" && colors[obj]){str.push('r')}
        else if(obj === "U" && colors[obj]){str.push('u')}
        else if(obj === "W" && colors[obj]){str.push('w')}
    }
    return str;
}


getHTMLColors = function(colors){
    var html = '<td class="tableMana">';
    for(var obj in colors){
        if(obj === "B" && colors[obj]){html += '<span class="mana mana-b"></span>'}
        else if(obj === "G" && colors[obj]){html += '<span class="mana mana-g"></span>'}
        else if(obj === "C" && colors[obj]){html += '<span class="mana mana-c"></span>'}
        else if(obj === "R" && colors[obj]){html += '<span class="mana mana-r"></span>'}
        else if(obj === "U" && colors[obj]){html += '<span class="mana mana-u"></span>'}
        else if(obj === "W" && colors[obj]){html += '<span class="mana mana-w"></span>'}
    }
    return html;
}

getCssManaByNumberFromDeckNameById = function(DecksNames_id){

    var deckName = DecksNames.findOne({_id : DecksNames_id});
    if(deckName == null) return;
    var str = [];
    for(var obj in deckName.colors){
        if(obj === "B" && deckName.colors[obj]){str.push( {mana :'b' })}
        else if(obj === "G" && deckName.colors[obj]){str.push( {mana :'g' })}
        else if(obj === "C" && deckName.colors[obj]){str.push( {mana :'c' })}
        else if(obj === "R" && deckName.colors[obj]){str.push( {mana :'r' })}
        else if(obj === "U" && deckName.colors[obj]){str.push( {mana :'u' })}
        else if(obj === "W" && deckName.colors[obj]){str.push( {mana :'w' })}
    }
    return str;
}

getHTMLColorsFromArchetypes = function(DecksArchetypes_id){
    var deckArchetype = DecksArchetypes.findOne({_id : DecksArchetypes_id});
    var colors = {B: 0, C : 0, G: 0, R: 0, U: 0, W: 0};
    if(deckArchetype.DecksNames == null) return;
    if(!deckArchetype.DecksNames.length) return;

    DecksNames.find({$or : deckArchetype.DecksNames}).forEach(function(obj){
        for(var color in obj.colors){
            colors[color] += obj.colors[color];
        }
    });

    var html = '<td class="tableMana">';
    for(var obj in colors){
        if(obj === "B" && colors[obj]){html += '<span class="mana mana-b"></span>'}
        else if(obj === "G" && colors[obj]){html += '<span class="mana mana-g"></span>'}
        else if(obj === "C" && colors[obj]){html += '<span class="mana mana-c"></span>'}
        else if(obj === "R" && colors[obj]){html += '<span class="mana mana-r"></span>'}
        else if(obj === "U" && colors[obj]){html += '<span class="mana mana-u"></span>'}
        else if(obj === "W" && colors[obj]){html += '<span class="mana mana-w"></span>'}
    }
    return html;
}

getCssColorsFromArchetypes = function(DecksArchetypes_id){
    var deckArchetype = DecksArchetypes.findOne({_id : DecksArchetypes_id});
    var colors = {B: 0, C : 0, G: 0, R: 0, U: 0, W: 0};
    if(deckArchetype.DecksNames == null) return;
    if(!deckArchetype.DecksNames.length) return;

    DecksNames.find({$or : deckArchetype.DecksNames}).forEach(function(obj){
        for(var color in obj.colors){
            colors[color] += obj.colors[color];
        }
    });

    var str = [];
    for(var obj in colors){
             if(obj === "B" && colors[obj]){str.push( {mana :'b' })}
        else if(obj === "G" && colors[obj]){str.push( {mana :'g' })}
        else if(obj === "C" && colors[obj]){str.push( {mana :'c' })}
        else if(obj === "R" && colors[obj]){str.push( {mana :'r' })}
        else if(obj === "U" && colors[obj]){str.push( {mana :'u' })}
        else if(obj === "W" && colors[obj]){str.push( {mana :'w' })}
    }
    return str;
}


getManaCss = function(value){
    var manacost = _CardDatabase.findOne({name : value}).manacost;
    var manaRegex = new RegExp("(?:B|G|R|U|W)?\/?(?:X|P|B|G|R|U|W|\\d+)(?=})", 'g');

    var str = [];
    var res;

    while((res = manaRegex.exec(manacost)) !== null) {
        if(res[0] === "X"      ) {str.push({mana :'x' }) }
        else if(res[0] === "1" ) {str.push({mana :'1' }) }
        else if(res[0] === "2" ) {str.push({mana :'2' }) }
        else if(res[0] === "3" ) {str.push({mana :'3' }) }
        else if(res[0] === "4" ) {str.push({mana :'4' }) }
        else if(res[0] === "5" ) {str.push({mana :'5' }) }
        else if(res[0] === "6" ) {str.push({mana :'6' }) }
        else if(res[0] === "7" ) {str.push({mana :'7' }) }
        else if(res[0] === "8" ) {str.push({mana :'8' }) }
        else if(res[0] === "9" ) {str.push({mana :'9' }) }
        else if(res[0] === "10") {str.push({mana :'10'}) }
        else if(res[0] === "11") {str.push({mana :'11'}) }
        else if(res[0] === "12") {str.push({mana :'12'}) }
        else if(res[0] === "13") {str.push({mana :'13'}) }
        else if(res[0] === "14") {str.push({mana :'14'}) }
        else if(res[0] === "15") {str.push({mana :'15'}) }
        else if(res[0] === "16") {str.push({mana :'16'}) }
        else if(res[0] === "17") {str.push({mana :'17'}) }
        else if(res[0] === "18") {str.push({mana :'18'}) }
        else if(res[0] === "19") {str.push({mana :'19'}) }
        else if(res[0] === "20") {str.push({mana :'20'}) }

        else if(res[0] === "B" ) {str.push({mana :'b' }) }
        else if(res[0] === "G" ) {str.push({mana :'g' }) }
        else if(res[0] === "R" ) {str.push({mana :'r' }) }
        else if(res[0] === "U" ) {str.push({mana :'u' }) }
        else if(res[0] === "W" ) {str.push({mana :'w' }) }

        else if(res[0] === "2B") {str.push({mana :'2b'}) }
        else if(res[0] === "2G") {str.push({mana :'2g'}) }
        else if(res[0] === "3R") {str.push({mana :'3r'}) }
        else if(res[0] === "2U") {str.push({mana :'2u'}) }
        else if(res[0] === "2W") {str.push({mana :'2w'}) }

        else if(res[0] === "B/P"){str.push({mana :'bp'}) }
        else if(res[0] === "G/P"){str.push({mana :'gp'}) }
        else if(res[0] === "R/P"){str.push({mana :'rp'}) }
        else if(res[0] === "U/P"){str.push({mana :'up'}) }
        else if(res[0] === "W/P"){str.push({mana :'wp'}) }

        else if(res[0] === "B/G"){str.push({mana :'bg'}) }
        else if(res[0] === "B/R"){str.push({mana :'br'}) }
        else if(res[0] === "G/U"){str.push({mana :'gu'}) }
        else if(res[0] === "G/W"){str.push({mana :'gw'}) }
        else if(res[0] === "R/G"){str.push({mana :'rg'}) }
        else if(res[0] === "R/W"){str.push({mana :'rw'}) }
        else if(res[0] === "U/B"){str.push({mana :'ub'}) }
        else if(res[0] === "U/R"){str.push({mana :'ur'}) }
        else if(res[0] === "W/B"){str.push({mana :'wb'}) }
        else if(res[0] === "W/U"){str.push({mana :'wu'}) }
    }
    return str;
}

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

Template.registerHelper("fixForLink", function() {
    var phrase = this.name ? this.name.replace(/ /g, "-") : this.archetype.replace(/ /g, "-");
    return phrase;
});

Template.registerHelper("fixForLinkArchetype", function() {
    var phrase = this.name ? this.name.replace(/ /g, "-") : this.name.replace(/ /g, "-");
    return phrase;
});

Template.registerHelper("replaceSpaceForHyphen", function() {
    var phrase = this.archetype ? this.archetype.replace(/ /g, "-") : this.archetype.replace(/ /g, "-");
    return phrase;
});

Template.registerHelper("hoursDateTimezone", function(date, timezone) {
    //return moment.tz(date, timezone).format("h:mma z");
});

Template.registerHelper("datePrettify", function(date, option) {
    return moment(date).format('MM/DD');
    //var yy = date.getFullYear().toString().substr(2,2);
    //var mm = (date.getMonth()+1).toString();
    //var dd  = date.getDate().toString();
    //if(option == "year"){
    //    return (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]) + "-" + yy;
    //}
    //
    // return (mm[1]?mm:"0"+mm[0]) + "-datetimepicker " + (dd[1]?dd:"0"+dd[0])
});

Template.registerHelper("prettifyDate", function(timestamp) {
    var dateString = (timestamp.getMonth() + 1) + '/' + timestamp.getDate() + '/' +  timestamp.getFullYear();
    return dateString;
});

Template.registerHelper("getLinkAddress", function(cardName) {
    cardName = encodeURI(cardName);
    cardName = cardName.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "%22;").replace(/'/g, "%27");
    var linkBase = "http://69.195.122.106/nicholas/mtgpics/";
    var folderLetter = cardName.charAt(0).toLocaleLowerCase();
    var finalDirectory = linkBase+folderLetter+"/"+cardName+".full.jpg";
    return finalDirectory;
});
Template.registerHelper("convertToLink", function(cardName) {
    cardName = encodeURI(cardName);
    cardName = cardName.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "%22;").replace(/'/g, "%27");
    var linkBase = "http://69.195.122.106/nicholas/crops/";
    var folderLetter = cardName.charAt(0).toLocaleLowerCase();
    var finalDirectory = linkBase+folderLetter+"/"+cardName+".crop.jpg";
    return finalDirectory;
});
Template.registerHelper("convertToTemplate", function(color) {
    var linkBase = "http://69.195.122.106/nicholas/deckTemplates";
    var finalDirectory = linkBase+"/"+color+".jpg";
    return finalDirectory;
});

Template.registerHelper('capitalizeEvents', function(){
    if(this.eventType == "ptq"){
        return "PTQ";
    } else if(this.eventType == "daily"){
        return "Daily";
    }else if(this.eventType == "league"){
        return "League";
    }
});

Template.registerHelper('deckPosition', function(){
    if(this.eventType == "ptq"){
        var s=["th","st","nd","rd"],
            v=this.position%100;
        return this.position+(s[(v-20)%10]||s[v]||s[0]);
    } else if(this.eventType == "daily"){
        return this.victory + "-" + this.loss;
    }

});

Template.registerHelper('initial', function(string){
    return string.charAt(0).toUpperCase();
});


Template.registerHelper('upperCase', function(string){
    return string.toUpperCase();
});

Template.registerHelper('prettifyPercentage', function(string){
    return prettifyPercentage(string);
});

prettifyPercentage = function(string){
    var temp = parseFloat(string) * Math.pow(10, 2);
    temp = parseFloat(temp.toFixed(2));
    return temp;
};

Template.registerHelper('absoluteValue', function(string){
    return prettifyPercentage(string);
});

Template.registerHelper('toFixed', function(string){
   return parseFloat(string).toFixed(2);
});


absoluteValue = function(string){
    return Math.abs(parseFloat(string));
}