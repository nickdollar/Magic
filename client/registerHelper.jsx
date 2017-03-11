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
    return  <span> {colorsArray.map((color)=>{     return <span key={color} className={`mana ${colors[color]}`}></span> })}
            </span>
}


getHTMLColorsFromDecksNamesReact = function(DecksNames_id){
    var colorsValues = {B : "sb", C : "scl", G : "sg", R : "sr", U : "su", W : "sw"};
    var deckName = DecksNames.findOne({_id : DecksNames_id});
    if(!deckName){
        return "";
    }
    if(!deckName.colors){
        return "";
    }
    return  <span>
                {deckName.colors.map((color)=>{
                    return <span key={color} className={`mana ${colorsValues[color]}`}></span>
                })}
            </span>
}

getHTMLColorsFromColorArray = function(colors){
    if(!colors) return "missing";
    var colorsValues = {
        B : "sb", C : "scl", G : "sg", R : "sr", U : "su", W : "sw"
    }

    return  <div> {colors.map((color)=>{     return <span key={color} className={`mana ${colorsValues[color]}`}></span> })}
            </div>
}




getHTMLColors = (card)=> {
    if (typeof card.manaCost == "undefined") return [];
    var manacost = card.manaCost;
    var manaRegex = new RegExp("(?:B|C|G|R|U|W)?\/?(?:X|P|B|C|G|R|U|W|\\d+)(?=})", 'g');

    var str = [];
    var matches = manacost.match(manaRegex);

    var manaValues = {
        "X": 'sx', "0": 's0', "1": 's1', "2": 's2', "3": 's3', "4": 's4', "5": 's5', "6": 's6', "7": 's7', "8": 's8', "9": 's9', "10": 's10',
        "11": 's11', "12": 's12', "13": 's13', "14": 's14', "15": 's15', "16": 's16', "17": 's17', "18": 's18', "19": 's19', "20": 's20',
        "B": 'sb', "C": 'scl', "G": 'sg', "R": 'sr', "U": 'su', "W": 'sw',
        "2B": 's2b', "2G": 's2g', "3R": 's3r', "2U": 's2u', "2W": 's2w',
        "B/P": 'sbp', "G/P": 'sgp', "R/P": 'srp', "U/P": 'sup', "W/P": 'swp', "B/G": 'sbg', "B/R": 'sbr', "G/U": 'sgu', "G/W": 'sgw', "R/G": 'srg',
        "R/W": 'srw', "U/B": 'sub', "U/R": 'sur', "W/B": 'swb', "W/U": 'swu'
    }

     for(var i = 0; i < matches.length; i ++){
         str.push({key : i, mana :  manaValues[matches[i]]});
    }
    return str;
}