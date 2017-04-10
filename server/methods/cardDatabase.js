makeCardsDataCount = function(){
    logFunctionsStart("makeCardsDataFromFullData");

    var cardSet = new Set();
    CardsFullData.find().forEach((card)=>{
        var obj = clone(card);

        var data = {};
        var name = obj.name.toTitleCase();

        if(obj.hasOwnProperty('layout')){
            if(obj.layout == "split"){
                var name = "";
                for(var i = 0; i < obj.names.length; i ++){
                    name += obj.names[i].toTitleCase();
                    if( i < obj.names.length - 1){
                        name += " // ";
                    }
                }
            }
        }
        cardSet.add(name);
    });

    logFunctionsEnd("makeCardsDataFromFullData");
    return cardSet.size;
}


makeCardsDataFromFullData = function(){

    logFunctionsStart("makeCardsDataFromFullData");
    CardsData.remove({});

    CardsFullData.find().forEach((card)=>{
        var obj = clone(card);

        var data = {};
        var keys = ["layout", "name", "cmc", "manaCost", "toughness", "power", "layout"];

        keys.forEach((key)=>{
            if(obj.hasOwnProperty(key)){
                if(key == "name"){
                    data[key] = obj[key].toTitleCase();
                }else{
                    data[key] = obj[key];
                }
            }
        })


        if(obj.hasOwnProperty('names')){
            data.names = obj.names.map((name)=>{
                return name.toTitleCase();
            })
        }

        if(obj.hasOwnProperty('layout')){
            if(obj.layout == "split"){
                data.name = "";
                for(var i = 0; i < obj.names.length; i ++){
                    data.name += obj.names[i].toTitleCase();
                    if( i < obj.names.length - 1){
                        data.name += " // ";
                    }
                }
                data.manaCost = "";
                for(var i = 0; i < obj.names.length; i ++){
                    data.manaCost += CardsFullData.find({name : obj.names[i]}, {limit : 1}).fetch()[0].manaCost;
                    if( i < obj.names.length - 1){
                        data.manaCost += " // ";
                    }
                }
            }
        }

        if(obj.hasOwnProperty('types')) {
            var types = ["artifact", "creature", "enchantment", "instant", "land", "planeswalker", "sorcery", "tribal"];

            types.forEach((type) => {
                var index = obj.types.findIndex((queryType) => {
                    return type.toTitleCase() == queryType;
                });
                if (index == -1) {
                    data[type] = false;
                } else {
                    data[type] = true;
                }
            })
        }

        if(data.layout == "split"){
            CardsData.update({name : data.name},
                {
                    $set : data
                },
                {
                    upsert : true
                }
            );
        }else{
            CardsData.insert(data);
        }
    });
    logFunctionsEnd("makeCardsDataFromFullData");
}

checkQuantityOfCardsFullData = function() {
    logFunctionsStart("checkQuantityOfCardsFullData");

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
    logFunctionsEnd("checkQuantityOfCards");
    return cardsSet.size;
}

makeCardsData = function(){

    logFunctionsStart("makeCardsData");
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
            data.name = obj.name;
        }

        if(obj.hasOwnProperty('names')){

            data.names = obj.names;
        }

        if(obj.hasOwnProperty('type')){
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

    logFunctionsEnd("makeCardsData");
}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}
