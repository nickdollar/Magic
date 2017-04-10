Meteor.methods({
    MakeMTGSets: function () {
       MakeMTGSets();
    },
    MTGSetsCountFromFile: function () {
        logFunctionsStart("makeCardsData");
        MTGSetsCountFromFile();
    }
})

MTGSetsCountFromFile = ()=> {
    logFunctionsStart("makeCardsData");
    var myobject = JSON.parse(Assets.getText('AllSets-x.json'));
    var count = 0;

    for (var key in myobject) {
        count++
    }
    return count;
}

MakeMTGSets = ()=>{
    logFunctionsStart("makeCardsData");
    var myobject = JSON.parse(Assets.getText('AllSets-x.json'));
    MTGSets.remove({});
    for (var key in myobject) {
        var data =  Object.assign({}, myobject[key]);
        MTGSets.insert(data);
    }
}