Template.AdminMetaNew.onCreated(function(){
    this.options = new ReactiveDict();
    this.options.set("format", 'standard');
});

Template.AdminMetaNew.events({
    "click .js-updateMeta" : function(evt, tmp){
        Meteor.call("createMeta", tmp.options.get("format"));
    },
    'change input[name="format"]' : function(evt, tmp){
        tmp.options.set("format", $(evt.target).attr("value"));
    }
});