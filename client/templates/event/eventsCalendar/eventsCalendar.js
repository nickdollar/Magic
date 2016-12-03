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
            // eventClick: function (event, jsEvent, view) {
            //     //set the values and open the modal
            //     $("#eventInfo").html(event.description);
            //     $("#eventLink").attr('href', event.url);
            //     $("#eventContent").dialog({modal: true, title: event.title});
            // }
        }
    }
});

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
            // console.log(event);
            $(".js-eventName").html(event.title);
            // $("#eventLink").attr('href', event.url);
            // $("#eventContent").dialog({ modal: true, title: event.title });
            $("#eventCalendarModal").modal();
            return false;
        }
    });
    var initializing = false;


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