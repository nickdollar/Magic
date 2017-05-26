
Meteor.methods({
    getUsersDecksFromUser({}) {
        return UsersDecks.find({Users_id : Meteor.userId()}, {fields : {sideboard : 0, main : 0}}).fetch();
    },
    addNewDeckToUsersDecksMethod({Formats_id, name}) {
        UsersDecks.insert({Users_id : Meteor.userId(), Formats_id : Formats_id, name : name, main : [], sideboard : []});
        return {confirm : true};
    },
    updateUsersDecksMethod({UsersDecks_id, main, sideboard, name}) {
        UsersDecks.update({Users_id : Meteor.userId(), _id : UsersDecks_id},
            {
                $set : {main : main, sideboard : sideboard, name : name}
            });
        return {confirm : true};
    },
    RemoveDeckMethod({UsersDeck_id}){
        UsersDecks.remove({_id : UsersDeck_id, Users_id : Meteor.userId()});
        return {confirm : true};
    },

    getUsersDecksWithCardsInformationMethod({UsersDecks_id}){
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
                        cards : {
                            $setUnion :
                                [
                                    {$map : {input : "$main", as : "main", in : "$$main._id"}},
                                    {$map : {input : "$sideboard", as : "sideboard", in : "$$sideboard._id"}}
                                ]
                        }
                    }
                },
                {
                    $unwind: {
                        path : "$cards",
                        preserveNullAndEmptyArrays : true
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
                        name : {$first : "$name"},
                        main : {$first : "$main"},
                        sideboard : {$first : "$sideboard"},
                        cardsInfo : {$push : {$arrayElemAt : ["$cardsInfo", 0]}}
                    }
                }
            ]
        );
        return deck[0];
    },

})