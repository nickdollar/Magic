createCardsFullData = function(){
    logFunctionsStart("createCardsFullData");
    CardsFullData.remove({});
    var cardsFromFile = JSON.parse(Assets.getText('AllCards-x.json'));
    for (var key in cardsFromFile) {
        var obj = Object.assign({}, cardsFromFile[key]);
        obj.name = obj.name.toTitleCase();
        CardsFullData.insert(obj);
    }
    logFunctionsEnd("createCardsFullData");
}


checkIfCardFullDataQty = function(){
    logFunctionsStart("checkIfCardFullDataQty");
    var cardFromFile = JSON.parse(Assets.getText('AllCards-x.json'));

    var qty = 0;
    for (var key in cardFromFile) {
        qty++;
    }
    logFunctionsEnd("checkIfCardFullDataQty");
    return qty;
}