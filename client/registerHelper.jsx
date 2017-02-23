import React from 'react' ;

getHTMLColorsFromArchetypesReact = function(DecksArchetypes_id){
    var colors = {B : "sb", C : "scl", G : "sg", R : "sr", U : "su", W : "sw"};
    var decksNames = DecksNames.find({DecksArchetypes_id : DecksArchetypes_id}).fetch();
    var colorsArray = [];
    for(var i = 0; i < decksNames.length; ++i){
        if(!decksNames[i].colors){
            continue;
        }
        colorsArray = _.union(colorsArray, decksNames[i].colors);
    }
    return  <div>
                {colorsArray.map((color)=>{
                    return <span key={color} className={`mana ${colors[color]}`}></span>
                })}
            </div>
}


getHTMLColorsFromDecksNamesReact = function(DecksNames_id){
    var colorsValues = [{B : "sb"}, {C : "scl"}, {G : "sg"}, {R : "sr"}, {U : "su"}, {W : "sw"}];
    var deckName = DecksNames.findOne({_id : DecksNames_id});
    return <div>
        {deckName.colors.map((color)=>{
            return <span className={`mana ${colorsValues[color]}`}></span>
        })}
    </div>
}

getHTMLColorsFromColorArray = function(colors){
    if(!colors) return "missing";
    var colorsValues = {
        B : "sb", C : "scl", G : "sg", R : "sr", U : "su", W : "sw"
    }

    return  <div>
                {colors.map((color)=>{
                    return <span key={color} className={`mana ${colorsValues[color]}`}></span>
                })}
            </div>
}




getHTMLColors = (card)=>{

    console.log(card);
    if(typeof card.manaCost == "undefined") return [];
    var manacost = card.manaCost;
    var manaRegex = new RegExp("(?:B|C|G|R|U|W)?\/?(?:X|P|B|C|G|R|U|W|\\d+)(?=})", 'g');

    var str = [];
    var matches = manacost.match(manaRegex);

    for(var i = 0; i < matches.length; i ++){
        if(     matches[i] ==  "X" ) {str.push({key : i, mana :'sx' }) }
        else if(matches[i] === "1" ) {str.push({key : i, mana :'s1' }) }
        else if(matches[i] === "2" ) {str.push({key : i, mana :'s2' }) }
        else if(matches[i] === "3" ) {str.push({key : i, mana :'s3' }) }
        else if(matches[i] === "4" ) {str.push({key : i, mana :'s4' }) }
        else if(matches[i] === "5" ) {str.push({key : i, mana :'s5' }) }
        else if(matches[i] === "6" ) {str.push({key : i, mana :'s6' }) }
        else if(matches[i] === "7" ) {str.push({key : i, mana :'s7' }) }
        else if(matches[i] === "8" ) {str.push({key : i, mana :'s8' }) }
        else if(matches[i] === "9" ) {str.push({key : i, mana :'s9' }) }
        else if(matches[i] === "10") {str.push({key : i, mana :'s10'}) }
        else if(matches[i] === "11") {str.push({key : i, mana :'s11'}) }
        else if(matches[i] === "12") {str.push({key : i, mana :'s12'}) }
        else if(matches[i] === "13") {str.push({key : i, mana :'s13'}) }
        else if(matches[i] === "14") {str.push({key : i, mana :'s14'}) }
        else if(matches[i] === "15") {str.push({key : i, mana :'s15'}) }
        else if(matches[i] === "16") {str.push({key : i, mana :'s16'}) }
        else if(matches[i] === "17") {str.push({key : i, mana :'s17'}) }
        else if(matches[i] === "18") {str.push({key : i, mana :'s18'}) }
        else if(matches[i] === "19") {str.push({key : i, mana :'s19'}) }
        else if(matches[i] === "20") {str.push({key : i, mana :'s20'}) }

        else if(matches[i] === "B" ) {str.push({key : i, mana :'sb' }) }
        else if(matches[i] === "C" ) {str.push({key : i, mana :'scl'}) }
        else if(matches[i] === "G" ) {str.push({key : i, mana :'sg' }) }
        else if(matches[i] === "R" ) {str.push({key : i, mana :'sr' }) }
        else if(matches[i] === "U" ) {str.push({key : i, mana :'su' }) }
        else if(matches[i] === "W" ) {str.push({key : i, mana :'sw' }) }

        else if(matches[i] === "2B") {str.push({key : i, mana :'s2b'}) }
        else if(matches[i] === "2G") {str.push({key : i, mana :'s2g'}) }
        else if(matches[i] === "3R") {str.push({key : i, mana :'s3r'}) }
        else if(matches[i] === "2U") {str.push({key : i, mana :'s2u'}) }
        else if(matches[i] === "2W") {str.push({key : i, mana :'s2w'}) }

        else if(matches[i] === "B/P"){str.push({key : i, mana :'sbp'}) }
        else if(matches[i] === "G/P"){str.push({key : i, mana :'sgp'}) }
        else if(matches[i] === "R/P"){str.push({key : i, mana :'srp'}) }
        else if(matches[i] === "U/P"){str.push({key : i, mana :'sup'}) }
        else if(matches[i] === "W/P"){str.push({key : i, mana :'swp'}) }

        else if(matches[i] === "B/G"){str.push({key : i, mana :'sbg'}) }
        else if(matches[i] === "B/R"){str.push({key : i, mana :'sbr'}) }
        else if(matches[i] === "G/U"){str.push({key : i, mana :'sgu'}) }
        else if(matches[i] === "G/W"){str.push({key : i, mana :'sgw'}) }
        else if(matches[i] === "R/G"){str.push({key : i, mana :'srg'}) }
        else if(matches[i] === "R/W"){str.push({key : i, mana :'srw'}) }
        else if(matches[i] === "U/B"){str.push({key : i, mana :'sub'}) }
        else if(matches[i] === "U/R"){str.push({key : i, mana :'sur'}) }
        else if(matches[i] === "W/B"){str.push({key : i, mana :'swb'}) }
        else if(matches[i] === "W/U"){str.push({key : i, mana :'swu'}) }
    }
    return str;
}