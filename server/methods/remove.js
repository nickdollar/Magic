Meteor.methods({
    archetypeDelete : function(_id){
        var decksNames_id = DecksNames.find({DecksArchetypes_id : _id}).map(function(decksNamesObj){
            return decksNamesObj._id
        });
        DecksData.update({DecksNames_id : {$in : decksNames_id}},
            {
                $unset : {DecksNames_id : _id}
            }
        );

        DecksDataUniqueWithoutQty.update({DecksNames_id : {$in : decksNames_id}},
            {
                $unset : {DecksNames_id : _id}
            }
        );

        DecksNames.remove({DecksArchetypes_id : _id});


        DecksArchetypes.remove({_id : _id});
    },
    eventDelete : function(_id){
        DecksData.remove({Events_id : _id});
        Events.remove({_id : _id});
        EventsHtmls.remove({Events_id : _id});

    },
    decksNamesDelete : function(_id){
        DecksData.update({DecksNames_id : _id},
            {
                $unset : {DecksNames_id : _id}
            }
        );

        DecksDataUniqueWithoutQty.update({DecksNames_id : _id},
            {
                $unset : {DecksNames_id : _id}
            }
        );
        DecksNames.remove({_id : _id});
    },


});