getQuantity = function(options, sideboard){
    var quantity = 0;
    _JoinCardsData.find(options).forEach(function(card)
    {
        if(_DeckCards.findOne({name : card.name, sideboard : sideboard})){
            //console.log(card.name);
            quantity += parseInt(_DeckCards.findOne({name : card.name, sideboard : sideboard}).quantity);
        }
    });
    return quantity;
};

getQuantity2 = function(options, sideboard, _deckID){
    var quantity = 0;
    _JoinExampleCards.find(options).forEach(function(card)
    {
        if(_DeckCards.findOne({_deckID: _deckID, name : card.name, sideboard : sideboard})){
            quantity += parseInt(_DeckCards.findOne({_deckID: _deckID, name : card.name, sideboard : sideboard}).quantity);
        }
    });
    return quantity;
};

makeLinkFromName = function(cardName){
    cardName = encodeURI(cardName);
    cardName = cardName.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "%22;").replace(/'/g, "%27");
    var linkBase = "http://69.195.122.106/nicholas/mtgpics/";
    var folderLetter = cardName.charAt(0).toLocaleLowerCase();
    var finalDirectory = linkBase+folderLetter+"/"+cardName+".full.jpg";
    return finalDirectory;
}

shadeColor = function(color, percent) {
    var num = parseInt(color.slice(1),16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        G = (num >> 8 & 0x00FF) + amt,
        B = (num & 0x0000FF) + amt;
    return "#" +(0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
}

getLastAndFirstDayOfWeekBefore = function(){
    var curr = new Date; // get current date
    var first = curr.getDate() - curr.getDay() - 7; // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6

    var weekStart = new Date(curr.setDate(first));
    weekStart.setSeconds(0);
    weekStart.setHours(0);
    weekStart.setMinutes(0);
    weekStart.setMilliseconds(0);

    var weekEnd = new Date(curr.setDate(last)-7);
    weekEnd.setHours(23);
    weekEnd.setMinutes(59);
    weekEnd.setSeconds(59);
    weekEnd.setMilliseconds(999);

    var week = {weekStart : weekStart, weekEnd : weekEnd};
    return week;
}
