createCardsFullData = function(){
    console.log("START: createCardsFullData");
    CardsFullData.remove({});

    var cardsFromFile = JSON.parse(Assets.getText('AllCards.json'));

    for (var key in cardsFromFile) {
        CardsFullData.insert(cardsFromFile[key]);
    }
    console.log("   END: createCardsFullData");
}


checkIfCardFullDataQuantity = function(){
    console.log("START: checkIfCardFullDataQuantity");
    var cardFromFile = JSON.parse(Assets.getText('AllCards.json'));

    var quantity = 0;
    for (var key in cardFromFile) {
        quantity++;
    }
    console.log("   END: checkIfCardFullDataQuantity");
    return quantity;
}