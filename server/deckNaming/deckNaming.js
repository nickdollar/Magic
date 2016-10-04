deckNaming = function(DecksData_id){
    var deckNames = DecksNames.find({}).fetch();
    var deck = DecksData.find({_id : DecksData_id});
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

removeNameFromDeck = function(DecksData_id){
    var deckData = DecksData.findOne({_id : DecksData_id});

    deckData.main.forEach(function(obj){
        var query = {};
        query = {_id : deckData.DecksNames_id, "DecksData._id" : deckData._id};
        query["main.name"] = obj.name;

        var increment = {"main.$.decksQuantity" : -1, "main.$.total" : -obj.quantity};
        DecksNames.update(query,
            {
                $inc : increment
            })
    });
    DecksData.update(deckData,
        {$unset : {DecksNames_id : ""}}
    );

    DecksNames.update({_id : deckData.DecksNames_id, "DecksData._id" : deckData._id}, {
        $inc : {
            decks : -1,
                "colors.B" : -deckData.colors.B,
                "colors.C" : -deckData.colors.C,
                "colors.G" : -deckData.colors.G,
                "colors.R" : -deckData.colors.R,
                "colors.U" : -deckData.colors.U,
                "colors.W" : -deckData.colors.W
        },
        $pull : {
            DecksData : {
                _id : deckData._id}
        }
    },
        {multi : true}
    );
};

createANewDeckName = function(deckName, format){
    if(deckName == null || format == null){
        return;
    }
    deckName = deckName.toLowerCase();
    DecksNames.update({name : deckName, format : format},
        {
            $setOnInsert : { name: deckName, format: format, decks : 0, colors : {B : 0, C: 0, G : 0, R: 0, U : 0, W : 0}}
        },
        { upsert : true }
    );
};


addNameToDeck = function(deckName, DecksData_id){

    deckName = deckName.toLowerCase();
    var deckData = DecksData.findOne({_id : DecksData_id});

    var deckName = DecksNames.findOne({name : deckName, format : deckData.format});

    deckData.main.forEach(function(obj){
        var query = {};
        query = {_id : deckName._id};
        query["main.name"] = obj.name;

        var exists = DecksNames.find(query).count();

        if(exists){
            var increment = {"main.$.decksQuantity" : 1, "main.$.total" : obj.quantity};
            DecksNames.update(query,
                {
                    $inc : increment
                })
        }else {
            var setQuery = {name : obj.name, decksQuantity : 1, total : obj.quantity};
            DecksNames.update({_id : deckName._id},
                {
                    $push : {
                        main : setQuery
                    }
                })
        }
    });
    DecksData.update(  {_id : deckData._id},
                    {$set : {DecksNames_id : deckName._id}}
    );

    DecksNames.update({
            _id : deckName._id
        }, {
            $inc : {
            decks : 1,
            "colors.B" : deckData.colors.B,
            "colors.C" : deckData.colors.C,
            "colors.G" : deckData.colors.G,
            "colors.R" : deckData.colors.R,
            "colors.U" : deckData.colors.U,
            "colors.W" : deckData.colors.W
        },
            $push : {
                DecksData : {
                    _id : deckData._id
                }
            }
        }
    );
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

findDeckComparison = function(_id){
    var deck = DecksData.findOne({_id : _id});
    var deckNames = DecksNames.find({format : deck.format});

    var deckCards = deck.main.map(function(obj){
        return obj.name;
    });

    var nonLandsCards = _CardDatabase.find({name : {$in : deckCards}, land : false}).map(function(obj){
        return obj.name;
    });

    var decks = [];


    deckNames.forEach(function(obj){

        if(obj.main == null){
            return;
        }

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

        decks.push({name : obj.name, result  : (sum/obj.decks)/nonLandsCards.length});
    });
    var decksFiltered = decks.filter(function(obj){
        return obj.result > 0.3;
    })

    decksFiltered.sort(function(a,b){
        return b.result -a.result;
    });
    
    
    return decksFiltered;
};


addArchetype = function(archetypeName, format, type){

        archetypeName = archetypeName.toLowerCase();
        type = type.toLowerCase();
        DecksArchetypes.update({name : archetypeName, format : format, type : type},
        {
            $setOnInsert : {name : archetypeName, format : format, type : type}
        },
        {upsert : true}
    );
};

addArchetypeToDeck = function(DecksArchetypes_id, DecksNames_id){
    var deckArchetype = DecksArchetypes.findOne({_id : DecksArchetypes_id});
    var deckName = DecksNames.findOne({_id : DecksNames_id});

    DecksNames.update({_id : DecksNames_id},
        {
            $set : {
                DecksArchetypes_id : deckArchetype._id,
            }
        }
    );

    DecksArchetypes.update({"decksNames._id" : deckName._id},
                    {
                        $pull : {
                            DecksNames : {
                                _id: deckName._id,
                            }
                        }
                    }
    );

    DecksArchetypes.update({ _id : deckArchetype._id},
                    {
                        $push : {
                            DecksNames : {
                                _id: deckName._id,
                            }
                        }
                    }
    );
};


getDeckNamePercentage = function(DecksNames_id){

    var deckName = DecksNames.findOne({_id : DecksNames_id});
    var deckNameDeckCards = deckName.main.map(function(obj){
        return obj.name;
    });
    var deckNameDeckCardsNonLands = _CardDatabase.find({name : {$in : deckNameDeckCards}, land : false}).map(function(obj){
        return obj.name;
    });
    deckNameDeckCardsNonLands.sort();
    deckName.main.sort(function(a,b){
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
    var deckNameDeckCardsNonLandsData = [];
    for(var i = 0; i < deckName.main.length; i += 1) {
        if(deckNameDeckCardsNonLands.indexOf( deckName.main[i].name ) > -1){
            deckNameDeckCardsNonLandsData.push( deckName.main[i] );
        }
    }
    var deckPercentages = [];
    DecksData.find({DecksNames_id : deckName._id}).forEach(function(obj){

        var deckCards = obj.main.map(function(obj){
            return obj.name;
        });

        var nonLandsCards = _CardDatabase.find({name : {$in : deckCards}, land : false}).map(function(obj){
            return obj.name;
        });

        var filteredCardData = [];

        for(var i = 0; i < deckNameDeckCardsNonLandsData.length; i += 1) {

            var test = nonLandsCards.findIndex( function(obj2){
                return obj2 == deckNameDeckCardsNonLandsData[i].name;
            });
            if(test > -1){
                filteredCardData.push(deckNameDeckCardsNonLandsData[i]);
            }
        }

        var sum = filteredCardData.reduce(function(a, b){
            return a + b.decksQuantity;
        }, 0);

        DecksNames.update({_id : deckName._id, "DecksNames._id" : obj._id},
            {$set : {"DecksNames.$.percentage" : (sum/deckName.decks)/nonLandsCards.length}}
        )
        deckPercentages.push([obj._id, (sum/deckName.decks)/nonLandsCards.length]);
        deckPercentages.sort(function(a,b){
            return b[1] - a[1];
        })
    });
    return  deckPercentages;
};