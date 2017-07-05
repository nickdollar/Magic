import Fuse from "fuse.js";

setUpColorForDeckName = function(main){
    var manaRegex = new RegExp("(?:B|C|G|R|U|W)?\/?(?:P|B|C|G|R|U|W)(?=})", 'g');
    var tempMana = {B : 0, C: 0, G : 0, R : 0, U: 0, W : 0,
                    "B/G" : 0, "B/R" : 0, "G/U" : 0, "G/W" : 0, "R/G" : 0,
                    "R/W" : 0, "U/B" : 0, "U/R" : 0, "W/B" : 0, "W/U" : 0,
                    "B/P" : 0, "G/P" : 0, "R/P" : 0, "U/P" : 0, "W/P" : 0};
    main.forEach(function(card){
        var cardQuery = Cards.find({_id : card.Cards_id}, {limit : 1}).fetch()[0];
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
    Cards.find(
        {_id : {$in : cardList},
            land : false
        }).forEach(function(card){
            resultWithoutLands.push(card._id);
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

    var foundCardsSimple = CardsSimple.find({_id : new RegExp(`^${card}$`, "i")}, {limit : 1});
    if(foundCardsSimple.count()){
        return foundCardsSimple.fetch()[0]._id;
    }


    var queryCard = Cards.find({names : new RegExp(`^${card}$`, "i"), layout : {$nin : ["meld"]}}, {limit : 1}).fetch()[0];
    if(queryCard){
        return queryCard._id;
    }else{
        var allCardsNames = Cards.aggregate([
            {
                $project : {
                    names : 1
                }
            },
            {
                $unwind : "$names"
            },
            {
                $group : {
                    _id : "$names",
                    __id : {$first : "$_id"},
                }
            }
        ]);

        var options = {
            keys : ["_id"],
            id : "__id",
            sort : true,
            tokenize: true,
            threshold : 0.2,
        }
        var fuse = new Fuse(allCardsNames, options);

        var fuseFounds = fuse.search(escapeRegExp(card));
        var fuseCard = fuseFounds[0];
        if(fuseCard){
            return fuseCard;
        }
    }
    return `${card}`;
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



arrayLowercaseSorted = (array)=>{
    var sorted = [];
    array.forEach((item)=>{
        sorted.push(item.toLowerCase())
    })
    return sorted.sort();
}

arrayLowercase = (array)=>{
    var lowerCase = [];
    array.forEach((item)=>{
        lowerCase.push(item.toLowerCase())
    })
    return lowerCase;
}

arrayUnique = (array)=> {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }
    return a;

}
escapeRegExp = (str)=>{
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}