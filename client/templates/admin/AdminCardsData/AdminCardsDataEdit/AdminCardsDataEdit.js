Template.AdminCardsDataEdit.helpers({
    DecksCards : function(){
        console.log("FFFFFFFFFFFFFFF");
        console.log(Schemas.CardsData);
        return Schemas.CardsData;
    },
    documentValue : function(){
        return CardsData.findOne({_id : Router.current().params._id});
    }
});