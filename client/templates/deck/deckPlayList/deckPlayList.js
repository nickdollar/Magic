Template.deckPlayList.onCreated(function(){
    var that = this;
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

Template.deckPlayList.helpers({
    childPlaylistsInfo : function(){
        return Template.instance().playlistsInfo.get();
    },
    playlistExist : function(){
        return Session.get("playlistTest");
    },
    image : function(_imageID){
        return _Images.findOne({_id : _imageID});
    }
});

Template.playlistToRender.helpers({
    playlist : function(){
        return Template.instance().data.playlistsInfo;
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
        method: function(doc) {
            doc._id = Template.parentData(1)._id;
            return doc; //(synchronous)
        }
    },
    beginSubmit: function() {
        Session.set("playlistTest", false);
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