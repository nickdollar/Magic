Template.AdminDecksNamesEdit.onCreated(function(){
    this.subscribe('DecksArchetypes');
});

Template.AdminDecksNamesEdit.helpers({
    collection : function(){
        return Meteor.Decksnames;
    },
    DecksNames : function(){
        return Schemas.DecksNames;
    },
    editFormat : function(){
        return Schemas.DecksNamesFormat;
    },
    documentValue : function(){
        return DecksNames.findOne({_id : Router.current().params._id});
    }
});

Template.AdminDecksNamesEdit.events({
    "click .js-testButton" : function(){
        DecksNames.update({_id : "BqvP8MZLacwM3kAXH"}, {
            $set : {name : "BBBBBBB"}
        });
    }
});

Template.AdminDecksNamesEdit.onRendered(function(){

});
SimpleSchema.debug = true;

if (typeof Schemas === 'undefined' || Schemas === null) {
    Schemas = {};
}

Schemas.DecksNamesName = new SimpleSchema({
    name : {
        type: String
    }
});

Schemas.DecksNamesFormat = new SimpleSchema({
    format : {
        type : String,
        allowedValues : ["Standard", "Modern", "Legacy", "Vintage"],
        autoform : {
            type : "select",
            options : function (){
                return [
                    {label: "Standard", value: "standard"},
                    {label: "Modern", value: "modern"},
                    {label: "Legacy", value: "legacy"},
                    {label: "Vintage", value: "vintage"}
                ]
            }
        }
    }
});


var hooksObjectName = {
    before: {
        // Replace `formType` with the form `type` attribute to which this hook applies
        method: function(doc) {
            // Potentially alter the doc
            // Then return it or pass it to this.result()
            //return doc; (synchronous)
            //return false; (synchronous, cancel)
            //this.result(doc); (asynchronous)
            //this.result(false); (asynchronous, cancel)
            return doc;
        }
    },

    // The same as the callbacks you would normally provide when calling
    // collection.insert, collection.update, or Meteor.call
    after: {
        // Replace `formType` with the form `type` attribute to which this hook applies
        method: function(error, result) {
            console.log("after");
        }
    },

    // Called when form does not have a `type` attribute
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
        console.log("onSubmit");
        // You must call this.done()!
        //this.done(); // submitted successfully, call onSuccess
        //this.done(new Error('foo')); // failed to submit, call onError with the provided error
        //this.done(null, "foo"); // submitted successfully, call onSuccess with `result` arg set to "foo"
    },

    // Called when any submit operation succeeds
    onSuccess: function(formType, result) {
        console.log("onSuccess");
    },

    // Called when any submit operation fails
    onError: function(formType, error) {
        console.log("onError");

        console.log(error);
    },

    // Called every time an insert or typeless form
    // is revalidated, which can be often if keyup
    // validation is used.
    // formToDoc: function(doc) {
    //     console.log("formToDoc");
    //     console.log(doc)
    //     // alter doc
    //     return doc;
    // },

    // Called every time an update or typeless form
    // is revalidated, which can be often if keyup
    // validation is used.
    // formToModifier: function(modifier) {
    //     console.log("formToModifier");
    //
    //     // alter modifier
    //     // return modifier;
    // },

    // Called whenever `doc` attribute reactively changes, before values
    // are set in the form fields.
    // docToForm: function(doc, ss) {
    //     console.log("docToForm");
    //
    // },

    // Called at the beginning and end of submission, respectively.
    // This is the place to disable/enable buttons or the form,
    // show/hide a "Please wait" message, etc. If these hooks are
    // not defined, then by default the submit button is disabled
    // during submission.
    beginSubmit: function() {
        console.log("Start");
    },
    endSubmit: function() {
        console.log("endSubmit");
    }
};

AutoForm.addHooks("AdminDeckNamesUpdateName", hooksObjectName);