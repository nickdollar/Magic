Meteor.methods({

    getCards : function(){
        console.log("Helloooooooo");
        console.log(_DeckCards.find().count() + " HElllllllllllll");
        console.log(_DeckCards.find().count() + " HElllllllllllll");
        console.log(_DeckCards.find().count() + " HElllllllllllll");
        console.log(_DeckCards.find().count() + " HElllllllllllll");
        console.log(_DeckCards.find().count() + " HElllllllllllll");

        return _DeckCards.find().count();
    }

});