
Template.registerHelper("getManaCss", function(value, options) {
    var manacost = "";
    //console.log(manacost);
    var manaRegex = new RegExp("\{([a-zA-Z0-9]+)\}", 'g');
    if(options == "deck"){
        manaRegex = new RegExp("([a-zA-Z])", 'g');
        manacost = value;
    }else{
        manacost = _CardDatabase.findOne({name : value}).manacost;
    }

    var str = [];
    var res;

    while((res = manaRegex.exec( manacost)) !== null) {
        if(res[1] === "X"      ) {str.push(  { mana :'mana-x' }) }
        else if(res[1] === "1" ) {str.push(  {mana :'mana-1' }) }
        else if(res[1] === "2" ) {str.push(  {mana :'mana-2' }) }
        else if(res[1] === "3" ) {str.push(  {mana :'mana-3' }) }
        else if(res[1] === "4" ) {str.push(  {mana :'mana-4' }) }
        else if(res[1] === "5" ) {str.push(  {mana :'mana-5' }) }
        else if(res[1] === "6" ) {str.push(  {mana :'mana-6' }) }
        else if(res[1] === "7" ) {str.push(  {mana :'mana-7' }) }
        else if(res[1] === "8" ) {str.push(  {mana :'mana-8' }) }
        else if(res[1] === "9" ) {str.push(  {mana :'mana-9' }) }
        else if(res[1] === "10") {str.push(  {mana :'mana-10'}) }
        else if(res[1] === "11") {str.push(  {mana :'mana-11'}) }
        else if(res[1] === "12") {str.push(  {mana :'mana-12'}) }
        else if(res[1] === "13") {str.push(  {mana :'mana-13'}) }
        else if(res[1] === "14") {str.push(  {mana :'mana-14'}) }
        else if(res[1] === "15") {str.push(  {mana :'mana-15'}) }
        else if(res[1] === "16") {str.push(  {mana :'mana-16'}) }
        else if(res[1] === "17") {str.push(  {mana :'mana-17'}) }
        else if(res[1] === "18") {str.push(  {mana :'mana-18'}) }
        else if(res[1] === "19") {str.push(  {mana :'mana-19'}) }
        else if(res[1] === "20") {str.push(  {mana :'mana-20'}) }
        else if(res[1] === "B" ) {str.push(  {mana :'mana-b' }) }
        else if(res[1] === "G" ) {str.push(  {mana :'mana-g' }) }
        else if(res[1] === "R" ) {str.push(  {mana :'mana-r' }) }
        else if(res[1] === "U" ) {str.push(  {mana :'mana-u' }) }
        else if(res[1] === "W" ) {str.push(  {mana :'mana-w' }) }
        else if(res[1] === "2B") {str.push(  {mana :'mana-2b'}) }
        else if(res[1] === "2G") {str.push(  {mana :'mana-2g'}) }
        else if(res[1] === "3R") {str.push(  {mana :'mana-3r'}) }
        else if(res[1] === "2U") {str.push(  {mana :'mana-2u'}) }
        else if(res[1] === "2W") {str.push(  {mana :'mana-2w'}) }
        else if(res[1] === "B/P"){str.push( {mana :'mana-bp'}) }
        else if(res[1] === "G/P"){str.push( {mana :'mana-gp'}) }
        else if(res[1] === "R/P"){str.push( {mana :'mana-rp'}) }
        else if(res[1] === "U/P"){str.push( {mana :'mana-up'}) }
        else if(res[1] === "W/P"){str.push( {mana :'mana-wp'}) }
    }
    return str;
});

Template.registerHelper("getManaCssParentheses", function(manacost) {

    var manaRegex = new RegExp("\{([^}]+)\}", 'g');
    var str = [];
    var res;

    while((res = manaRegex.exec(manacost)) !== null) {
        if(res[0] === "X"      ) {str.push({mana :'mana-x' }) }
        else if(res[0] === "1" ) {str.push({mana :'mana-1' }) }
        else if(res[0] === "2" ) {str.push({mana :'mana-2' }) }
        else if(res[0] === "3" ) {str.push({mana :'mana-3' }) }
        else if(res[0] === "4" ) {str.push({mana :'mana-4' }) }
        else if(res[0] === "5" ) {str.push({mana :'mana-5' }) }
        else if(res[0] === "6" ) {str.push({mana :'mana-6' }) }
        else if(res[0] === "7" ) {str.push({mana :'mana-7' }) }
        else if(res[0] === "8" ) {str.push({mana :'mana-8' }) }
        else if(res[0] === "9" ) {str.push({mana :'mana-9' }) }
        else if(res[0] === "10") {str.push({mana :'mana-10'}) }
        else if(res[0] === "11") {str.push({mana :'mana-11'}) }
        else if(res[0] === "12") {str.push({mana :'mana-12'}) }
        else if(res[0] === "13") {str.push({mana :'mana-13'}) }
        else if(res[0] === "14") {str.push({mana :'mana-14'}) }
        else if(res[0] === "15") {str.push({mana :'mana-15'}) }
        else if(res[0] === "16") {str.push({mana :'mana-16'}) }
        else if(res[0] === "17") {str.push({mana :'mana-17'}) }
        else if(res[0] === "18") {str.push({mana :'mana-18'}) }
        else if(res[0] === "19") {str.push({mana :'mana-19'}) }
        else if(res[0] === "20") {str.push({mana :'mana-20'}) }
        else if(res[0] === "B" ) {str.push({mana :'mana-b' }) }
        else if(res[0] === "G" ) {str.push({mana :'mana-g' }) }
        else if(res[0] === "R" ) {str.push({mana :'mana-r' }) }
        else if(res[0] === "U" ) {str.push({mana :'mana-u' }) }
        else if(res[0] === "W" ) {str.push({mana :'mana-w' }) }
        else if(res[0] === "2B") {str.push({mana :'mana-2b'}) }
        else if(res[0] === "2G") {str.push({mana :'mana-2g'}) }
        else if(res[0] === "3R") {str.push({mana :'mana-3r'}) }
        else if(res[0] === "2U") {str.push({mana :'mana-2u'}) }
        else if(res[0] === "2W") {str.push({mana :'mana-2w'}) }
        else if(res[0] === "B/P"){str.push({mana :'mana-bp'}) }
        else if(res[0] === "G/P"){str.push({mana :'mana-gp'}) }
        else if(res[0] === "R/P"){str.push({mana :'mana-rp'}) }
        else if(res[0] === "U/P"){str.push({mana :'mana-up'}) }
        else if(res[0] === "W/P"){str.push({mana :'mana-wp'}) }
    }
    return str;
});

Handlebars.registerHelper("tableIndex", function(index, options) {

    if(options == "decksNames"){
       return (Session.get(SV_metaDeckListPagination) + index + 1);
    }

    if(options == "cardsTable"){
       return Session.get(SV_metaCardListPagination) + index + 1;
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

Template.registerHelper("fixForLink", function() {

    //var phrase = this.name.replace(/ /, "-");

    var phrase = this.name ? this.name.replace(/ /g, "-") : this.archetype.replace(/ /g, "-");

    return phrase;
});

Template.registerHelper("datePretify", function(date) {

    var yyyy = date.getFullYear().toString();
    var mm = (date.getMonth()+1).toString();
    var dd  = date.getDate().toString();
    return (mm[1]?mm:"0"+mm[0]) +"-"+ (dd[1]?dd:"0"+dd[0]) + "-" + yyyy ;
});

Template.registerHelper("prettifyDate", function(timestamp) {
    return new Date(timestamp).toString('yyyy-MM-dd')
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
