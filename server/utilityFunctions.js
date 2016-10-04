setUpColorForDeckName = function(deckCards){
    var manaRegex = new RegExp("(?:B|G|R|U|W)?\/?(?:P|B|G|R|U|W)(?=})", 'g');
    var tempMana = {B : 0, C: 0, G : 0, R : 0, U: 0, W : 0,
                    "B/G" : 0, "B/R" : 0, "G/U" : 0, "G/W" : 0, "R/G" : 0,
                    "R/W" : 0, "U/B" : 0, "U/R" : 0, "W/B" : 0, "W/U" : 0};
    deckCards.main.forEach(function(card){
        if(_CardDatabase.findOne({name : card.name}) != null ){
            var mana = _CardDatabase.findOne({name : card.name}).manacost;
            var result;
            while((result = manaRegex.exec(mana)) !== null) {
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
    _CardDatabase.find(
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
    card = card.replace("\xC6", "Ae");
    card = card.replace("\xE9", "e");
    card = titleCaps(card);
    return card;
}

titleCaps = function(title){
    var small = "(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|v[.]?|via|vs[.]?)";
    var punct = "([!\"#$%&'()*+,./:;<=>?@[\\\\\\]^_`{|}~-]*)";

    var parts = [], split = /[:.;?!] |(?: |^)["�]/g, index = 0;

    while (true) {
        var m = split.exec(title);

        parts.push( title.substring(index, m ? m.index : title.length)
            .replace(/\b([A-Za-z][a-z.'�]*)\b/g, function(all){
                return /[A-Za-z]\.[A-Za-z]/.test(all) ? all : upper(all);
            })
            .replace(RegExp("\\b" + small + "\\b", "ig"), lower)
            .replace(RegExp("^" + punct + small + "\\b", "ig"), function(all, punct, word){
                return punct + upper(word);
            })
            .replace(RegExp("\\b" + small + punct + "$", "ig"), upper));

        index = split.lastIndex;

        if ( m ) parts.push( m[0] );
        else break;
    }

    return parts.join("").replace(/ V(s?)\. /ig, " v$1. ")
        .replace(/(['�])S\b/ig, "$1s")
        .replace(/\b(AT&T|Q&A)\b/ig, function(all){
            return all.toUpperCase();
        });
};

function lower(word){
    return word.toLowerCase();
}

function upper(word){
    return word.substr(0,1).toUpperCase() + word.substr(1);
}

//(function(){
//    var small = "(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|v[.]?|via|vs[.]?)";
//    var punct = "([!\"#$%&'()*+,./:;<=>?@[\\\\\\]^_`{|}~-]*)";
//
//    this.titleCaps = function(title){
//        var parts = [], split = /[:.;?!] |(?: |^)["�]/g, index = 0;
//
//        while (true) {
//            var m = split.exec(title);
//
//            parts.push( title.substring(index, m ? m.index : title.length)
//                .replace(/\b([A-Za-z][a-z.'�]*)\b/g, function(all){
//                    return /[A-Za-z]\.[A-Za-z]/.test(all) ? all : upper(all);
//                })
//                .replace(RegExp("\\b" + small + "\\b", "ig"), lower)
//                .replace(RegExp("^" + punct + small + "\\b", "ig"), function(all, punct, word){
//                    return punct + upper(word);
//                })
//                .replace(RegExp("\\b" + small + punct + "$", "ig"), upper));
//
//            index = split.lastIndex;
//
//            if ( m ) parts.push( m[0] );
//            else break;
//        }
//
//        return parts.join("").replace(/ V(s?)\. /ig, " v$1. ")
//            .replace(/(['�])S\b/ig, "$1s")
//            .replace(/\b(AT&T|Q&A)\b/ig, function(all){
//                return all.toUpperCase();
//            });
//    };
//
//
//})();