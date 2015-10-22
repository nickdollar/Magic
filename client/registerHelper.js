
Template.registerHelper("getManaCss", function(manacost) {
    //var manaRegex = new RegExp("\{([a-zA-Z]+)\}", 'g');
    var manaRegex = new RegExp("[a-zA-Z]", 'g');
    var str = [];
    var res;


    while((res = manaRegex.exec( manacost)) !== null) {
        console.log(res);
        if(res[0] === "X"      ) {str.push(  { mana :'mana-x' }) }
        else if(res[0] === "1" ) {str.push(  {mana :'mana-1' }) }
        else if(res[0] === "2" ) {str.push(  {mana :'mana-2' }) }
        else if(res[0] === "3" ) {str.push(  {mana :'mana-3' }) }
        else if(res[0] === "4" ) {str.push(  {mana :'mana-4' }) }
        else if(res[0] === "5" ) {str.push(  {mana :'mana-5' }) }
        else if(res[0] === "6" ) {str.push(  {mana :'mana-6' }) }
        else if(res[0] === "7" ) {str.push(  {mana :'mana-7' }) }
        else if(res[0] === "8" ) {str.push(  {mana :'mana-8' }) }
        else if(res[0] === "9" ) {str.push(  {mana :'mana-9' }) }
        else if(res[0] === "10") {str.push(  {mana :'mana-10'}) }
        else if(res[0] === "11") {str.push(  {mana :'mana-11'}) }
        else if(res[0] === "12") {str.push(  {mana :'mana-12'}) }
        else if(res[0] === "13") {str.push(  {mana :'mana-13'}) }
        else if(res[0] === "14") {str.push(  {mana :'mana-14'}) }
        else if(res[0] === "15") {str.push(  {mana :'mana-15'}) }
        else if(res[0] === "16") {str.push(  {mana :'mana-16'}) }
        else if(res[0] === "17") {str.push(  {mana :'mana-17'}) }
        else if(res[0] === "18") {str.push(  {mana :'mana-18'}) }
        else if(res[0] === "19") {str.push(  {mana :'mana-19'}) }
        else if(res[0] === "20") {str.push(  {mana :'mana-20'}) }
        else if(res[0] === "B" ) {str.push(  {mana :'mana-b' }) }
        else if(res[0] === "G" ) {str.push(  {mana :'mana-g' }) }
        else if(res[0] === "R" ) {str.push(  {mana :'mana-r' }) }
        else if(res[0] === "U" ) {str.push(  {mana :'mana-u' }) }
        else if(res[0] === "W" ) {str.push(  {mana :'mana-w' }) }
        else if(res[0] === "2B") {str.push(  {mana :'mana-2b'}) }
        else if(res[0] === "2G") {str.push(  {mana :'mana-2g'}) }
        else if(res[0] === "3R") {str.push(  {mana :'mana-3r'}) }
        else if(res[0] === "2U") {str.push(  {mana :'mana-2u'}) }
        else if(res[0] === "2W") {str.push(  {mana :'mana-2w'}) }
        else if(res[0] === "B/P"){str.push( {mana :'mana-bp'}) }
        else if(res[0] === "G/P"){str.push( {mana :'mana-gp'}) }
        else if(res[0] === "R/P"){str.push( {mana :'mana-rp'}) }
        else if(res[0] === "U/P"){str.push( {mana :'mana-up'}) }
        else if(res[0] === "W/P"){str.push( {mana :'mana-wp'}) }
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

Template.registerHelper("math", function(lvalue, operator, rvalue, options) {
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


Template.registerHelper("datePretify", function(date) {

    var yyyy = date.getFullYear().toString();
    var mm = (date.getMonth()+1).toString();
    var dd  = date.getDate().toString();
    return (mm[1]?mm:"0"+mm[0]) +"-"+ (dd[1]?dd:"0"+dd[0]) + "-" + yyyy ;
});