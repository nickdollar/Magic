Meteor.publish('LGSByLocationDistance', function(location, distance){
    if(!location && !distance){
        LGS.find({}, {limit : 0});
    }
    return LGS.find({"location.coords" : {$geoWithin : {$centerSphere: [location, distance / 3963.2]}}})
});

Meteor.publish('LGSStatesList', function(notState){
    return LGS.find({state : {$nin : notState}}, {fields : {state : 1}});
});

Meteor.publish('LGSByDistanceToAddEvent', function(location, distance){
    console.log(location, distance);
    if(!location && !distance){
        LGS.find({}, {limit : 0});
    }
    return LGS.find({"location.coords" : {$geoWithin : {$centerSphere: [location, distance / 3963.2]}}})
});