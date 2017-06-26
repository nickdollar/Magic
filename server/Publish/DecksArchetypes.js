Meteor.publish('DecksArchetypesGlobal', function() {
    return DecksArchetypes.find({}, {fields : {
        name : 1,
        Formats_id : 1,
        type : 1,
        colors : 1,
        "mainCards.name" : 1,
        link : 1,
        decksQty : 1
    }});
});

Meteor.publish('DecksArchetypesFormat', function({Formats_id}) {
    return DecksArchetypes.find({Formats_id : Formats_id});
});