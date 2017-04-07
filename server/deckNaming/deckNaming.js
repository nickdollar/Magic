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
    var deckData = DecksData.find({_id : DecksData_id}, {limit : 1}).fetch()[0];

    if(!deckData.DecksNames_id){
        return;
    }
    DecksData.update({_id : deckData._id},
        {$unset : {DecksNames_id : ""}}
    );
    checkIfEventIsComplete(deckData.Events_id);

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


addNameToDeck = function(DecksData_id, DecksNames_id){
    var deckData = DecksData.find({_id : DecksData_id}, {limit : 1}).fetch()[0];
    var deckName = DecksNames.find({_id : DecksNames_id}, {limit : 1}).fetch()[0];
    DecksData.update(  {_id : deckData._id},
                    {$set : {DecksNames_id : deckName._id}}
    );
    checkIfEventIsComplete(deckData.Events_id);
};

checkIfEventIsComplete = function(Events_id){
    var decksDataWithNameQuery = DecksData.find({Events_id : Events_id, DecksNames_id : {$exists : true}}).count();
    var decksDataTotalQuery = DecksData.find({Events_id : Events_id}).count();

    if(decksDataWithNameQuery == decksDataTotalQuery){
        Events.update({_id : Events_id},
            {
                $set : { state : "names"}
            }
        );
    }
    
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

findDeckComparison2 = function(_id){
    var cardsOnMain = [];
    deck.main.forEach(function(obj){
        cardsOnMain.push(obj.name)
    });

    var nonLandsCards = CardsData.find({name : {$in : cardsOnMain}, land : false}).map(function(obj){
        return obj.name;
    });

    var foundDeck = DecksDataUniqueWithoutQuantity.findOne({format : deck.format, nonLandMain : {$size : nonLandsCards.length, $all : nonLandsCards}});


    if(foundDeck){
        if(foundDeck.DecksNames_id){
            return [{DecksNames_id : foundDeck.DecksNames_id, name : DecksNames.findOne({_id : foundDeck.DecksNames_id}).name, result  : 1}];
        }
    }
}

giveNamesToAllDecksScraped = function({_id}){
    var cardsOnMain = DecksData.aggregate(
        [
            {$match: {_id : _id}},
            {$project: {format : "$format", card :{$map : {input : "$main", as: "el", in : "$$el.name"}}}}
        ]
    );
    var nonLandsCards = CardsData.find({name: {$in: cardsOnMain[0].card}, land: false}).map(function (obj) {
        return obj.name;
    });

    var foundDeck = DecksDataUniqueWithoutQuantity.find({format : cardsOnMain[0].format, nonLandMain : {$size : nonLandsCards.length, $all : nonLandsCards}}, {limit : 1}).fetch()[0];

    if(foundDeck){
        DecksData.update({_id : _id},
            {
                $set : {DecksNames_id : foundDeck.DecksNames_id, state : "perfect"}
            })
    }
}

findDeckComparison = function(_id){
    var template = foundDeckFromDecksDataUniqueWithoutQuantity(_id);
    if(template){
        return [{DecksNames_id : template.DecksNames_id, name : DecksNames.findOne({_id : template.DecksNames_id}).name, result  : 1}];
    }

    return [];
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
    var deckNameDeckCardsNonLands = CardsData.find({name : {$in : deckNameDeckCards}, land : false}).map(function(obj){
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
    DecksData.find({DecksNames_id : deckName._id, autoNaming : {$ne : true}}).forEach(function(obj){

        var deckCards = obj.main.map(function(obj){
            return obj.name;
        });

        var nonLandsCards = CardsData.find({name : {$in : deckCards}, land : false}).map(function(obj){
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