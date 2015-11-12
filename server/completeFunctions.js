addNameToDeck = function(_selectedDeckID, name){
    var deck = _Deck.findOne({_id : _selectedDeckID});

    _DeckNames.update({
        format : deck.format,
        name : name
    },
    {
        $setOnInsert : {
            format : deck.format,
            name : name
        }
    },
        {upsert : true}
    );

    var deckName = _DeckNames.findOne({
        format : deck.format,
        name : name
    });

    var colors = findTheColorsInc(deck.colors);

    console.log(colors);


    _DeckNames.update({
            format : deck.format,
            name : name
        },
        {
            $inc : colors
        },
        {upsert : true}
    );

    _Deck.update({_id : _selectedDeckID},{
        $set : {name : name}
    });
}


findTheColors = function(deckColors){
    var manaRegex = new RegExp("([a-zA-Z])", 'g');
    var tempMana = {"B" : false, "G" : false, "R" : false, "U" : false, "W" : false};
    var mana = deckColors;
    console.log("Mana: " + mana);
    var result;
    while((result = manaRegex.exec(mana)) !== null) {
        console.log(result);
        if(result[1] == "B") { tempMana["B"] = true; }
        else if (result[1] == "G") { tempMana["G"] = true}
        else if (result[1] == "R") { tempMana["R"] = true}
        else if (result[1] == "U") { tempMana["U"] = true}
        else if (result[1] == "W") { tempMana["W"] = true}
    }
    var colors = "";
    for(var key in tempMana ){
        if(tempMana[key] == true){
            colors += key;
        }
    }
    return colors;
}

findTheColorsInc = function(deckColors){
    var manaRegex = new RegExp("([a-zA-Z])", 'g');
    var tempMana = {"B" : false, "G" : false, "R" : false, "U" : false, "W" : false};
    var mana = deckColors;
    var result;
    while((result = manaRegex.exec(mana)) !== null) {

        if(result[1] == "B") { tempMana["B"] = true; }
        else if (result[1] == "G") { tempMana["G"] = true}
        else if (result[1] == "R") { tempMana["R"] = true}
        else if (result[1] == "U") { tempMana["U"] = true}
        else if (result[1] == "W") { tempMana["W"] = true}
    }

    var colors = {};
    for(var key in tempMana ){
        if(tempMana[key] == true){
            colors[key] = 1;
        }
    }
    return colors;
}