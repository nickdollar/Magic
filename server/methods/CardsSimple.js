Meteor.methods({
   UpdateCardsSimpleMethod(){
       logFunctionsStart("UpdateCardsSimple");
        UpdateCardsSimple();
       logFunctionsEnd("UpdateCardsSimple");
   },
    getCardsBy_idMethod({CardsSimple_id}){
       console.log(CardsSimple_id);
       var foundCard = CardsSimple.find({_id : new RegExp(`^${CardsSimple_id}$`, "i")}, {limit : 1});
       if(foundCard.count()){
           return foundCard.fetch()[0];
       }
       return {_id : CardsSimple_id}
    },
    getListByRegex({value}){
        return CardsSimple.find({_id : new RegExp(`^${value}`, "i")}, {limit : 5, fields : {_id : 1}}).fetch();
    },
    getCardsFromArrayMethod({cardsArray}){
       var arrayRegex = [];
       cardsArray.forEach((card)=>{
           arrayRegex.push(new RegExp(`^${card}$`, "i"));
       });
       return CardsSimple.find({_id : {$in : arrayRegex}}).fetch();
    }
})


UpdateCardsSimple = ()=>{
    logFunctionsStart("UpdateCardsSimple");
    Cards.find({}).forEach((card)=>{
        var data = {};
        card.layout ? data.layout =     card.layout :   null;
        card.types ? data.types =      card.types :    null;
        card.manaCost ? data.manaCost =   card.manaCost : null;
        card.names ? data.names =   card.names : null;
        card.avgPrice ? data.avgPrice = card.avgPrice : null;

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
}