
Template.deckPlayList.onCreated(function(){
    var that = this;
    that.lalala = new ReactiveVar("AAAAAA");
    this.autorun(function(){

        Session.get("playlistTest");
        Meteor.call('getPlayListDataMETHOD', Router.current().params.format, Router.current().params.deckSelected.replace(/-/," "), function(error, result){
            if(error){
                alert('Error');
            }else{
                Session.set("playlistTest", true);
                that.playlistsInfo = new ReactiveVar(result);
            }
        });
    })
});


Template.playlistToRender.onCreated(function(){
    this.playlistsInfo = new ReactiveVar(Template.instance().data.playlistsInfo);
});




Template.deckPlayList.helpers({
    childPlaylistsInfo : function(){
        return Template.instance().playlistsInfo.get();
    },
    playlistExist : function(){
        return Session.get("playlistTest");
        if(Session.get('playlists').length > 0){
            return true;
        }
        return false;
    },
    image : function(_imageID){
        return _Images.findOne({_id : _imageID});
    }
});

Template.deckPlayList.events({
    //"click .upVote" : function(evt, tmp){
    //    this.likeCount = 10;
    //    var that = this;
    //    var indexThat = 0;
    //    var obj = Session.get("testX").find(function(currentValue, index, arr){
    //        console.log(currentValue._id + " " + that._id);
    //        if(currentValue._id == that._id){
    //            indexThat = index;
    //        }
    //        return currentValue._id == that._id
    //    })
    //    console.log(Template.instance());
    //    var temp = Template.instance().ReactiveTest.get();
    //    temp[indexThat].likeCount = 10
    //    Template.instance().ReactiveTest.set(temp);
    //
    //    //var temp = Session.get("testX");
    //    //temp[indexThat].likeCount = 10
    //    //Session.set("testX", temp);
    //    Meteor.call("upADeckPlayListVote", this);
    //},
    //"click .removeUpVote" : function(evt, tmp){
    //    Meteor.call("removeUpADeckPlayListVote", this);
    //},
    //"click .downVote" : function(evt, tmp){
    //    Meteor.call("downADeckPlayListVote", this);
    //},
    //"click .removeDownVote" : function(evt, tmp){
    //    Meteor.call("removeDownADeckPlayListVote", this);
    //}
});


Template.playlistToRender.helpers({
    playlist : function(){
        return Template.instance().playlistsInfo.get();
        return Session.get("testX");
    },
    image : function(_imageID){
        return _Images.findOne({_id : _imageID});
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
    typesSchema1: function(){
        return Schema.reportPlaylist;
    }
});

Template.playlistToRender.events({
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

Template.playlistToRender.onRendered(function(){
    var owl = $("#owl-example");
    owl.owlCarousel({
        items : 4,
        itemsCustom : false,
        itemsDesktop : false,
        itemsDesktopSmall : false
    })

    $(".clickButton").click(function(e){
        e.stopPropagation();
        $(this).next().show();
    })

    $(document).mouseup(function (e)
    {
        var container = $(".dropdown-content");

        if (!container.is(e.target) // if the target of the click isn't the container...
            && container.has(e.target).length === 0) // ... nor a descendant of the container
        {
            container.hide();
        }
    });
});


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






//var test = Tracker.autorun(function(){
//    //var test = _DeckPlayList.find({}).observe(function(){
//    //    console.log("changed");
//    //});
//    //console.log("TRACKER");
//
//});

var reportFormHooksObject = {
    before: {
        // Replace `formType` with the form `type` attribute to which this hook applies
        method: function(doc) {
            // Potentially alter the doc
            console.log(Template.parentData(1)._id);

            doc._id = Template.parentData(1)._id;
            // Then return it or pass it to this.result()
            return doc; //(synchronous)
            //return false; (synchronous, cancel)
            //this.result(doc); (asynchronous)
            //this.result(false); (asynchronous, cancel)
        }
    },

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
        console.log("onSucess2");
    },

    // Called when any submit operation fails
    onError: function(formType, error) {
        console.log("onError2");
        console.log(error);

    },

    // Called every time an insert or typeless form
    // is revalidated, which can be often if keyup
    // validation is used.
    formToDoc: function(doc) {
        console.log("formToDoc");
        // "alter doc"
        console.log(this);
        console.log(Template.instance());

        console.log(doc);
        return doc;
        // return doc;
    },

    // Called every time an update or typeless form
    // is revalidated, which can be often if keyup
    // validation is used.
    formToModifier: function(modifier) {
        console.log("formToModifier");
        console.log(modifier);
         return modifier;
    },

    // Called whenever `doc` attribute reactively changes, before values
    // are set in the form fields.
    //docToForm: function(doc, ss) {},

    // Called at the beginning and end of submission, respectively.
    // This is the place to disable/enable buttons or the form,
    // show/hide a "Please wait" message, etc. If these hooks are
    // not defined, then by default the submit button is disabled
    // during submission.
    beginSubmit: function() {
        //Session.set("playlistTest", false);
    },
    endSubmit: function() {
        //Session.set("playlistTest", true);
        ////console.log("endSubmit");
        console.log(this);
    }
}

AutoForm.hooks({
    reportForm : reportFormHooksObject
});

FlashMessages.configure({
    autoHide: true,
    hideDelay: 5000,
    autoScroll: false
});