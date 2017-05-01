Meteor.methods({
   UpdateCardsSimple(){
        logFunctionsStart("UpdateCardsSimple");

        Cards.find({}).forEach((card)=>{
            var data = {};
            card.layout ? data.layout =     card.layout :   null;
            card.types ? data.types =      card.types :    null;
            card.manaCost ? data.manaCost =   card.manaCost : null;

            if(!isObjectEmpty(data)){
                CardsSimple.update({_id : card._id},
                    {
                        $set : data,

                    },
                    {upsert : true}
                )
            }
        })
       logFunctionsEnd("UpdateCardsSimple");
   },
    getCardsBy_id({getCardsBy_id : _id}){
       return CardsSimple.find({_id : _id}).fetch()[0];
    }
})