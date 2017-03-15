Meteor.methods({
    methodsCardsData(){
        makeCardsData()
    },
    getAutoComplete(term){
        var regex = new RegExp("^" + term.term, "i");
        return CardsData.find({name : {$regex : regex}}, {limit : 6, fields : {name : 1}}).fetch();
    },
    getAutoCompleteComplete(value){
        var regex = new RegExp("^" + value, "i");

        var suggestions = [];
        CardsFullData.find({name : {$regex : regex}}, {limit : 6, fields : {name : 1, printings : 1}}).forEach((obj)=>{
            obj.printings.forEach((printing)=>{
                var setObj = MTGSets.find({code : printing}, {limit : 1}).fetch()[0];
                if(setObj){
                    suggestions.push({name : obj.name, setName : setObj.name, printing : printing});
                }
            })
        });

        return suggestions;
    }
});