Template.AdminDecksDataUniqueWithoutQuantityEditNoName.onCreated(function(){
    this.options = new ReactiveDict();
    this.options.set("format", 'standard');
    this.selectedDeck = new ReactiveVar();
    var that = this;
    this.autorun(function(){
        that.subscribe("DecksDataUniqueWithoutQuantity-_id", that.selectedDeck.get());
    })


    
});

Template.AdminDecksDataUniqueWithoutQuantityEditNoName.helpers({
    selector : function(){
       return {format : Template.instance().options.get("format")}
    },
    cards : function(){
        if(DecksDataUniqueWithoutQuantity.findOne({_id : Template.instance().selectedDeck.get()})){
            return DecksDataUniqueWithoutQuantity.findOne({_id : Template.instance().selectedDeck.get()}).nonLandMain;
        }
    },
    DecksDataUniqueWithoutQuantitySchema : function(){
        return Schemas.DecksDataUniqueWithoutQuantity;
    },
    documentValue : function() {
        return DecksDataUniqueWithoutQuantity.findOne({_id : Template.instance().selectedDeck.get()});
    },
})

Template.AdminDecksDataUniqueWithoutQuantityEditNoName.events({
    "click .js-addOldEventsModern" : function(evt, tmp){
        Meteor.call("methodEventLeagueGetInfoOld", tmp.options.get("format"));
    },
    'change input[name="format"]' : function(evt, tmp){
        tmp.options.set("format", $(evt.target).attr("value"));
    },
    "click .js-selectID" : function(evt,tmp){
        tmp.selectedDeck.set($(evt.target).html());
    },
    "click .js-fixAllThings" : function(evt, tmp){
        Meteor.call("fixAllEvents", tmp.options.get("format"));
    },
    "click .js-fixOldEvents" : function(evt, tmp){
        Meteor.call("fixOldEvents", tmp.options.get("format"));
    }
})