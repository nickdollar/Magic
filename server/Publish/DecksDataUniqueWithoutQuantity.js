Meteor.publish('DecksDataUniqueWithoutQuantity-_id', function(_id) {
    return DecksDataUniqueWithoutQuantity.find({_id : _id});
});