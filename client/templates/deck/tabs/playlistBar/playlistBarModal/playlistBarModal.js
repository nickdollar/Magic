Template.playlistBarModal.helpers({
    contactFormSchema: function() {
        return Schema.contact;
    },
    format : function(){
        return Router.current().params.format;
    },
    deckSelected : function(){
        return Router.current().params.deckSelected.replace(/-/g," ");
    }
});


Schema = {};
Schema.contact = new SimpleSchema({
    playlistUrl: {
        type: String,
        regEx: /youtube.com\/(?:watch|playlist)\?(?:v|list)=[a-zA-Z0-9-_]+(?:$|\s|&list=[a-zA-Z0-9-_]+)(?:&index=\d)?/i,
        label: "Playlist Url"
        //errorType : "AAAAAAAAAAAAA"
    },
    format : {
        type: String,
    },
    deckName : {
        type: String,
    }
});



SimpleSchema.messages(
    {
        "regEx": [
            {msg: "Default Message"},
            {exp: /youtube.com\/(?:watch|playlist)\?(?:v|list)=[a-zA-Z0-9-_]+(?:$|\s|&list=[a-zA-Z0-9-_]+)(?:&index=\d)?/i, msg: "wrong url, example: <br>https://www.<strong>youtube.com/watch?v=BdI46-CLS20&list=PL04lbfeNAaS_QMjppTIqTz43M5N3Aw-fD&index=1</strong><br>https://www.<strong>youtube.com/playlist?list=PL04lbfeNAaS_QMjppTIqTz43M5N3Aw-fD</strong>"}
        ],
        "regEx schemaKey": [
            {exp: /youtube.com\/(?:watch|playlist)\?(?:v|list)=[a-zA-Z0-9-_]+(?:$|\s|&list=[a-zA-Z0-9-_]+)(?:&index=\d)?/i, msg: "It's very important that you enter a valid URL here"}
        ]
    }
);

var hooksObject = {
    //before: {
    //    // Replace `formType` with the form `type` attribute to which this hook applies
    //    formType: function(doc) {
    //        // Potentially alter the doc
    //        doc.foo = 'bar';
    //        console.log("before");
    //
    //        // Then return it or pass it to this.result()
    //        //return doc; (synchronous)
    //        //return false; (synchronous, cancel)
    //        //this.result(doc); (asynchronous)
    //        //this.result(false); (asynchronous, cancel)
    //    }
    //},

    // The same as the callbacks you would normally provide when calling
    // collection.insert, collection.update, or Meteor.call
    //after: {
    //    // Replace `formType` with the form `type` attribute to which this hook applies
    //    formType: function(error, result) {
    //        console.log("after");
    //    }
    //},

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
        console.log("onSucess");
    },

    // Called when any submit operation fails
    onError: function(formType, error) {
        console.log("onError");
    },

    // Called every time an insert or typeless form
    // is revalidated, which can be often if keyup
    // validation is used.
    //formToDoc: function(doc) {
    //    // alter doc
    //    console.log(doc);
    //    return doc;
    //    // return doc;
    //},

    // Called every time an update or typeless form
    // is revalidated, which can be often if keyup
    // validation is used.
    //formToModifier: function(modifier) {
    //    // alter modifier
    //    // return modifier;
    //},

    // Called whenever `doc` attribute reactively changes, before values
    // are set in the form fields.
    //docToForm: function(doc, ss) {},

    // Called at the beginning and end of submission, respectively.
    // This is the place to disable/enable buttons or the form,
    // show/hide a "Please wait" message, etc. If these hooks are
    // not defined, then by default the submit button is disabled
    // during submission.
    beginSubmit: function() {
        Session.set("playlistTest", false);
    },
    endSubmit: function() {
        //Session.set("playlistTest", true);
        ////console.log("endSubmit");
    }
}

AutoForm.hooks({
    contactForm : hooksObject
});