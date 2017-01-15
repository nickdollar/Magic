Meteor.publish('LGSByLocationDistance', function(location, distance){
    if(!location && !distance){
        LGS.find({}, {limit : 0});
    }
    return LGS.find({"location.coords" : {$geoWithin : {$centerSphere: [location, distance / 3963.2]}}})
});
