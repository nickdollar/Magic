import moment from "moment";

Template.registerHelper('arrayify',function(obj){
    var result = [];
    for (var key in obj) result.push({name:key,value:obj[key]});
    return result;
});

Template.registerHelper("getManaCss", function(value) {
    return getManaCss(value);
});


Template.registerHelper("getCssManaFromDeck", function(colors) {
    return getCssManaFromDeck(colors);
});

getCssManaFromDeck = function(colors){
    var manaInitials = [];
    for(var obj in colors){
             if(obj === "B" && colors[obj]){manaInitials.push('sb')}
        else if(obj === "G" && colors[obj]){manaInitials.push('sg')}
        else if(obj === "C" && colors[obj]){manaInitials.push('scl')}
        else if(obj === "R" && colors[obj]){manaInitials.push('sr')}
        else if(obj === "U" && colors[obj]){manaInitials.push('su')}
        else if(obj === "W" && colors[obj]){manaInitials.push('sw')}
    }
    return manaInitials;
}


getHTMLColors = function(colors, size){
    if(!size ){
        size = "14px";
    } else{
        size = size +"px"
    }
    var html = '<span class="tableMana" style="font-size: '+size +'">';
    for(var obj in colors){
        if(obj === "B" && colors[obj]){html +=      '<span class="mana sb"></span>'}
        else if(obj === "G" && colors[obj]){html += '<span class="mana sg"></span>'}
        else if(obj === "C" && colors[obj]){html += '<span class="mana scl"></span>'}
        else if(obj === "R" && colors[obj]){html += '<span class="mana sr"></span>'}
        else if(obj === "U" && colors[obj]){html += '<span class="mana su"></span>'}
        else if(obj === "W" && colors[obj]){html += '<span class="mana sw"></span>'}
    }
    html += '</span>';
    return html;
}

getCssManaByNumberFromDeckNameById = function(DecksNames_id){

    var deckName = DecksNames.findOne({_id : DecksNames_id});
    if(deckName == null) return;
    var str = [];
    for(var obj in deckName.colors){
        if(obj === "B" && deckName.colors[obj]){str.push( {mana :'sb' })}
        else if(obj === "G" && deckName.colors[obj]){str.push( {mana :'sg' })}
        else if(obj === "C" && deckName.colors[obj]){str.push( {mana :'scl' })}
        else if(obj === "R" && deckName.colors[obj]){str.push( {mana :'sr' })}
        else if(obj === "U" && deckName.colors[obj]){str.push( {mana :'su' })}
        else if(obj === "W" && deckName.colors[obj]){str.push( {mana :'sw' })}
    }
    return str;
}

getHTMLColorsFromArchetypes = function(DecksArchetypes_id){

    var colors = {B : "sb", C : "scl", G : "sg", R : "sr", U : "su", W : "sw"};
    var decksNames = DecksNames.find({DecksArchetypes_id : DecksArchetypes_id}).fetch();
    var colorsArray = [];
    for(var i = 0; i < decksNames.length; ++i){
        if(!decksNames[i].colors){
            continue;
        }
        colorsArray = _.union(colorsArray, decksNames[i].colors);
    }
    var html = "";
    colorsArray.forEach((color)=>{
        html += `<span class="mana ${colors[color]}"></span>`
    })
    return html;
}

getCssColorsFromArchetypes = function(DecksArchetypes_id){
    var colors = {B: 0, C : 0, G: 0, R: 0, U: 0, W: 0};

    DecksNames.find({DecksArchetypes_id : DecksArchetypes_id}).forEach(function(obj){
        for(var color in obj.colors){
            colors[color] += obj.colors[color];
        }
    });

    var str = [];
    for(var obj in colors){
             if(obj === "B" && colors[obj]){str.push( {mana :'sb' })}
        else if(obj === "G" && colors[obj]){str.push( {mana :'sg' })}
        else if(obj === "C" && colors[obj]){str.push( {mana :'scl' })}
        else if(obj === "R" && colors[obj]){str.push( {mana :'sr' })}
        else if(obj === "U" && colors[obj]){str.push( {mana :'su' })}
        else if(obj === "W" && colors[obj]){str.push( {mana :'sw' })}
    }
    return str;
}

getColorsFromArchetypes = function(DecksArchetypes_id){
    var decksNames = DecksNames.find({DecksArchetypes_id : DecksArchetypes_id}).fetch();
    var colorsArray = [];
    for(var i = 0; i < decksNames.length; ++i){
        if(!decksNames[i].colors){
            continue;
        }
        colorsArray = _.union(colorsArray, decksNames[i].colors);
    }
    return colorsArray.join("");
}

