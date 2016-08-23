deckNaming = function(_deckID){
    var deckNames = _temp3.find({}).fetch();
    var deck = _temp2.find({_id : _deckID});
    var perDeck = [];
    for(var i = 0; i < deckNames.length; i++){
        var array = deckNames[i].main;

        perDeck.deckNames[i].name;

        var foundCards = [];
        for(var j = 0; j < deck.length; j++){
            foundCards.push(array.find(function(obj){
                return obj.name == deck[j].name;
            }));
        }
        perDeck.foundCards = foundCards;
    }
};

addNameToDeck2 = function(deckName, deckID, format){

    if(_temp3.find({"decksList._id" : deckID }).count()){
        // console.log("Deck Exist");
        return;
    };

    _temp3.update({deckName : deckName, format : format},
        {
            $setOnInsert : { deckName: deckName, format: format, decks : 0}
        },
        { upsert : true }
    );

    _temp2.findOne({_id : deckID}).main.forEach(function(obj){
        var query = {};
        query = {deckName : deckName, format : format};
        query["main.name"] = obj.name;

        console.log(query);
        var exists = _temp3.find(query).count();

        if(exists){
            // console.log("exists");
            var increment = {"main.$.decksQuantity" : 1, "main.$.total" : obj.quantity};
            _temp3.update(query,
                {
                    $inc : increment
                })
        }else {
            // console.log("don't exists");
            var setQuery = {name : obj.name, decksQuantity : 1, total : obj.quantity};
            _temp3.update({deckName : deckName, format : format},
                {
                    $push : {
                        main : setQuery
                    }
                })
        }
    });
    _temp2.update(  {_id : deckID},
                    {$set : {name : deckName}}
    );
    _temp3.update({deckName : deckName, format : format}, {$inc : {decks : 1}, $push : {decksList : {_id : deckID}}});
};

Array.prototype.diff = function(arr2) {
    var ret = [];
    this.sort();
    arr2.sort();
    for(var i = 0; i < this.length; i += 1) {
        if(arr2.indexOf( this[i] ) > -1){
            ret.push( this[i] );
        }
    }
    return ret;
};

findDeckComparison = function(_id, format){
    var deckNames = _temp3.find({format : format});
    var deck = _temp2.findOne({_id : _id});
    var deckCards = deck.main.map(function(obj){
        return obj.name;
    });

    var nonLandsCards = _CardDatabase.find({name : {$in : deckCards}, land : false}).map(function(obj){
        return obj.name;
    });

    var decks = [];



    deckNames.forEach(function(obj){
        var deckNameDeckCards = obj.main.map(function(obj2){
            return obj2.name;
        });

        var deckNameNonLandsCards = _CardDatabase.find({name : {$in : deckNameDeckCards}, land : false}).map(function(obj2){
            return obj2.name;
        });

        var deckNameNonLandscardsData = [];
        deckNameNonLandsCards.sort();
        obj.main.sort(function(a,b){
            var nameA = a.name.toUpperCase(); // ignore upper and lowercase
            var nameB = b.name.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            // names must be equal
            return 0;
        });

        for(var i = 0; i < obj.main.length; i += 1) {
            if(deckNameNonLandsCards.indexOf( obj.main[i].name ) > -1){
                deckNameNonLandscardsData.push( obj.main[i] );
            }
        }

        var filteredCardData = [];

        for(var i = 0; i < deckNameNonLandscardsData.length; i += 1) {

            var test = nonLandsCards.findIndex( function(obj2){
                return obj2 == deckNameNonLandscardsData[i].name;
            });
            if(test > -1){
                filteredCardData.push(deckNameNonLandscardsData[i]);
            }
        }

        var sum = filteredCardData.reduce(function(a, b){
            return a + b.decksQuantity;
        }, 0);

        decks.push({deckName : obj.deckName, result  : (sum/obj.decks)/nonLandsCards.length});
    });
    var decksFiltered = decks.filter(function(obj){
        return obj.result > 0.3;
    })

    decksFiltered.sort(function(a,b){
        return b.result -a.result;
    })

    return decksFiltered;
};