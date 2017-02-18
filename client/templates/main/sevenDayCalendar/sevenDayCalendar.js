Template.sevenDayCalendar.onCreated(function(){
    var that = this;
    this.options = new ReactiveDict();
});

Template.sevenDayCalendar.helpers({
});

Template.sevenDayCalendar.onRendered(function(){
    var that = this;
    var date = new Date();

    $('#eventsCalendar').fullCalendar("destroy");
    $('#eventsCalendar').fullCalendar({

        header: false,
        views: {
            agendaFourDay: {
                type: 'basicWeek',
                duration: { days: 7 },
                buttonText: '4 day'
            }
        },
        firstDay : new Date().getDay() -1,
        height : 200,
        defaultView : "agendaFourDay"
    });
    var initializing = false;

    that.autorun(function(){
        that.subscribe("EventsCalendarAll", {
            onReady : function(){
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