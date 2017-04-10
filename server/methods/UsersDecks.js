
Meteor.methods({
    getUsersDecksFromUser({format}) {
        return UsersDecks.find({Users_id : Meteor.userId()}, {fields : {sideboard : 0, main : 0}}).fetch();
    },
    addNewDeckToUsersDecksMethod({Formats_id, name}) {
        UsersDecks.insert({Users_id : Meteor.userId(), Formats_id : Formats_id, name : name, main : [], sideboard : []});
        return true;
    },
    updateUsersDecks({UsersDecks_id, main, sideboard, name}) {
        UsersDecks.update({Users_id : Meteor.userId(), _id : UsersDecks_id},
            {
                $set : {main : main, sideboard : sideboard, name : name}
            });
        return true;
    },
    getUsersDeckBy_id(UsersDecks_id) {
        var deckAggregate = UsersDecks.aggregate(
            [
                {$match: {_id : UsersDecks_id}},
                {$project: {
                        card : {"$setUnion" :
                            [
                                {$map : {input : "$main", as: "el", in : {name : "$$el.name", qty : "$$el.quantity", class : {"$const" : "main"}}}},
                                {$map : { input : "$sideboard", as: "el", in : { name : "$$el.name", qty : "$$el.quantity", class : {"$const" : "sideboard"}}}}
                            ]
                        }

                    }
                },
                {$unwind: {path : "$card"}},
                {
                    $lookup: {
                        "from" : "CardDatabase",
                        "localField" : "card.name",
                        "foreignField" : "name",
                        "as" : "info"
                    }
                },
                {$unwind: {path : "$info"}},
                {$project: {
                        _id : "$card.class",
                        "info.qty" : "$card.qty",
                        "info.name" : "$card.name",
                        "info.layout" : "$info.layout",
                        "info.artifact" : "$info.artifact",
                        "info.creature" : "$info.creature",
                        "info.enchantment" : "$info.enchantment",
                        "info.instant" : "$info.instant",
                        "info.land" : "$info.land",
                        "info.planeswalker" : "$info.planeswalker",
                        "info.sorcery" : "$info.sorcery",
                        "info.tribal" : "$info.tribal",
                        "info.manaCost" : "$info.manaCost"
                    }
                },
                {$group: {_id : "$_id", cards : {$addToSet : "$info"}}},
            ]
        );
        var object = {};
        for(var i = 0; i < deckAggregate.length; i++) {
            object[deckAggregate[i]._id] = deckAggregate[i].cards;
        }

        return object;
    },
    getUsersDecksWithCardsInformation({UsersDecks_id}){
        var deck = UsersDecks.aggregate(
            [
                {
                    $match: {
                        _id : UsersDecks_id, Users_id : Meteor.userId()
                    }
                },
                {
                    $project: {
                        name : 1,
                        format : 1,
                        main : 1,
                        sideboard : 1,
                        cards : {
                            $setUnion :
                                [
                                    {$map : {input : "$main", as : "main", in : "$$main.name"}},
                                    {$map : {input : "$sideboard", as : "sideboard", in : "$$sideboard.name"}}
                                ]
                        }
                    }
                },
                {
                    $unwind: {
                        path : "$cards"
                    }
                },
                {
                    $lookup: {
                        "from" : "CardsCollectionSimplified",
                        "localField" : "cards",
                        "foreignField" : "name",
                        "as" : "cardsInfo"
                    }
                },
                {
                    $group: {
                        _id : "$_id",
                        format : {$first : "$name"},
                        name : {$first : "$name"},
                        DecksNames_id : {$first : "$DecksNames_id"},
                        main : {$first : "$main"},
                        sideboard : {$first : "$sideboard"},
                        cardsInfo : {$push : {$arrayElemAt : ["$cardsInfo", 0]}}
                    }
                }
            ]
        );

        if(deck.length == 0){
            return UsersDecks.find({ _id : UsersDecks_id, Users_id : Meteor.userId()}).fetch()[0];
        }
        return deck[0];
    }
})