getManaCss = function(value){
    var manacost = CardsData.findOne({name : value}).manacost;
    var manaRegex = new RegExp("(?:B|C|G|R|U|W)?\/?(?:X|P|B|C|G|R|U|W|\\d+)(?=})", 'g');

    var str = [];
    var res;

    while((res = manaRegex.exec(manacost)) !== null) {
        if(res[0] === "X"      ) {str.push({mana :'sx' }) }
        else if(res[0] === "1" ) {str.push({mana :'s1' }) }
        else if(res[0] === "2" ) {str.push({mana :'s2' }) }
        else if(res[0] === "3" ) {str.push({mana :'s3' }) }
        else if(res[0] === "4" ) {str.push({mana :'s4' }) }
        else if(res[0] === "5" ) {str.push({mana :'s5' }) }
        else if(res[0] === "6" ) {str.push({mana :'s6' }) }
        else if(res[0] === "7" ) {str.push({mana :'s7' }) }
        else if(res[0] === "8" ) {str.push({mana :'s8' }) }
        else if(res[0] === "9" ) {str.push({mana :'s9' }) }
        else if(res[0] === "10") {str.push({mana :'s10'}) }
        else if(res[0] === "11") {str.push({mana :'s11'}) }
        else if(res[0] === "12") {str.push({mana :'s12'}) }
        else if(res[0] === "13") {str.push({mana :'s13'}) }
        else if(res[0] === "14") {str.push({mana :'s14'}) }
        else if(res[0] === "15") {str.push({mana :'s15'}) }
        else if(res[0] === "16") {str.push({mana :'s16'}) }
        else if(res[0] === "17") {str.push({mana :'s17'}) }
        else if(res[0] === "18") {str.push({mana :'s18'}) }
        else if(res[0] === "19") {str.push({mana :'s19'}) }
        else if(res[0] === "20") {str.push({mana :'s20'}) }

        else if(res[0] === "B" ) {str.push({mana :'sb' }) }
        else if(res[0] === "C" ) {str.push({mana :'scl'}) }
        else if(res[0] === "G" ) {str.push({mana :'sg' }) }
        else if(res[0] === "R" ) {str.push({mana :'sr' }) }
        else if(res[0] === "U" ) {str.push({mana :'su' }) }
        else if(res[0] === "W" ) {str.push({mana :'sw' }) }

        else if(res[0] === "2B") {str.push({mana :'s2b'}) }
        else if(res[0] === "2G") {str.push({mana :'s2g'}) }
        else if(res[0] === "3R") {str.push({mana :'s3r'}) }
        else if(res[0] === "2U") {str.push({mana :'s2u'}) }
        else if(res[0] === "2W") {str.push({mana :'s2w'}) }

        else if(res[0] === "B/P"){str.push({mana :'sbp'}) }
        else if(res[0] === "G/P"){str.push({mana :'sgp'}) }
        else if(res[0] === "R/P"){str.push({mana :'srp'}) }
        else if(res[0] === "U/P"){str.push({mana :'sup'}) }
        else if(res[0] === "W/P"){str.push({mana :'swp'}) }

        else if(res[0] === "B/G"){str.push({mana :'sbg'}) }
        else if(res[0] === "B/R"){str.push({mana :'sbr'}) }
        else if(res[0] === "G/U"){str.push({mana :'sgu'}) }
        else if(res[0] === "G/W"){str.push({mana :'sgw'}) }
        else if(res[0] === "R/G"){str.push({mana :'srg'}) }
        else if(res[0] === "R/W"){str.push({mana :'srw'}) }
        else if(res[0] === "U/B"){str.push({mana :'sub'}) }
        else if(res[0] === "U/R"){str.push({mana :'sur'}) }
        else if(res[0] === "W/B"){str.push({mana :'swb'}) }
        else if(res[0] === "W/U"){str.push({mana :'swu'}) }
    }
    return str;
}

getDistanceBetweenTwoCoords = (coords1, coords2)=>{

    var R = 3959; // miles
    var φ1 = coords1.latitude.toRad();
    var φ2 = coords2.latitude.toRad();
    var Δφ = (coords2.latitude-coords1.latitude).toRad();
    var Δλ = (coords2.longitude-coords1.longitude).toRad();

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;
    return d;
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
    var phrase = this.name ? replaceTokenWithDash(this.name) : replaceTokenWithDash(this.archetype);
    return phrase;
});

Template.registerHelper("fixForLinkArchetype", function() {
    var phrase = this.name ? replaceTokenWithDash(this.name) : replaceTokenWithDash(this.name);
    return phrase;
});

Template.registerHelper("replaceSpaceForHyphen", function() {
    var phrase = this.archetype ? replaceTokenWithDash(this.archetype) : replaceTokenWithDash(this.archetype);
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

Template.registerHelper("MathRound", function(number) {
    return Math.round(number);
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
    if(this.type == "ptq"){
        return "PTQ";
    } else if(this.type == "daily"){
        return "Daily";
    }else if(this.type == "league"){
        return "League";
    }
});

Template.registerHelper('deckPosition', function(){
    if(this.position){
        var s=["th","st","nd","rd"],
            v=this.position%100;
        return this.position+(s[(v-20)%10]||s[v]||s[0]);
    } else{
        return this.victory + "-" + this.loss;
    }

});

prettifyPosition = (position)=>{
    position = parseInt(position);
    var s=["th","st","nd","rd"],
        v=position%100;
    return position+(s[(v-20)%10]||s[v]||s[0]);
}


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

replaceTokenWithDash = function(string){
    return string.replace(/[ &']/g, "-");
}

replaceDashWithDotForRegex = function(string){
    return string.replace(/[-']/g, ".");
}