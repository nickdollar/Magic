Template.AdminDecksDataViewAllDecksNamesName.helpers({
    name : function(){
        if(DecksNames.findOne({_id : this.doc.DecksNames_id})){
            return DecksNames.findOne({_id : this.doc.DecksNames_id}).name;
        }
        return "no Name";
    }
});

