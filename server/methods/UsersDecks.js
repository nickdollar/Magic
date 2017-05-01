
Meteor.methods({
    getUsersDecksFromUser({}) {
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
    RemoveDeck({UsersDeck_id}){
        return true;
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
                        Formats_id : 1,
                        main : 1,
                        sideboard : 1,
                        player : 1,
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
                        "from" : "CardsSimple",
                        "localField" : "cards",
                        "foreignField" : "_id",
                        "as" : "cardsInfo"
                    }
                },
                {
                    $group: {
                        _id : "$_id",
                        Formats_id : {$first : "$Formats_id"},
                        player : {$first : "$player"},
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
    },

})