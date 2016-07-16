import moment from "moment";
import jstz from "jstz";

Template.futuroEventsModal.events({
    "click .saveChanges" : function(evt, tmp){

    }
});


Template.futuroEventsModal.onRendered(function(){
    $('#eventTime').datetimepicker({
        minDate : new Date()
    });

    var futureEventForm = $("#futureEventForm");

    futureEventForm.validate({
        rules : {
            eventName : {
                required : true,
                minlength : 2
            },
            eventSourceUrl : {
                minlength : 2,
                url: true
            },
            twitchChannelName : {
                required : true,
                minlength : 2
            },
            format : {
                onecheck : true
            }
        },
        messages : {
            eventName : {
                required : "Event name is required",
                minlength : "Event name must consist of at least 3 characters"
            },
            eventSourceUrl : {
                required : "Event url is required",
                minlength : "Invalid: Example http://example.com"
            },
            streamUrl : {
                required : "Stream url is required",
                minlength : "Event name must consist of at least 3 characters",
                twitch : "Twitch.com address"
            },
            format : {
                required : "Must choose at least one format"
            }
        }
    });

    futureEventForm.on('submit', function(e){
        var tmp = $(this);
        var isvalidate=$("#futureEventForm").valid();
        if(isvalidate)
        {
            $('#myModal2').modal('toggle');
            e.preventDefault();

            var futureEvent = {};

            futureEvent.eventName = $(tmp.find("#eventName")).val();
            futureEvent.httpAddress = $(tmp.find("#eventSourceUrl")).val();

            //var twitchChannelRegex = new RegExp(/twitch.tv\/((?:(?!\/).)*)/);
            //futureEvent.streamChannel = $(tmp.find("#twitchStream")).val().match(twitchChannelRegex)[1];
            futureEvent.streamChannel = $(tmp.find("#twitchChannelName")).val();

            futureEvent.format = [];
            $(tmp).find("input[type=checkbox]:checked").each(function(){
                futureEvent.format.push($(this).val());
            });
            var time = $(tmp.find("#eventTime")).val();
            futureEvent.timezone = $(tmp.find("#timeZone option:selected")).attr("value");
            var baseTime = moment(new Date(time));
            var correctedTime = baseTime.clone();
            correctedTime.tz(futureEvent.timezone);

            correctedTime.add(baseTime.utcOffset() - correctedTime.utcOffset(), 'minutes');
            futureEvent.date = new Date(correctedTime.format());
            futureEvent.eventCreator = Meteor.user()._id;
            Meteor.call("addAFutureEvent", futureEvent);
        }
    });

    $.validator.addMethod("twitch", function(value, elem) {
        var twitchUrlRegex = new RegExp(/(^http(s)?:\/\/)?((www|en-es|en-gb|secure|beta|ro|www-origin|en-ca|fr-ca|lt|zh-tw|he|id|ca|mk|lv|ma|tl|hi|ar|bg|vi|th)\.)?twitch.tv\/(?!directory|p|user\/legal|admin|login|signup|jobs)(\w+)/);
        return twitchUrlRegex.test(value);
    },"You must select at least one!");


    $.validator.addMethod("onecheck", function(value, elem) {
        return $(".checkBoxes input:checkbox:checked").length > 0;
    },"You must select at least one!");

    //$.validator.addMethod("datetimepicker", function(value, elem) {
    //    return $(".checkBoxes input:checkbox:checked").length > 0;
    //},"You must select at least one!");

});

Template.futuroEventsModal.events({
    "keyup #eventName" : function(event){

    }
});

Template.timezones.onRendered(function(){

    var tz = jstz.determine();
    var jquerya = this.$("option[value='"+ tz.name()+"']");

    //console.log(tz.name());

    //var timezone = new Date().getTimezoneOffset();
    //console.log(timezone);


    //var hours = parseInt(timezone/60);
    //
    //if(timezone >= 0){
    //    hours += "+" + hours;
    //}
    //
    //
    //
    //while (hours.length < 3) hours = "0" + hours;
    //
    //var minutes = timezone%60+"";
    //while (minutes.length < 3) minutes = "0" + minutes;
    //
    //
    //var timeZoneString = "UTC-" + hours + ":" + minutes;
    //
    //console.log(timeZoneString);
    //
    //var jquerya = this.$("option:contains("+timeZoneString+"):first");
    //
    //
    //console.log(jquerya);

    jquerya.first().prop("selected", true);

});



Template.timezones.onRendered(function(){







});