setUpColorForDeckName = function(_deckID){
    var manaRegex = new RegExp("\{([a-zA-Z])\}", 'g');
    var cards = _DeckCards.find({_deckID : _deckID}).fetch();

    var tempMana = {"B" : false, "G" : false, "R" : false, "U" : false, "W" : false};
    cards.forEach(function(card){
        //console.log(card.name);
        if(_CardDatabase.findOne({name : card.name}) != null ){
            var mana = _CardDatabase.findOne({name : card.name}).manacost;
            var result;
            while((result = manaRegex.exec(mana)) !== null) {
                if(result[1] == "B") { tempMana["B"] = true; }
                else if (result[1] == "G") { tempMana["G"] = true}
                else if (result[1] == "R") { tempMana["R"] = true}
                else if (result[1] == "U") { tempMana["U"] = true}
                else if (result[1] == "W") { tempMana["W"] = true}
            }
        }
    });
    var colors = "";
    for(var key in tempMana ){
        if(tempMana[key] == true){
            colors += key;
        }
    }
    return colors;
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

    var parts = [], split = /[:.;?!] |(?: |^)["Ò]/g, index = 0;

    while (true) {
        var m = split.exec(title);

        parts.push( title.substring(index, m ? m.index : title.length)
            .replace(/\b([A-Za-z][a-z.'Õ]*)\b/g, function(all){
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
        .replace(/(['Õ])S\b/ig, "$1s")
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
//        var parts = [], split = /[:.;?!] |(?: |^)["Ò]/g, index = 0;
//
//        while (true) {
//            var m = split.exec(title);
//
//            parts.push( title.substring(index, m ? m.index : title.length)
//                .replace(/\b([A-Za-z][a-z.'Õ]*)\b/g, function(all){
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
//            .replace(/(['Õ])S\b/ig, "$1s")
//            .replace(/\b(AT&T|Q&A)\b/ig, function(all){
//                return all.toUpperCase();
//            });
//    };
//
//
//})();