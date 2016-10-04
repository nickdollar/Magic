Template.deckPlayList.onCreated(function(){
    var that = this;
    this.isPlaylistReady = new ReactiveVar();
    this.playlistsInfo = new ReactiveVar();
    this.checks = new ReactiveDict();
    this.checks.set("images", false);
    this.checks.set("DecksNamesPlaylists", false);
    this.checks.set("loaded", true);


    this.autorun(function(){
        that.checks.set("images", false);
        that.subscribe("Images", {
            onReady : function(){
                that.checks.set("images", true);
            }
        });
    })
    this.autorun(function(){
        that.checks.set("DecksNamesPlaylists", false);
        that.playlistsInfo.set();
        that.subscribe('DecksNamesPlaylists', DecksNames.findOne({name : {$regex : Router.current().params.deckSelected}})._id, {
            onReady : function() {
                that.playlistsInfo.set(DecksNamesPlaylists.find({}).fetch());
                that.checks.set("DecksNamesPlaylists", true);
                var initializing = false;

                DecksNamesPlaylists.find({DecksArchetypes_id: DecksArchetypes.findOne()._id}).observe({
                    added: function (id, doc) {
                        if (initializing) {
                            Meteor.setTimeout(function(){
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
    image : function(_imageID){
        return Images.findOne({_id : _imageID});
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

        return Schema.addPlaylist;
    },
    format : function(){
        return Router.current().params.format;
    },
    deckSelected : function(){
        return DecksNames.findOne({name : {$regex : Router.current().params.deckSelected}})._id;
    },
    reportPlaylistSchema : function(){
        return Schema.reportPlaylist;
    },
});

Template.deckPlayList.events({
    "click .upVote" : function(evt, tmp){
        var that = this;
        var indexThat = Template.instance().playlistsInfo.get().findIndex(function(currentValue, index, arr){
            return currentValue._id == that._id
        });

        if(Template.instance().playlistsInfo.get()[indexThat].likes == null){
            Template.instance().playlistsInfo.get()[indexThat].likes = [];
        }

        if(Template.instance().playlistsInfo.get()[indexThat].dislikes == null){
            Template.instance().playlistsInfo.get()[indexThat].dislikes = [];
        }

        Template.instance().playlistsInfo.get()[indexThat].likes.push({_id : Meteor.user()._id});
        Template.instance().playlistsInfo.get()[indexThat].likeCount++;


        if(Template.instance().playlistsInfo.get()[indexThat].dislikes.length == 1){
            Template.instance().playlistsInfo.get()[indexThat].dislikes = [];
            Template.instance().playlistsInfo.get()[indexThat].likeCount++;
        }
        Template.instance().playlistsInfo.set(Template.instance().playlistsInfo.get());
        Meteor.call("upADeckPlayListVote", this);
    },
    "click .removeUpVote" : function(evt, tmp){
        var that = this;
        var indexThat = Template.instance().playlistsInfo.get().findIndex(function(currentValue, index, arr){
            return currentValue._id == that._id
        });

        Template.instance().playlistsInfo.get()[indexThat].likes = [];
        Template.instance().playlistsInfo.get()[indexThat].likeCount--;

        Template.instance().playlistsInfo.set(Template.instance().playlistsInfo.get());
        Meteor.call("removeUpADeckPlayListVote", this);
    },
    "click .downVote" : function(evt, tmp){
        var that = this;
        var indexThat = Template.instance().playlistsInfo.get().findIndex(function(currentValue, index, arr){
            return currentValue._id == that._id
        });

        if(Template.instance().playlistsInfo.get()[indexThat].likes == null){
            Template.instance().playlistsInfo.get()[indexThat].likes = [];
        }

        if(Template.instance().playlistsInfo.get()[indexThat].dislikes == null){
            Template.instance().playlistsInfo.get()[indexThat].dislikes = [];
        }

        Template.instance().playlistsInfo.get()[indexThat].dislikes.push({_id : Meteor.user()._id});
        Template.instance().playlistsInfo.get()[indexThat].likeCount--;


        if(Template.instance().playlistsInfo.get()[indexThat].likes.length == 1){
            Template.instance().playlistsInfo.get()[indexThat].likes = [];
            Template.instance().playlistsInfo.get()[indexThat].likeCount--;
        }
        Template.instance().playlistsInfo.set(Template.instance().playlistsInfo.get());
        Meteor.call("downADeckPlayListVote", this);
    },
    "click .removeDownVote" : function(evt, tmp){

        var that = this;
        var indexThat = Template.instance().playlistsInfo.get().findIndex(function(currentValue, index, arr){
            return currentValue._id == that._id
        });

        Template.instance().playlistsInfo.get()[indexThat].dislikes = [];
        Template.instance().playlistsInfo.get()[indexThat].likeCount++;

        Template.instance().playlistsInfo.set(Template.instance().playlistsInfo.get());

        Meteor.call("removeDownADeckPlayListVote", this);
    }
});

Template.deckPlayList.onRendered(function(){
    var that = this;
    this.autorun(function(){
        if(that.checks.get("DecksNamesPlaylists") && that.checks.get("images") && that.checks.get("loaded")) {
            Meteor.setTimeout(function(){
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

if (typeof Schema === 'undefined' || Schema === null) {
    Schema = {};
}


Schema.reportPlaylist = new SimpleSchema({
    reportString: {
        type: String,
        optional: false,
        label : "Report",
        autoform: {
            type : "select-radio",
            options: [
                {label: "Bad Playlist", value: "bad"},
                {label: "Wrong Deck", value: "wrong"}
            ]
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



Schema.addPlaylist = new SimpleSchema({
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
        var thatTemplate = Template.instance().parentTemplate(1);
        thatTemplate.checks.set("loaded", false);
        Meteor.setTimeout(function(){
            thatTemplate.checks.set("loaded", true);
        }, 100);
    },
    endSubmit: function() {

    }
}

AutoForm.hooks({
    addPlaylist : addPlaylistHooks
});