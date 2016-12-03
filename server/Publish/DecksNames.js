Meteor.publish("_temp3ReturnFromID", function(_id){
    return DecksNames.find({_id : _id});
});

Meteor.publish("DecksNamesWithoutArchetype", function(){
    return DecksNames.find({$or :[{DecksArchetypes_id : {$exists : false}}, {DecksArchetypes_id : null}]});
});

Meteor.publish('DecksNamesById', function(DecksNames_id) {
    return DecksNames.find({_id : DecksNames_id});
});

Meteor.publish("DecksNames", function(){
    return DecksNames.find({});
});

Meteor.publish("DecksNamesGlobal", function(){
    return DecksNames.find({}, {fields : {DecksData : 0, main : 0}});
});

Meteor.publish("DecksNamesFormatNotReactive", function(format){
    return DecksNames.find({format : format, DecksArchetypes_id : {$ne : null}, decks : {$gt : 0}}, {reactive : false});
});

Meteor.publish("DecksNamesMain", function(){
    return DecksNames.find({}, {fields : {name : 1, DecksArchetypes_id : 1}});
});

Meteor.publish('deckSelectedSelectedName', function(format, name){
    format = format.replace(/-/g, ".");
    name = name.replace(/-/g, ".");
    var nameRegex = new RegExp(name, "g");
    console.log(nameRegex);
    return DecksNames.find({format : format, name : {$regex : nameRegex}});
});

Meteor.publish('DecksNamesByArchetypeNameRegex', function(format, archetypeName) {
    console.log("PUBLISH: DecksNamesByArchetypeNameRegex")
    var deckArchetype = DecksArchetypes.findOne({format : format, name : {$regex : new RegExp(archetypeName, "i")}});
    return DecksNames.find({format : format, decks : {$gt : 0}, DecksArchetypes_id : deckArchetype._id, decks : {$gte : 0}});
});

Meteor.publish('DecksNamesFormatDecksArchetypes_idExistsNonReactive', function(format) {
    return DecksNames.find({format : format, DecksArchetypes_id : {$exists : true}}, {fields : {name : 1, DecksArchetypes_id : 1, colors : 1, type : 1}, reactive : false});
});

Meteor.publish('returnDecksNamesFromEvents', function(Events_id) {
    var that = this;

    DecksData.aggregate([
        {
            $match : {
                Events_id : Events_id
            }
        },
        {
            $group : {
                _id : "$DecksNames_id"
            }
        },
        {
            $lookup : {
                "from" : "DecksNames",
                "localField" : "_id",
                "foreignField" : "_id",
                "as" : "name"
            }
        },
        {
            $unwind : "$name"
        },
        {
            $project : {
                _id : "$_id",
                name : "$name.name"
            }
        }
    ]).forEach(function(obj){
        that.added("DecksNames", obj._id, obj)
    });
});

Meteor.publishComposite("deckNamesDecksDataCardsData", function(_id) {
    return {
        find: function () {
            return DecksNames.find({_id}, {limit : 1});
        },
        children: [
            {
                find: function (decksNames) {
                    return DecksData.find({DecksNames_id : decksNames._id}, {sort : {date : 1}, limit : 1});
                },
                children : [
                    {
                        find : function(decksData){
                            var main = decksData.main.map(function(obj){
                                return obj.name;
                            });
                            var sideboard = decksData.sideboard.map(function(obj){
                                return obj.name;
                            });
                            var allCards = arrayUnique(main.concat(sideboard));

                            return CardsData.find({name: {$in : allCards}});
                        }
                    }
                ]
            }
        ]
    }
});