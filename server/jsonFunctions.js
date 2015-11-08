
makeCardDatabase = function(){
    myobject = JSON.parse(Assets.getText('AllCards.json'));

    for (var key in myobject) {

        var obj = myobject[key];
        var data = {};

        if(obj.hasOwnProperty('name')){
            obj.name = obj.name.replace("\xC6", "Ae");
            data.name = obj.name;
        }

        if(obj.hasOwnProperty('type')){
            obj.type = obj.type.replace("—", "-");
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

        _CardDatabase.insert(data);
    }
}