Meteor.publish("DecksNames", function(){
    return DecksNames.find({});
});

Meteor.publish("DecksNamesByFormat", function(Formats_id){
    return DecksNames.find({Formats_id : Formats_id, DecksArchetypes_id : {$ne : null}});
});


Meteor.publish("DecksNamesGlobal", function(){
    return DecksNames.find({}, {fields : {DecksData : 0}});
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