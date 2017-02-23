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

    return <div>
        {colors.map((color)=>{
            return <span key={color} className={`mana ${colorsValues[color]}`}></span>
        })}
    </div>
}