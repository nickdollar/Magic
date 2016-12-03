Meteor.methods({
    //CREATE NEW
    createNewDecksArchetype: function (form) {
        var queryCheck = DecksArchetypes.find({format: form.format, name: {$regex: new RegExp("^" + form.name + "$", 'i')}});

        console.log(queryCheck.fetch());
        if (queryCheck.count()) {
            return false;
        }
        form.name = deckNameAndArchetype(form.name);
        console.log(form.name);
        DecksArchetypes.insert(form);
    },
    createNewDecksNames : function(form){
        var queryCheck = DecksNames.find({format : form.format, name : {$regex : new RegExp(form.name, 'i')}});

        if(queryCheck.count()){
            return false;
        }
        form.name = deckNameAndArchetype(form.name);

        console.log(form);
        DecksNames.insert(form);
    },
    createCardsFullData : function(){
        createCardsFullData();
    }
})




createCardsFullData = function(){
    console.log("START: createCardsFullData");
    CardsFullData.remove({});


    var cardFromFile = JSON.parse(Assets.getText('AllCards.json'));

    for (var key in cardFromFile) {

        var card = clone(cardFromFile[key]);

        if(card.hasOwnProperty('name')){
            card.name = fixCards(card.name.replace("\xC6", "Ae"));
        }

        if(card.hasOwnProperty('type')){
            card.type = card.type.replace("�", "-");
        }

        CardsFullData.update({name : card.name},
            {$set : card},
            {upsert : true}
        );
    }
    console.log("END: createCardsFullData");
}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}