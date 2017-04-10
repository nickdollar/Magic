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


checkIfCardFullDataQuantity = function(){
    logFunctionsStart("checkIfCardFullDataQuantity");
    var cardFromFile = JSON.parse(Assets.getText('AllCards-x.json'));

    var quantity = 0;
    for (var key in cardFromFile) {
        quantity++;
    }
    logFunctionsEnd("checkIfCardFullDataQuantity");
    return quantity;
}