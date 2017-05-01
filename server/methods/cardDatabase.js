
checkQtyOfCardsFullData = function() {
    logFunctionsStart("checkQtyOfCardsFullData");

    var cardsSet = new Set();
    CardsFullData.find().forEach((card)=>{
        var obj = clone(card);
        var data = {};

        data.name = obj.name.toTitleCase();

        if(obj.hasOwnProperty('layout')){
            data.layout = obj.layout;
            data.name = "";
            data.manaCost = "";
            if(data.layout == "split"){
                for(var i = 0; i < obj.names.length; i ++){
                    obj.name += obj.names[i];
                    if( i < obj.names.length - 1){
                        data.name += " // ";
                    }
                }

                for(var i = 0; i < obj.names.length; i ++){
                    data.name += CardsFullData.findOne({name : obj.names[i]}).manaCost;
                    if( i < obj.names.length - 1){
                        data.manacost += " // ";
                    }
                }
            }
        }
        cardsSet.add(obj.name);
    });
    logFunctionsEnd("checkQtyOfCards");
    return cardsSet.size;
}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}
