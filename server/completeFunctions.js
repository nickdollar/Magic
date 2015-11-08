addNameToDeck = function(_selectedDeckID, name){
    var deck = _Deck.findOne({_id : _selectedDeckID});

    _DeckNames.update({
        format : deck.format,
        name : name
    },
    {
        $setOnInsert : {
            format : deck.format,
            name : name,
            colors :  ""
        }
    },
        {upsert : true}
    );

    var deckName = _DeckNames.findOne({
        format : deck.format,
        name : name
    });

    var colors = findTheColors(deck.colors, deckName.colors);

    _DeckNames.update({
            format : deck.format,
            name : name
        },
        {
            $set : {
                colors :  colors
            }
        },
        {upsert : true}
    );

    _Deck.update({_id : _selectedDeckID},{
        $set : {name : name}
    });
}


findTheColors = function(deckColors, nameDeckColors){
    var manaRegex = new RegExp("([a-zA-Z])", 'g');
    var tempMana = {"B" : false, "G" : false, "R" : false, "U" : false, "W" : false};
    var mana = deckColors + nameDeckColors;
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
    console.log(colors);
    return colors;
}