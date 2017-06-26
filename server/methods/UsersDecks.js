import moment from "moment";


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
    addDeckToRecordMethod({UsersDeck_id, deckName}){
        console.log(UsersDecks.update({_id : UsersDeck_id, Users_id : Meteor.userId(), "decks.name" : {$ne : deckName}},
            {
                $push : {decks : {name : deckName}}
            }))
    },
    importDeckMethod({DecksData_id, UsersDeck}){
        if(!Meteor.userId()){ return false; }
        if(UsersDeck){
            var foundDeck = UsersDecks.find({_id :  DecksData_id}, {limit : 1}).fetch()[0];
        }else{
            var foundDeck = DecksData.find({_id :  DecksData_id}, {limit : 1}).fetch()[0];
            var foundArchetype = DecksArchetypes.find({_id : foundDeck.DecksArchetypes_id}, {limit : 1}).fetch()[0];
        }

        var insertObject = {};
        insertObject.Users_id = Meteor.userId();
        insertObject.Formats_id = foundDeck.Formats_id;

        if(UsersDeck){
            insertObject.name = `${foundDeck.name} - ${moment(new Date).format("MM-DD")}`;
        }else{
            insertObject.name = `${foundArchetype.name} - ${foundDeck.player} ${moment(foundDeck.date).format("MM-DD")}`;
        }

        var name = "name";
        if(UsersDeck){
            name = "_id";
        }

        insertObject.main = foundDeck.main.map((card)=>{
            return {_id : card[name], qty : card.qty}
        });
        insertObject.sideboard = foundDeck.sideboard.map((card)=>{
            return {_id : card[name], qty : card.qty}
        });

        UsersDecks.insert(insertObject);
        return true;
    },
    getUserDecksMethod({Formats_id}){
        return UsersDecks.find({Users_id : Meteor.userId(), Formats_id : Formats_id}, {fields : {_id : 1, name : 1}}).fetch();
    },
    getUserDeckWithInfoMethod({UsersDecks_id}){

        var deckAggregate = UsersDecks.aggregate(
            [
                {$match : {_id : UsersDecks_id}},
                {
                    $project: {
                        main: {
                            $map: {
                                input: "$main",
                                as: "element",
                                in: {name: "$$element._id", qty: "$$element.qty"}
                            }
                        },

                        sideboard: {
                            $map: {
                                input: "$sideboard",
                                as: "element",
                                in: {name: "$$element._id", qty: "$$element.qty"}
                            }
                        }
                    },
                }
            ]
        )
        return deckAggregate[0];
    },
    getUsersDecksWithCardsInformationMethod({UsersDecks_id}){
        var UsersDeck = UsersDecks.find({_id : UsersDecks_id}, {limit : 1}).fetch()[0];
        var deckWithInfo = UsersDecks.aggregate(
            [
                {
                    $match: {
                        _id : UsersDecks_id, Users_id : Meteor.userId()
                    }
                },
                {
                    $project: {
                        cards : {
                            $setUnion :
                                [
                                    {$map : {input : "$main", as : "main", in : "$$main.Cards_id"}},
                                    {$map : {input : "$sideboard", as : "sideboard", in : "$$sideboard.Cards_id"}}
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
                        cardsInfo : {$push : {$arrayElemAt : ["$cardsInfo", 0]}}
                    }
                }
            ]
        );
        Object.assign(UsersDeck, deckWithInfo[0]);
        return UsersDeck;
    },
    getAUsersDecksWithCardsInformationMethod({UsersDecks_id}){
        var foundDeck = UsersDecks.find({_id : UsersDecks_id, public : true}, {limit : 1, fields : {Users_id : 0}}).fetch();
        if(!foundDeck.length){return null;}

        var UsersDeck = foundDeck[0];

        var deckWithInfo = UsersDecks.aggregate(
            [
                {
                    $match: {
                        _id : UsersDecks_id
                    }
                },
                {
                    $project: {
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
                        cardsInfo : {$push : {$arrayElemAt : ["$cardsInfo", 0]}}
                    }
                }
            ]
        );


        if(!deckWithInfo.length){
            return [];
        }
        Object.assign(UsersDeck, deckWithInfo[0]);
        return UsersDeck;
    },
    removeDeckMethod({name, UsersDecks_id}){
        console.log(UsersDecks.update({_id : UsersDecks_id, Users_id : Meteor.userId()},
            {
                $pull : {decks : {name : name}}
            }))
    },
    updateUsersDecksVictoriesLosses({UsersDecks_id, value, name, valueQty}){

        var updateOption = {};
        updateOption[`decks.$.${value}`] = valueQty;

        UsersDecks.update({_id : UsersDecks_id, Users_id : Meteor.userId(), "decks.name" : name},
            {
                $set : updateOption
            })

    },
    makePublicMethod({UsersDecks_id, makePublic}){
        UsersDecks.update({_id : UsersDecks_id, Users_id : Meteor.userId()},
            {
                $set : {public : makePublic}
            })

    },
    makeDeckListFromImport({file, type}){
        return 'AAAAAAAAAA';

    }
})