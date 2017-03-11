Meteor.publish('DecksArchetypesFormatNotReactive', function(format) {

    return DecksArchetypes.find({});
    var DecksArchetypes_idQuery = DecksNames.find({format : format, DecksArchetypes_id : {$ne : null}, decks : {$gt : 0}}).map(function(obj){
        return obj.DecksArchetypes_id;
    });

    return DecksArchetypes.find({_id : {$in : DecksArchetypes_idQuery}}, {reactive : false});
});

Meteor.publish('DecksArchetypesGlobal', function() {
    return DecksArchetypes.find({});
});

Meteor.publish('DecksArchetypesFormat', function(format) {
    return DecksArchetypes.find({format : format});
});

Meteor.publish('DecksArchetypesQueryProjection', function(query, projection) {
    return DecksArchetypes.find(query, projection);
});

Meteor.publish('testDecksArchetypes', function(format, weeksSpan, types) {
    return DecksArchetypes.find({ format : format });
});

Meteor.publish("DecksArchetypes", function(){
    return DecksArchetypes.find();
});

Meteor.publish("DecksArchetypesNameRegex", function(format, DecksArchetypes_name){
    var DecksArchetypesRegex = new RegExp("^" + DecksArchetypes_name.replace(/[-']/g, ".") + "$", "i");

    return DecksArchetypes.find({format : format, name : {$regex : DecksArchetypesRegex}}, {limit : 1})
});

Meteor.publish("DecksNamesList_DecksArchetypesNameRegex", function(format, DecksArchetypes){
    var DecksArchetypesRegex = new RegExp("^" + DecksArchetypes.replace(/[-']/g, ".") + "$", "i");
    return DecksNames.find({format : format, name : {$regex : DecksArchetypesRegex}}, {limit : 1})
});

Meteor.publish("DecksArchetypesMainPage", function(){
    return DecksArchetypes.find({}, {fields : {name : 1}});
});

Meteor.publish('DecksArchetypesByNameRegexLimit', function(format, name) {
    return DecksArchetypes.find({ format : format, name : {$regex : new RegExp(name, "i")}}, {limit : 1});
});

Meteor.publishComposite("deckSelectedArchetypesAndDecksNames", function(format, archetypeName) {
    return {
        find: function () {
            return DecksArchetypes.find({name: {$regex : archetypeName}, format : format});
        },
        children: [
            {
                find: function (deckArchetype) {
                    return DecksNames.find({DecksArchetypes_id : deckArchetype._id});
                }
            }
        ]
    }
});