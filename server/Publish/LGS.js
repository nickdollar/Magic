Meteor.publish('LGSByLocationDistance', function(location, distance, positionOption, state, ZIP){
    if(positionOption == "state" && state !="" && state){
        return LGS.find({state : "confirmed", "location.state" : state});
    }else if(positionOption == "ZIP" && ZIP != '' && ZIP){
        distance = parseInt(distance);
        ZIP = parseInt(ZIP);
        var zipInfo = ZipCodes.findOne({ZIP : ZIP});
        return LGS.find({state : "confirmed", "location.coords" : {$geoWithin : {$centerSphere: [[zipInfo.LNG, zipInfo.LAT], distance / 3963.2]}}})
    }else if(positionOption == "GPS" ){
        distance = parseInt(distance);
        if(!location || !distance){
            return LGS.find({state : "nothing"});
        }
        return LGS.find({state : "confirmed", "location.coords" : {$geoWithin : {$centerSphere: [location, distance / 3963.2]}}})
    }
    return LGS.find({state : "nothing"});
});

Meteor.publish('LGSStatesList', function(notState){
    return LGS.find({state : {$nin : notState}}, {fields : {state : 1}});
});

Meteor.publish('LGSState', function(state){
    return LGS.find({state : state});
});

Meteor.publish('LGSByDistanceToAddEvent', function(location, distance){
    if(!location && !distance){
        LGS.find({}, {limit : 0});
    }
    return LGS.find({state : "confirmed", "location.coords" : {$geoWithin : {$centerSphere: [location, distance / 3963.2]}}})
});