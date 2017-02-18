

checkQuantityOfCards = function() {
    console.log("START: checkQuantityOfCards");

    var myobject = JSON.parse(Assets.getText('AllCards.json'));
    var cardsSet = new Set();
    for (var key in myobject) {
        var obj = clone(myobject[key]);
        var data = {};

        obj.name = obj.name.toTitleCase();

        if(obj.hasOwnProperty('layout')){
            data.layout = obj.layout;
            if(obj.layout == "split"){
                if(obj.names.length > 2){
                    obj.name = obj.names.join("/");
                }else{
                    obj.name = obj.names.join(" // ");
                    obj.manaCost = [myobject[obj.names[0]].manaCost,  myobject[obj.names[1]].manaCost].join(" // ");
                }
            }
        }

        if(obj.hasOwnProperty('name')){
            obj.name = obj.name.replace("\xC6", "Ae");
            data.name = obj.name;
        }

        if(obj.hasOwnProperty('names')){

            var temp = obj.names.map((card)=>{
                return card.replace("\xC6", "Ae").toTitleCase();
            })
            data.names = temp;
        }
        cardsSet.add(obj.name);
    }
    console.log("END: checkQuantityOfCards");
    return cardsSet.size;
}

makeCardsData = function(){

    console.log("START: makeCardsData");
    var myobject = JSON.parse(Assets.getText('AllCards.json'));
    CardsData.remove({});



    for (var key in myobject) {

        var obj = clone(myobject[key]);
        var data = {};

        obj.name = obj.name.toTitleCase();

        if(obj.hasOwnProperty('layout')){
            data.layout = obj.layout;
            if(obj.layout == "split"){
                if(obj.names.length > 2){
                    obj.name = obj.names.join("/");
                }else{
                    obj.name = obj.names.join(" // ");
                    obj.manaCost = [myobject[obj.names[0]].manaCost,  myobject[obj.names[1]].manaCost].join(" // ");
                }
            }
        }



        if(obj.hasOwnProperty('name')){
            obj.name = obj.name.replace("\xC6", "Ae");
            data.name = obj.name;
        }

        if(obj.hasOwnProperty('names')){

            var temp = obj.names.map((card)=>{
                return card.replace("\xC6", "Ae").toTitleCase();
            })
            data.names = temp;
        }

        if(obj.hasOwnProperty('type')){
            obj.type = obj.type.replace("�", "-");
            data.type = obj.type;
        }

        if(obj.hasOwnProperty('types')){
            var types = {
                artifact : false,
                creature : false,
                enchantment : false,
                instant : false,
                land : false,
                planeswalker : false,
                sorcery : false,
                tribal : false
            };

            for(var i = 0; i<obj.types.length; i++){
                types[obj.types[i].toLowerCase()] = true;
            }

            data.artifact = types.artifact;
            data.creature = types.creature;
            data.enchantment = types.enchantment;
            data.instant = types.instant;
            data.land = types.land;
            data.planeswalker = types.planeswalker;
            data.sorcery = types.sorcery;
            data.tribal = types.tribal
        };

        if(obj.hasOwnProperty('cmc')){
            data.cmc = obj.cmc;
        }

        if(obj.hasOwnProperty('manaCost')){
            data.manacost = obj.manaCost;
        }

        if(obj.hasOwnProperty('toughness')){
            data.toughness = obj.toughness;
        }

        if(obj.hasOwnProperty('power')){
            data.power = obj.power;
        }
        if(obj.hasOwnProperty('layout')){
            data.layout = obj.layout;
        }

        CardsData.update( {name : data.name},

            {$setOnInsert : data},
            {upsert : true}
        );
    }

    console.log("END: makeCardsData");
}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}
