Template.AdminMetaNewestNew.onCreated(function(){
    this.options = new ReactiveDict("format");
})

Template.AdminMetaNewestNew.events({
    "click .js-updateMetaNewestNew" : function(evt, tmp){
        Meteor.call("createMetaNewest", tmp.options.get("format"));
    },
    "click .js-updateMetaNewestDaysNewAllFormats" : function(){
        Meteor.call("createMetaNewThingsDaysAllFormats");
    },
    'change input[name="format"]' : function(evt, tmp){
        tmp.options.set("format", $(evt.target).attr("value"));
    },
});