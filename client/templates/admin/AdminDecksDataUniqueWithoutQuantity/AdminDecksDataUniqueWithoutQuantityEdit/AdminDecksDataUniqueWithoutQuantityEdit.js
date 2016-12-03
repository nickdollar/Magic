Template.AdminDecksDataUniqueWithoutQuantityEdit.onCreated(function(){
    this.subscribe("DecksNames");
})

Template.AdminDecksDataUniqueWithoutQuantityEdit.helpers({
    DecksDataUniqueWithoutQuantitySchema : function(){
        return Schemas.DecksDataUniqueWithoutQuantity;
    },
    documentValue : function() {
        return DecksDataUniqueWithoutQuantity.findOne({_id : FlowRouter.getParam("_id")});
    },
    cards : function(){
        return DecksDataUniqueWithoutQuantity.findOne({_id : FlowRouter.getParam("_id")}).nonLandMain;
    }
})