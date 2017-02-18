Template.deckPlayList.onCreated(function(){
    this.playlistsInfo = new ReactiveVar();
    this.checks = new ReactiveDict();
    this.checks.set("images", false);
    this.checks.set("DecksNamesPlaylists", false);
    this.checks.set("loaded", true);
    this.deckSelectedParamRegex = new ReactiveVar(new RegExp("^" +replaceDashWithDotForRegex(FlowRouter.getParam("deckSelected")) + "$", "i"));


    this.autorun(()=>{
        this.checks.set("images", false);
        this.subscribe("Images", {
            onReady : ()=>{
                this.checks.set("images", true);
            }
        });
    })
    this.autorun(()=>{
        this.checks.set("DecksNamesPlaylists", false);
        this.playlistsInfo.set();
        this.subscribe('DecksNamesPlaylists', DecksNames.findOne({format : FlowRouter.getParam("format"), name : {$regex : this.deckSelectedParamRegex.get()}})._id, {
            onReady : ()=> {
                this.playlistsInfo.set(DecksNamesPlaylists.find({}).fetch());
                this.checks.set("DecksNamesPlaylists", true);
                var initializing = false;

                DecksNamesPlaylists.find({DecksArchetypes_id: DecksArchetypes.findOne()._id}).observe({
                    added: (id, doc)=> {
                        if (initializing) {
                            Meteor.setTimeout(()=>{
                                var owl = $("#owl-DecksNamesPlaylist");
                                owl.owlCarousel({
                                    items: 4,
                                    itemsCustom: false,
                                    itemsDesktop: false,
                                    itemsDesktopSmall: false
                                })

                                $(".clickButton").click(function (e) {
                                    e.stopPropagation();
                                    $(this).next().show();
                                })

                                $(document).mouseup(function (e) {
                                    var container = $(".dropdown-content");

                                    if (!container.is(e.target) // if the target of the click isn't the container...
                                        && container.has(e.target).length === 0) // ... nor a descendant of the container
                                    {
                                        container.hide();
                                    }
                                });
                                $(".testVisibility").css("visibility", "visible");
                            }, 1000);
                        }
                    }
                });
                initializing = true;
            }
        });
    })
});

Template.deckPlayList.helpers({
    playlistExist : function(){
        return Template.instance().checks.get("DecksNamesPlaylists") && Template.instance().checks.get("images") && Template.instance().checks.get("loaded") && DecksNamesPlaylists.findOne({});
    },
    image : function(cfsImages_id){
        return Images.findOne({_id : cfsImages_id});
    },
    playlist : function(){
        return DecksNamesPlaylists.find({});
    },
    upVote : function(){
        if(this.likes == null) return false;
        if(this.likes.length == 0) return false;
        return true;
    },
    downVote : function(){
        if(this.dislikes == null) return false;
        if(this.dislikes.length == 0) return false;
        return true;
    },
    reportPlaylistUniqueId: function(){
        return "reportPlaylist" + this._id;
    },
    addPlaylistSchema : function() {

        return Schemas.addPlaylist;
    },
    format : function(){
        return FlowRouter.getParam("format");
    },
    deckSelected : function(){
        return DecksNames.findOne({format : FlowRouter.getParam("format"), name : {$regex : Template.instance().deckSelectedParamRegex.get()}})._id;
    },
    reportPlaylistSchema : function(){
        return Schemas.reportPlaylist;
    },
});

Template.deckPlayList.events({
   
});

Template.deckPlayList.onRendered(function(){
    this.autorun(()=>{
        if(this.checks.get("DecksNamesPlaylists") && this.checks.get("images") && this.checks.get("loaded")) {
            Meteor.setTimeout(()=>{
                var owl = $("#owl-DecksNamesPlaylist");
                owl.owlCarousel({
                    items: 4,
                    itemsCustom: false,
                    itemsDesktop: false,
                    itemsDesktopSmall: false
                })

                $(".clickButton").click(function (e) {
                    e.stopPropagation();
                    $(this).next().show();
                })

                $(document).mouseup(function (e) {
                    var container = $(".dropdown-content");

                    if (!container.is(e.target) // if the target of the click isn't the container...
                        && container.has(e.target).length === 0) // ... nor a descendant of the container
                    {
                        container.hide();
                    }
                });
                $(".testVisibility").css("visibility", "visible");
            }, 1000);
        }
    })

});

if (typeof Schemas === 'undefined' || Schemas === null) {
    Schemas = {};
}


Schemas.reportPlaylist = new SimpleSchema({
    reportString: {
        type: String,
        optional: false,
        label : "Report",
        autoform: {
            type : "select-radio",
            options: [
                {label: "Bad Playlist", value: "bad"},
                {label: "Wrong Deck", value: "wrong"}
            ],

        }
    },
    _id : {
        type: String
    }
});

FlashMessages.configure({
    autoHide: true,
    hideDelay: 5000,
    autoScroll: false
});



Schemas.addPlaylist = new SimpleSchema({
    playlistUrl: {
        type: String,
        regEx: /youtube.com\/(?:watch|playlist)\?(?:v|list)=[a-zA-Z0-9-_]+(?:$|\s|&list=[a-zA-Z0-9-_]+)(?:&index=\d)?/i,
        label: "Playlist Url"
        //errorType : "AAAAAAAAAAAAA"
    },
    format : {
        type: String,
    },
    DecksNames_id : {
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

var addPlaylistHooks = {
    //before: {
    //    // Replace `formType` with the FormValidate `type` attribute to which this hook applies
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
    //    // Replace `formType` with the FormValidate `type` attribute to which this hook applies
    //    formType: function(error, result) {
    //        console.log("after");
    //    }
    //},

    // Called when FormValidate does not have a `type` attribute
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
        console.log(error);
        console.log("onError");
    },

    // Called every time an insert or typeless FormValidate
    // is revalidated, which can be often if keyup
    // validation is used.
    //formToDoc: function(doc) {
    //    // alter doc
    //    console.log(doc);
    //    return doc;
    //    // return doc;
    //},

    // Called every time an update or typeless FormValidate
    // is revalidated, which can be often if keyup
    // validation is used.
    //formToModifier: function(modifier) {
    //    // alter modifier
    //    // return modifier;
    //},

    // Called whenever `doc` attribute reactively changes, before values
    // are set in the FormValidate fields.
    //docToForm: function(doc, ss) {},

    // Called at the beginning and end of submission, respectively.
    // This is the place to disable/enable buttons or the FormValidate,
    // show/hide a "Please wait" message, etc. If these hooks are
    // not defined, then by default the submit button is disabled
    // during submission.
    beginSubmit: function() {
        var thatTemplate = Template.instance().parentTemplate(1);
        thatTemplate.checks.set("loaded", false);
        Meteor.setTimeout(()=>{
            thatTemplate.checks.set("loaded", true);
        }, 100);
    },
    endSubmit: function() {

    }
}

AutoForm.hooks({
    addPlaylist : addPlaylistHooks
});