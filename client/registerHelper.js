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

getFormat_idFromLink = (formatLink)=>{
    return Formats.findOne({names : {$regex : formatLink, $options : "i"}})._id;
}

getLinkFormat = (Formats_id)=>{
    return Formats.findOne({_id : Formats_id}).name;
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

prettifyPosition = (position)=>{
    position = parseInt(position);
    var s=["th","st","nd","rd"],
        v=position%100;
    return position+(s[(v-20)%10]||s[v]||s[0]);
}

absoluteValue = function(string){
    return Math.abs(parseFloat(string));
}

replaceTokenWithDash = function(string){
    return string.replace(/[ &']/g, "-");
}

replaceDashWithDotForRegex = function(string){
    return string.replace(/[-']/g, ".");
}