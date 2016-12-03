Template.AdminMetaCardsNew.onCreated(function(){
    this.options = new ReactiveDict();
    this.options.set("format", 'standard');
});

Template.AdminMetaCardsNew.events({
    'click .js-updateMetaCards' : function(evt, tmp){
        Meteor.call("updateMetaCards", tmp.options.get("format"));
    },
    'change input[name="format"]' : function(evt, tmp){
        tmp.options.set("format", $(evt.target).attr("value"));
    }
});