Template.organizeArchetypes.onCreated(function(){
    var that = this;
    this.autorun(function(){
        that.subscribe("DecksArchetypes");
        that.subscribe("DecksNamesWithoutArchetype");
        that.subscribe("DecksNames");
    })

});

Template.organizeArchetypes.helpers({
    optionsArchetypes : function(){
        return DecksArchetypes.find().map(function(obj){
            return {label : obj.name, value : obj.name}
        });
    },
    schema : function(){
        return Schema.createArchetype;
    },
    optionsFormat : function(){
        return [{label : "modern", value : "modern"}, {label : "standard", value : "standard"}];
    },
    optionsTypes : function(){
        return [{label : "aggro", value : "Aggro"}, {label : "combo", value : "combo"}, {label: "control", value : "control"}];
    },
    optionsDefaultvalue : function(){
        // return [{label : "modern", value : "modern"}, {label : "standard", value : "standard"}];
        return "modern";
    },
    currentFieldValue2 : function(fieldName){
        return AutoForm.getFieldValue(fieldName, "createArchetype") || false;
    },
    archetypes : function(){
        return DecksArchetypes.find();
    },
    deckWithoutArchetype : function(){
        return DecksNames.find({$or :[{DecksArchetypes_id : {$exists : false}}, {DecksArchetypes_id : null}]});
    },
    giveArchetypeToDeckWithout : function(){
        return Schema.giveArchetypeToDeckWithout;
    },
    makeUniqueID : function(){
        return "update-each-" + this._id;
    },
    deckName : function(){
        
        var deckName = DecksNames.findOne({_id : this._id});
        
        console.log(deckName);
        console.log(this);

        return deckName && deckName.name;
    }
});

Template.organizeArchetypes.events({
    "click .js-removeNameFromDeck" : function(evt, tmp){
        console.log(this);

        Meteor.call("methodRemoveADeckNameFromArchetype", this);
    },
    "click .js-removeArchetype" : function(evt, tmp){
        console.log(this);
        Meteor.call("methodRemoveArchetype", this);
    }
})

if (typeof Schema === 'undefined' || Schema === null) {
    Schema = {};
}


Schema.giveArchetypeToDeckWithout = new SimpleSchema({
    archetypeName: {
        type: String,
        autoform: {
            type : "select",
            label : false,
            options : function(){
                return DecksArchetypes.find({}, {sort : {name : 1}}).map(function(obj){
                    return {label : obj.name, value : obj._id}
                });
            }
        }
    },
    deckNameID : {
        type: String
    }
});

Schema.createArchetype = new SimpleSchema({
    name: {
        type: String,
        autoform: {
            type : "text",
            label : "Archetype Name"
        }
    },
    format : {
        type : String,
        autoform : {
            type : "select-radio-inline",
            label : "Format"
        }

    },
    type : {
        type : String,
        autoform : {
            type : "select-radio-inline",
            label : "Type"
        }

    }
});


var giveArchetypeToDeckWithout = {
    before : {
        method : function(doc){
            console.log(Template.parentData(1));
            doc.deckNameID = Template.parentData(1)._id
            return doc;
        }
    },
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
        console.log("onSubmit");
    },
    onSuccess: function(formType, result) {
        console.log("onSucess");
    },
    onError: function(formType, error) {
        console.log(error);
        console.log("onError");

    },
    beginSubmit: function() {
    }
}

AutoForm.hooks({
    giveArchetypeToArchetypelessDecks : giveArchetypeToDeckWithout
});

var createArchetype = {
    before : {
        method : function(doc){
            return doc;
        }
    },
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
        console.log("onSubmit");
    },
    onSuccess: function(formType, result) {
        console.log("onSucess");
    },
    onError: function(formType, error) {
        console.log(error);
        console.log("onError");

    },
    beginSubmit: function() {
    }
}

AutoForm.hooks({
    createArchetype : createArchetype
});

// Template.registerHelper("currentFieldValue", function (fieldName) {
//     console.log(fieldName);
//     return AutoForm.getFieldValue("createArchetype", fieldName) || "empty";
// });