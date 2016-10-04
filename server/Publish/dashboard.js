Meteor.publish('notCompleteEvent', function(){
    return Events.find({}, {sort : {date : 1}});
});

Meteor.publish('_temp2FieldsName_eventID', function(){
    return DecksData.find({}, {fields : {name : 1, events_id : 1}});
});

Meteor.publish("DecksData", function(){
    return DecksData.find({});
});

Meteor.publish("DecksNames", function(){
    return DecksNames.find({});
});

Meteor.publish("_temp2", function(){
    return DecksData.find();
});

Meteor.publish("DecksArchetypes", function(){
    return DecksArchetypes.find();
});


Meteor.publish("_temp3ReturnFromID", function(_id){
    return DecksNames.find({_id : _id});
});

Meteor.publish("DecksNamesWithoutArchetype", function(){
    return DecksNames.find({$or :[{DecksArchetypes_id : {$exists : false}}, {DecksArchetypes_id : null}]});
});


Meteor.publishComposite("deckSelectedID", function(_id) {
    return {
        find: function () {
            return DecksData.find({_id : _id});
        },
        children: [
            {
                // collectionName: "selectNamesCards",
                find: function (deck) {
                    var cards = deck.main.map(function(obj){
                        return obj.name;
                    });

                    cards.push.apply(cards, deck.sideboard.map(function(obj){
                        return obj.name;
                    }));
                    return _CardDatabase.find({name : {$in : cards}});
                }
            }
        ]
    }
});