import moment from "moment";
import jstz from "jstz";

Template.futuroEventsModal.onCreated(function(){
    this.options = new ReactiveDict();
    // this.options.set();
});

Template.futuroEventsModal.events({
    "click .saveChanges" : function(evt, tmp){

    },
    'change .streamed-toggle': function (evt, template) {
        template.options.set("streamed", !template.options.get("streamed"));
    },
    'change .recurring-toggle': function (evt, template) {
        template.options.set("recurring", !template.options.get("recurring"));
    },


    'keydown #autocomplete' : function(evt, tmp, test){
        // if (type == "keydown") {
        //     var orig_listener = evt;
        //     evt = function(Events) {
        //         console.log(Events);
        //         var suggestion_selected = $(".pac-item-selected").length > 0;
        //         if (Events.which == 13 && !suggestion_selected) {
        //             var simulated_downarrow = $.Event("keydown", {
        //                 keyCode: 40,
        //                 which: 40
        //             });
        //             orig_listener.apply(input, [simulated_downarrow]);
        //         }
        //
        //         orig_listener.apply(input, [Events]);
        //     };
        // }
    }
});

Template.futuroEventsModal.helpers({
    addEventCalendarSchema : function(){
        return Schemas.addEventCalendar;
    },
    EventsCalendar : function(){
        return Schemas.EventsCalendar;
    },
    streamed : function(){
        return Template.instance().options.get("streamed");
    },
    recurring : function(){
        return Template.instance().options.get("recurring");
    },
    optsGoogleplace: function() {
        return {
            // type: 'googleUI',
            // stopTimeoutOnKeyup: false,
            // googleOptions: {
            //   componentRestrictions: { country:'us' }
            // }
        }
    }
});

Template.futuroEventsModal.onRendered(function(){

    $('#eventTime').datetimepicker({
        minDate : new Date()
    });

    var futureEventForm = $("#futureEventForm");

    futureEventForm.validate({
        rules : {
            name : {
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
            name : {
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

            futureEvent.name = $(tmp.find("#name")).val();
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

if (typeof Schemas === 'undefined' || Schemas === null) {
    Schemas = {};
}

Schemas.EventsCalendar.messages({
    required: "[label] is required",
    passwordMismatch: "Passwords do not match",
    regEx: [
        {exp: /(^http(s)?:\/\/)?((www|en-es|en-gb|secure|beta|ro|www-origin|en-ca|fr-ca|lt|zh-tw|he|id|ca|mk|lv|ma|tl|hi|ar|bg|vi|th)\.)?twitch.tv\/(?!directory|p|user\/legal|admin|login|signup|jobs)(\w+)/, msg: "<div>example: https://www.twitch.tv/channelname</div><div>example: twitch.tv/channelname</div>"},
        {exp: SimpleSchema.RegEx.Url, msg: "<div>[label] must be a valid URL</div><div>Example: http://crowdmtg.com</div>"},
    ]
});

AutoForm.hooks({
    addEventCalendar: {
        before: {
            // Replace `formType` with the FormValidate `type` attribute to which this hook applies
            method: function (doc) {
                return doc;
                // Then return it or pass it to this.result()
                //return doc; (synchronous)
                //return false; (synchronous, cancel)
                //this.result(doc); (asynchronous)
                //this.result(false); (asynchronous, cancel)
            }
        },
    },
    onError: function(formType, error) {
        console.log(error)
    },
    onSuccess: function(formType, result) {
        console.log("SUCCESS");
    },
});