Meteor.methods({
    methodsCardsData(){
        makeCardsData()
    },
    getAutoComplete(term){
        console.log(term);
        var regex = new RegExp("^" + term.term, "i");
        return CardsData.find({name : {$regex : regex}}, {limit : 6, fields : {name : 1}}).fetch();
    }
});