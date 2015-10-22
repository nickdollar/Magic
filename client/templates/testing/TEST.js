Template.testing.events({
   'click .moreAggro' : function (evt, tmp) {
       Session.set("MoreDecks", Session.get("MoreDecks") + 5);
   }
});


Template.testing.onCreated(function(){
    var instance = this;
    this.autorun(function(){
        instance.subscribe('meta');
    });
});


//+++++++++++++++++++++++
//deckPhoto             +
//+++++++++++++++++++++++
Template.deckPhoto.helpers({

    bigPictures : function() {
        return this.mainPicture;
    },
    smallPicture1 : function() {
        return this.smallPicture1;
    },
    smallPicture2 : function() {
        return this.smallPicture2;
    }

});

//+++++++++++++++++++++++
//deckPhoto2            +
//+++++++++++++++++++++++
Template.deckPhoto2.helpers({

    bigPictures : function() {
        return this.mainPicture;
    },
    smallPicture1 : function() {
        return this.smallPicture1;
    },
    smallPicture2 : function() {
        return this.smallPicture2;
    }

});