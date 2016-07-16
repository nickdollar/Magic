Template.pastEventsVodModal.helpers({

});


Template.pastEventsVodModal.onRendered(function(){
    var addVodModal = $("#streamVod");

    addVodModal.validate({
        rules : {
            vodUrl : {
                required : true,
                twitchVODUrl: true
            }
        },
        messages : {
            vodUrl : {
                required : "Event name is required",
                twitchVODUrl : "Example: https://www.twitch.tv/channelname/v/66194615?t=01h38m57s"
            }
        }
    });

    $.validator.addMethod("twitchVODUrl", function(value, elem) {
        var twitchUrlRegex = new RegExp(/https:\/\/www.twitch.tv\/.*\/v\/(.*)(\w+)/);
        return twitchUrlRegex.test(value);
    },"You must select at least one!");


    addVodModal.on('submit', function(e){
        var isvalidate = $("#streamVod").valid();
        if(isvalidate)
        {
            e.preventDefault();
            var twitchUrlRegex = new RegExp(/https:\/\/www.twitch.tv\/.*\/v\/(.*)(\w+)/);
            var vod = $(tmp.find("#vodUrl")).val().match(twitchUrlRegex)[1];
            Meteor.call('addVODToEvent', Session.get("selectedVODorPlaylist"), vod);
        }
    });

});