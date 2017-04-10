Meteor.methods({
    MethodMakeZipCollection(){
        makeZipCollection();
    },
    checkIfZipExists(ZIP){
        ZIP = parseInt(ZIP);
        return ZipCodes.find({ZIP : ZIP}, {limit : 1}).fetch()[0];
    }
})


checkIfZipNeedsFixing = ()=>{
    logFunctionsStart("checkIfNeedNewZip" )
    var fs = Npm.require('fs');

    var data =  Assets.getText("zipCodes.txt");

    var lines = data.split('\n');
    logFunctionsEnd("checkIfZipNeedsFixing")

    return lines.length - 1;
}

makeZipCollection = function(){
    logFunctionsStart("makeZipCollection")
    ZipCodes.remove({});
    var fs = Npm.require('fs');

    var data = Assets.getText("zipCodes.txt");
    var lines = data.split('\n');
    var zips = [];
    for(var i = 1; i < lines.length; i++){
        var values = lines[i].split(",");
        var line  = {ZIP : parseInt(values[0]), LAT : parseFloat(values[1]),LNG : parseFloat(values[2])}
        ZipCodes.insert(line);
    }
    logFunctionsEnd("makeZipCollection");
}