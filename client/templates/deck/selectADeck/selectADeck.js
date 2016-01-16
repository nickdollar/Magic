Session.set("nameArche", "fff");



$.fn.exists = function () {
    return this.length !== 0;
}






Template.selectADeck.helpers({
   showType : function(){
       return true;
       return Session.get("nameArch") == "name" ? true : false;
   }
});

