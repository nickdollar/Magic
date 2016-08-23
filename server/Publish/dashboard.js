Meteor.publish('notCompleteEvent', function(){
    return _temp.find({}, {sort : {date : 1}});
});

Meteor.publish('_temp2FieldsName', function(){
    return _temp2.find({}, {fields : {name : 1, _eventID : 1}});
});

Meteor.publish("deckNames", function(){
    return _temp3.find({});
});

Meteor.publishComposite("deckSelectedID", function(_id) {
    return {
        find: function () {
            return _temp2.find({_id : _id});
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