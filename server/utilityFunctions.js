import Fuse from "fuse.js";

setUpColorForDeckName = function(main){
    var manaRegex = new RegExp("(?:B|C|G|R|U|W)?\/?(?:P|B|C|G|R|U|W)(?=})", 'g');
    var tempMana = {B : 0, C: 0, G : 0, R : 0, U: 0, W : 0,
                    "B/G" : 0, "B/R" : 0, "G/U" : 0, "G/W" : 0, "R/G" : 0,
                    "R/W" : 0, "U/B" : 0, "U/R" : 0, "W/B" : 0, "W/U" : 0,
                    "B/P" : 0, "G/P" : 0, "R/P" : 0, "U/P" : 0, "W/P" : 0};
    main.forEach(function(card){
        var cardQuery = CardsData.find({name : card.name}, {limit : 1}).fetch()[0];
        if(cardQuery){
            var mana = cardQuery.manaCost;
            var result;
            while(result = manaRegex.exec(mana)) {
                if      (result[0] == "B")   {tempMana["B"]++}
                else if (result[0] == "C")   {tempMana["C"]++}
                else if (result[0] == "G")   {tempMana["G"]++}
                else if (result[0] == "R")   {tempMana["R"]++}
                else if (result[0] == "U")   {tempMana["U"]++}
                else if (result[0] == "W")   {tempMana["W"]++}
                else if (result[0] == "B/P") {tempMana["B/P"]++}
                else if (result[0] == "G/P") {tempMana["G/P"]++}
                else if (result[0] == "R/P") {tempMana["R/P"]++}
                else if (result[0] == "U/P") {tempMana["U/P"]++}
                else if (result[0] == "W/P") {tempMana["W/P"]++}
                else if (result[0] == "B/G") {tempMana["B/G"]++}
                else if (result[0] == "B/R") {tempMana["B/R"]++}
                else if (result[0] == "G/U") {tempMana["G/U"]++}
                else if (result[0] == "G/W") {tempMana["G/W"]++}
                else if (result[0] == "R/G") {tempMana["R/G"]++}
                else if (result[0] == "R/W") {tempMana["R/W"]++}
                else if (result[0] == "U/B") {tempMana["U/B"]++}
                else if (result[0] == "U/R") {tempMana["U/R"]++}
                else if (result[0] == "W/B") {tempMana["W/B"]++}
                else if (result[0] == "W/U") {tempMana["W/U"]++} 
            }
        }
    });
    return tempMana;
}



pad = function(n) {
    return (n < 10) ? ("0" + n) : n;
}

getCardFromArrayWithoutLands = function(cardList){
    var resultWithoutLands = [];
    CardsData.find(
        {name : {$in : cardList},
            land : false
        }).forEach(function(card){
            resultWithoutLands.push(card.name);
        });
    return resultWithoutLands;
}

String.prototype.capitalize = function(){
    return this.toLowerCase().replace( /\b\w/g, function (m) {
        return m.toUpperCase();
    });
};

fixCards = function (card) {
    card = card.trim();
    card = card.replace("\xC6", "Ae");
    card = card.replace("\xE9", "e");
    card = card.toTitleCase();

    if(CardsSimple.find({_id : card}, {limit : 1}).count()){
        return card;
    }

    var queryCard = CardsFullData.find({name : {$regex : new RegExp("^" + card + "$"), $options :'i'}}, {limit : 1}).fetch()[0];
    if(queryCard){
        if(queryCard.layout == "split"){
            card = "";
            for(var i = 0; i < queryCard.names.length; i++){
                card += queryCard.names[i].toTitleCase();
                if( i < queryCard.names.length - 1){
                    card += " // ";
                }
            }
        }
    }else{
        var allCardsNames = CardsFullData.find({}, {fields : {name : 1}}).fetch();
        var options = {
            keys : [{name : "name"}],
            id : "name",
            threshold : 0.4
        }
        var fuse = new Fuse(allCardsNames, options);
        var rightName = fuse.search(card)[0];

        var foundName = CardsFullData.find({name : rightName}, {limit : 1}).fetch()[0];
        if(foundName.layout == "split"){
            if(foundName.length > 2){
                card = foundName.names.join("/");
            }else{
                card = foundName.names.join(" // ");
            }
        }
    }
    return card;
}


upperFirstLetters = function(str){
    var words = str.split(' ');

    for(var i = 0; i < words.length; i++) {
        var letters = words[i].split('');
        letters[0] = letters[0].toUpperCase();
        words[i] = letters.join('');
    }
    return words.join(' ');
}

function lower(word){
    return word.toLowerCase();
}

function upper(word){
    return word.substr(0,1).toUpperCase() + word.substr(1);
}

logFunctionsStart=(functionName)=>{
    console.log(`Start: ${functionName}`)
}

logFunctionsEnd=(functionName)=>{
    console.log(`   END: ${functionName}`)
}

logErrorMessage=(error)=>{
    console.log(`ERROR: ${error}`);
}