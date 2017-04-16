Template.pastEventsYoutubePlaylistModal.helpers({

});

Template.pastEventsYoutubePlaylistModal.events({

});


Template.pastEventsYoutubePlaylistModal.onRendered(function(){
    var addYoutubePlaylistModal = $("#addYoutubePlaylist");

    addYoutubePlaylistModal.validate({
        rules : {
            youtubePlaylist : {
                required : true,
                youtubePlaylist: true
            }
        },
        messages : {
            youtubePlaylist : {
                required : "Player Link Link"
            }
        }
    });

    $.validator.addMethod("youtubePlaylist", function(value, elem) {
        var youtubePlaylistRegex = new RegExp(/https?:\/\/(?:www\.)?youtube\.com\/(?:watch|playlist)\?(?:(?:&.*)*((?:v=([a-zA-Z0-9_\-]+)(?:&.*)*&list=([a-zA-Z0-9_\-]+))|(?:list=([a-zA-Z0-9_\-]+?)(?:&.*)*&v=([a-zA-Z0-9_\-]+)))(?:&.*)*(?:\#.*)*|list=([a-zA-Z0-9_\-]+))/g);
        return youtubePlaylistRegex.test(value);
    },"Example: <br> https://www.youtube.com/watch?v=c9I17-n8p0E&list=PL04lbfeNAaS_hTA4_ElRfwbZP4b_279OQ <br> https://www.youtube.com/watch?v=V_D3AkDNfIU&list=PLMNj_r5bccUyXJLUDRykf9sX3Yc_vHBQD&index=1");


    addYoutubePlaylistModal.on('submit', function(e){
        var tmp = $(this);
        var isvalidate = $("#addYoutubePlaylist").valid();
        if(isvalidate)
        {
            e.preventDefault();
            var youtubePlaylistRegex = new RegExp(/https?:\/\/(?:www\.)?youtube\.com\/(watch|playlist)\?(?:(?:&.*)*((?:v=([a-zA-Z0-9_\-]+)(?:&.*)*&list=([a-zA-Z0-9_\-]+))|(?:list=([a-zA-Z0-9_\-]+?)(?:&.*)*&v=([a-zA-Z0-9_\-]+)))(?:&.*)*(?:\#.*)*|list=([a-zA-Z0-9_\-]+))/g);

            var youtubePlaylistMatch = youtubePlaylistRegex.exec($(tmp.find("#youtubePlaylist")).val());

            var playlist = "";
            if(youtubePlaylistMatch[1] == "playlist"){
                playlist = youtubePlaylistMatch[7];
            }else{
                playlist = youtubePlaylistMatch[4];
            }
            Meteor.call('addYoutubePlaylist', Session.get("selectedVODorPlaylist"), playlist, function(error, result){
                console.log("call back");
            });
        }
    });

});