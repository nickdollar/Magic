function arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }
    return a;
}


Meteor.publishComposite("deckNamesDecksDataCardDatabase", function(_id) {
    return {
        find: function () {
            return DecksNames.find({_id}, {limit : 1});
        },
        children: [
            {
                find: function (decksNames) {
                    return DecksData.find({DecksNames_id : decksNames._id}, {sort : {date : 1}, limit : 1});
                },
                children : [
                    {
                        find : function(decksData){
                            var main = decksData.main.map(function(obj){
                                return obj.name;
                            });
                            var sideboard = decksData.sideboard.map(function(obj){
                                return obj.name;
                            });
                            var allCards = arrayUnique(main.concat(sideboard));

                            return _CardDatabase.find({name: {$in : allCards}});
                        }
                    }
                ]
            }
        ]
    }
});

Meteor.publishComposite("deckSelectedAndCardDatabase", function(_id) {
    return {
        find: function () {
            return DecksData.find({_id : _id});
        },
        children : [
            {
                find : function(decksData){
                    var main = decksData.main.map(function(obj){
                        return obj.name;
                    });
                    var sideboard = decksData.sideboard.map(function(obj){
                        return obj.name;
                    });
                    var allCards = arrayUnique(main.concat(sideboard));
                    return _CardDatabase.find({name: {$in : allCards}});
                }
            }
        ]
    }
});

Meteor.publishComposite("deckSelectedGetDeckDataAndCardData", function(DecksNames_id) {
    return {
        find: function () {
            console.log(DecksNames_id);
            return DecksData.find({DecksNames_id : DecksNames_id}, {limit : 1});
        },
        children: [
            {
                find: function (DeckData) {
                    return DecksData.find({DecksNames_id : DeckData._id}, {sort : {date : 1}, limit : 1});
                }
            }
        ]
    }
});


Meteor.publish('Images', function(){
    return Images.find({});
});

Meteor.publish('deckSelectedGetNewestDeck', function(DecksNames_id){
    return DecksData.find({DecksNames_id : DecksNames_id});
});

Meteor.publish('deckSelectedSelectedName', function(format, name){
    format = format.replace(/-/g, ".");
    name = name.replace(/-/g, ".");
    var nameRegex = new RegExp(name, "g");
    console.log(nameRegex);
    return DecksNames.find({format : format, name : {$regex : nameRegex}});
});


Meteor.publish('deckSelectedDeckPlaylist', function(){
    return DecksNamesPlaylists.find({});
});

Meteor.publish('deckSelectedDeckPlaylistResults', function(){
    return DecksNamesPlaylists.find({}, {fields : {likeCount : 1}});
});

Meteor.publish('deckSelectedDeckPlaylistUpvotes', function(userId){
    if(this.userId == null){
        return DecksNamesPlaylists.find({likes : ""} , { fields  : {likes : "", dislikes : ""}});
    }
    var currentUserId = this.userId;
    return DecksNamesPlaylists.find({$or : [{likes : currentUserId}, {dislikes : currentUserId}]} , { fields  : {likes : currentUserId, dislikes: currentUserId}});
    //return DecksNamesPlaylists.find({likes : {$elemMatch : {"_id" : currentUserId}}} , { fields  : {likes : { $elemMatch: {_id : currentUserId}}}});
});

Meteor.publish('deckSelectedDeckCardsWeekChange', function(){
    return _deckCardsWeekChange.find({});
});



Meteor.publishComposite("deckSelectedDeckEventsDaily", function(format, selectedNameDeck) {
    return {
        find: function () {
            return _Deck.find({name: selectedNameDeck, format : format}, {limit : 5});
        },
        children: [
            {

                find: function (deckName) {
                    return _Event.find({_id : deckName._eventID});

                    //return _Event.find({_id : deckName._eventID, eventType : "daily"});
                }
            }
        ]
    }
});

Meteor.publishComposite("deckSelectedDeckEventsPtq", function(format, selectedNameDeck) {
    return {
        find: function () {
            return _Deck.find({name: selectedNameDeck, format : format, eventType : "ptq"}, {limit : 5});
        },
        children: [
            {
                find: function (deckName) {
                    return _Event.find({_id : deckName._eventID});
                }
            }
        ]
    }
});