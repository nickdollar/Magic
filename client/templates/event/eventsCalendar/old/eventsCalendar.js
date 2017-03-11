import moment from "moment";

Template.eventsCalendar.onCreated(function(){
    var that = this;
    this.options = new ReactiveDict();
});

Template.eventsCalendar.helpers({
    options : function() {
        return {
            header: {
                left: '',
                center: 'prev title next',
                right: ''
            },
        }
    },
    exampleMapOptions: function() {
        // Make sure the maps API has loaded
        if (GoogleMaps.loaded()) {
            // Map initialization options
            return {
                center: new google.maps.LatLng(-37.8136, 144.9631),
                zoom: 8
            };
        }
    }
});

Template.eventsCalendar.events({
    "onFocus #autocomplete" : function() {

    },
    exampleMapOptions: function() {
        // Make sure the maps API has loaded
        if (GoogleMaps.loaded()) {
            // Map initialization options
            return {
                center: new google.maps.LatLng(-37.8136, 144.9631),
                zoom: 8
            };
        }
    }
});
var weekDays = {0 : "Sunday", 1 : "Monday", 2 : "Tuesday", 3 : "Wednesday", 4 : "Thursday", 5 : "Friday", 6 : "Saturday" };

// var placeSearch, autocomplete;
// var componentForm = {
//     street_number: 'short_name',
//     route: 'long_name',
//     locality: 'long_name',
//     administrative_area_level_1: 'short_name',
//     country: 'long_name',
//     postal_code: 'short_name'
// };



Template.eventsCalendar.onRendered(function(){

    var that = this;
    $('#eventsCalendar').fullCalendar("destroy");
    $('#eventsCalendar').fullCalendar({
        header: {
            left: '',
            center: 'prev title next',
            right: ''
        },
        fixedWeekCount : false,
        eventClick:  function(event, jsEvent, view) {
            //set the values and open the modal
            $(".js-name").html(event.title);
            var html = "";
            html += '<div><span class="rightTitle">When:</span><span class="leftInformation">'+moment(new Date(event.source.origArray[0].start)).format("llll");
            if(event.source.origArray[0].end){
                html += ' - '+ moment(new Date(event.source.origArray[0].end)).format("h mm") +'</span></div>';
            }


            if(event.dow){
                var days = "";
                for(var i = 0; i < event.dow.length; i++){
                    days += weekDays[event.dow[i]];
                    if(i <  event.dow.length - 1){
                        days += ", ";
                    };
                }

                html += '<div><span class="rightTitle">Days:</span><span class="leftInformation">Every: '+days+' at '+ moment(new Date(event.source.origArray[0].start)).format("H:mm");

                if(event.source.origArray[0].end){
                    html += ' - '+ moment(new Date(event.source.origArray[0].end)).format("h mm") +'</span></div>';
                }
            }



            html += '<div><span class="rightTitle">Source:</span><span class="leftInformation"><a href="'+event.source.origArray[0].eventSourceUrl +'">Link</a> </span></div>';
            if(event.source.origArray[0].twitchChannelName){
                html += '<div><span class="rightTitle">Stream:</span><span class="leftInformation"><a href="'+event.source.origArray[0].twitchChannelName +'">Link</a> </span></div>';
            }


            var formats = "";
            for(var i = 0; i < event.source.origArray[0].formats.length; i++){
                formats += event.source.origArray[0].formats[i];
                if(i <  event.source.origArray[0].formats.length - 1){
                    formats += ", ";
                };
            }
            html += '<div><span class="rightTitle">Formats:</span><span class="leftInformation">'+ formats +'</span></div>';

            if(event.source.origArray[0].description){
                html += '<div><span class="rightTitle">Description:</span><span class="leftInformation">'+event.source.origArray[0].description+'</span></div>';
            }


            $(".js-information").html(html) ;

            // $("#eventLink").attr('href', Events.url);
            // $("#eventContent").dialog({ modal: true, title: Events.title });
            $("#eventCalendarModal").modal();
            return false;
        }
    });
    that.autorun(function(){
        that.subscribe("eventsCalendarByFormat", FlowRouter.getParam("format"), {
            onReady : function(){

                // $('#eventsCalendar').fullCalendar("addEventSource", function(start, end, timezone, callback){
                //     var events = [];
                //     console.log(start);
                //     EventsCalendar.find({}).forEach(function(obj){
                //         events.push(obj);
                //     })
                //     callback(events);
                // });

            }
        });
    });



    this.autorun(function(){
        EventsCalendar.find({}).observe({
            added: function (obj) {
                obj.id = obj._id;
                var array = [];
                array.push(obj);
                $('#eventsCalendar').fullCalendar("addEventSource", array);
            },
            removed : function(obj){
                $('#eventsCalendar').fullCalendar("removeEvents", obj._id);
            }
        });
    })
});