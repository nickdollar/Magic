import sizeof from "object-sizeof";

Meteor.methods({
    addCardToCollectionMethod: function ({name, setCode, foil, qty}) {
        addCardToCollection({name : name, setCode : setCode, foil : foil, qty : qty});
    },
    getCollectionCards(colorsMatch, sort, page, itemsCountPerPage){
        console.log(sizeof("a"));
        console.log(sizeof(12345));
        console.log(sizeof(UsersCollection.findOne({Users_id : Meteor.userId()})));


        var cards = UsersCollection.aggregate(
            [
                {$match: {cards : {$exists : true}, Users_id : Meteor.userId()}},
                {$unwind: {
                        path : "$cards",
                }},
                {$project: {
                        _id : "$cards.name",
                        setCode : "$cards.setCode",
                        foil : "$cards.foil",
                        qty : "$cards.qty",
                 }},
                {
                    $lookup: {
                        "from" : "CardsFullData",
                        "localField" : "_id",
                        "foreignField" : "name",
                        "as" : "card"
                    }
                },
                {
                    $unwind : "$card"
                },
                {$project: {
                    _id : 1,
                    setCode : 1,
                    foil : 1,
                    qty : 1,
                    colors : "$card.colorIdentity"
                }},
                {
                    $match : colorsMatch
                },
                {
                    $sort : sort
                },
            ]
        );

        var count = cards.length;
        var slice = cards.slice(itemsCountPerPage*page, itemsCountPerPage*(page + 1));
        if(count){
            return {qty : count, cards : slice};
        }
        return {qty : 0, cards : []};
    },
    importCollectionMethod(){
        importCollection();
    }
});

addCardToCollection = function({name, setCode, foil, qty}){

    UsersCollection.update({Users_id : Meteor.userId()},
        {
            $setOnInsert : {cards : [{name : name, setCode : setCode, foil : foil, qty : 0}]}
        },
        {
            upsert : true
        }
    )

    UsersCollection.update({Users_id : Meteor.userId(), $nor : [{$and : [ {"cards.name" : name}, {"cards.setCode" : setCode}, {"cards.foil" : foil}]}]},
        {
            $push : {cards : {name : name, setCode : setCode, foil : foil, qty : 0}}
        }
    )

    UsersCollection.update({Users_id : Meteor.userId(), cards : {$elemMatch : {name : name, setCode : setCode, foil : foil}}},
        {
            $inc : {"cards.$.qty" : qty}
        },
        {
            multi : true
        }
    )
}