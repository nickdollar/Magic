Meteor.methods({
    MethodMakeZipCollection(){
        makeZipCollection();
    },
    checkIfZipExists(ZIP){
        ZIP = parseInt(ZIP);
        return ZipCodes.findOne({ZIP : ZIP}, {limit : 1});

    }
})


checkIfZipNeedsFixing = ()=>{
    console.log("START: checkIfNeedNewZip" )
    var fs = Npm.require('fs');

    var data =  Assets.getText("zipCodes.txt");

    var lines = data.split('\n');
    console.log("   END: checkIfZipNeedsFixing")

    return lines.length - 1;
}

makeZipCollection = function(){
    console.log("START: makeZipCollection")
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
    console.log("   END: makeZipCollection");
}