import React from 'react' ;

getHTMLColorsFromArchetypesReact = function(DecksArchetypes_id){
    var colors = {b : "sb", c : "scl", g : "sg", r : "sr", u : "su", w : "sw"};
    var colorsArray = DecksArchetypes.findOne({_id : DecksArchetypes_id}).colors;
    if(colorsArray){
        return <span> {colorsArray.map(color=> <span key={color} className={`mana ${colors[color]}`}></span> )} </span>;
    }
    return  null;
}

getHTMLColorsFromSubtypesReact = function({DecksArchetypes_id}){
    var colorsValues = {b : "sb", c : "scl", g : "sg", r : "sr", u : "su", w : "sw"};
    var deckArchetypes = DecksArchetypes.findOne({_id : DecksArchetypes_id});
    if(!deckArchetypes){return "";}
    return  <span>
                {deckArchetypes.colors.map((color)=>{
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

getHTMLFromArray = (manaCost)=> {
    if (!manaCost) return [];

    var manaValues = {
        "x": 'sx', "0": 's0', "1": 's1', "2": 's2', "3": 's3', "4": 's4', "5": 's5', "6": 's6', "7": 's7', "8": 's8', "9": 's9', "10": 's10',
        "11": 's11', "12": 's12', "13": 's13', "14": 's14', "15": 's15', "16": 's16', "17": 's17', "18": 's18', "19": 's19', "20": 's20',
        "b": 'sb', "c": 'scl', "g": 'sg', "r": 'sr', "u": 'su', "w": 'sw',
        "2b": 's2b', "2b": 's2g', "3r": 's3r', "2u": 's2u', "2w": 's2w',
        "pb": 'sbp', "pg": 'sgp', "pr": 'srp', "pu": 'sup', "pw": 'swp', "bg": 'sbg', "br": 'sbr', "gu": 'sgu', "gw": 'sgw', "rg": 'srg',
        "rw": 'srw', "ub": 'sub', "ur": 'sur', "wb": 'swb', "wu": 'swu',
        "//" : "//"
    }
    var str = [];
    for(var i = 0; i < manaCost.length; i ++){str.push({key : i, mana :  manaValues[manaCost[i]]});}
    return str;
}

getHTMLColors = (card)=> {
    if (typeof card.manaCost == "undefined") return [];
    var manacost = card.manaCost;
    var manaRegex = new RegExp("(?:B|C|G|R|U|W)?\/?(?:X|P|B|C|G|R|U|W|\\d+)(?=})", 'g');

    var str = [];
    var matches = manacost.match(manaRegex);

    var manaValues = {
        "x": 'sx', "0": 's0', "1": 's1', "2": 's2', "3": 's3', "4": 's4', "5": 's5', "6": 's6', "7": 's7', "8": 's8', "9": 's9', "10": 's10',
        "11": 's11', "12": 's12', "13": 's13', "14": 's14', "15": 's15', "16": 's16', "17": 's17', "18": 's18', "19": 's19', "20": 's20',
        "b": 'sb', "c": 'scl', "g": 'sg', "r": 'sr', "u": 'su', "w": 'sw',
        "2B": 's2b', "2G": 's2g', "3R": 's3r', "2U": 's2u', "2W": 's2w',
        "b/p": 'sbp', "g/p": 'sgp', "r/p": 'srp', "u/p": 'sup', "w/p": 'swp', "b/g": 'sbg', "b/t": 'sbr', "g/u": 'sgu', "g/w": 'sgw', "r/g": 'srg',
        "r/w": 'srw', "u/b": 'sub', "u/r": 'sur', "w/b": 'swb', "w/u": 'swu',
        "//" : "//"
    }

     for(var i = 0; i < matches.length; i ++){
         str.push({key : i, mana :  manaValues[matches[i]]});
    }
    return str;
}