import React from 'react' ;
import LGSAddNewEventToLGSFormModal from './LGSAddNewEventToLGSFormModal.jsx';
import LGSEventsCalendarModal  from './LGSEventsCalendarModal.jsx';
import Moment from "moment";

var weekDays = {0 : "Sunday", 1 : "Monday", 2 : "Tuesday", 3 : "Wednesday", 4 : "Thursday", 5 : "Friday", 6 : "Saturday" };

class LGSEventsCalendar extends React.Component {
    constructor(){
        super();

        this.state = {
            view: {
                showModalAddEvent: false,
                showModalEventInfo: false,
            },
            events : []
        }
    }

    componentDidMount(){
        var calendar = this.refs["calendar"];
        $(calendar).fullCalendar({
            header: {
                left: '',
                center: 'prev title next',
                right: ''
            },
            customButtons: {
                addEvent: {
                    text: 'Add Event',
                    click: ()=> {
                        this.handleShowModalAddEvent()
                    }
                }
            },
            header: {
                left: 'prev,next today addEvent',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            fixedWeekCount : false,
            eventClick:  (event, jsEvent, view)=> {


                var when = "";
                if(event.dow){
                    var daysTemp = "";
                    for(var i = 0; i < event.dow.length; i++){
                        daysTemp += weekDays[event.dow[i]];
                        if(i <  event.dow.length - 1){
                            daysTemp += ", ";
                        };
                    }

                    when += "Every " + daysTemp+ " at "+ event.start.format("LT");
                }

                var formats = "";
                for(var i = 0; i < event.formats; i++){
                    formats += event.formats[i];
                    if(i <  event.formats.length - 1){
                        formats += ", ";
                    };
                }

                var eventObj = {
                    when : when,
                    formats : formats,
                    price : event.price,
                    rounds : event.rounds,
                    description : event.description,
                    LGS_id : event.LGS_id,
                    title : event.title

                }
                this.setState({view: {showModalEventInfo: true},
                    eventObj : eventObj});
            }
        });

        $(calendar).fullCalendar("removeEvents")

        var events = LGSEvents.find().map((event)=>{
            event.id = event._id;
            return event;
        });
        $(calendar).fullCalendar("addEventSource", events)
    }

    componentDidUpdate(){
        var calendar = this.refs["calendar"];
        $(calendar).fullCalendar("removeEvents")
        var events = LGSEvents.find().map((event)=>{
            event.id = event._id;
            return event;
        });

        $(calendar).fullCalendar("addEventSource", events)
    }

    handleHideModalEventInfo(){
        this.setState({view: {showModalEventInfo: false}})
    }

    handleShowModalEventInfo(){
        this.setState({view: {showModalEventInfo: true}})
    }
    handleHideModalAddEvent(){
        this.setState({view: {showModalAddEvent: false}})
    }

    handleShowModalAddEvent(){
        this.setState({view: {showModalAddEvent: true}})
    }

    render() {
        return (
            <div>
                <div ref="calendar"></div>
                {this.state.view.showModalAddEvent ? <LGSAddNewEventToLGSFormModal handleHideModal={this.handleHideModalAddEvent.bind(this)}/> : null}
                {this.state.view.showModalEventInfo ? <LGSEventsCalendarModal handleHideModal={this.handleHideModalEventInfo.bind(this)} eventObject={this.state.eventObj}/> : null}
            </div>
        )
    }
}

function formatDate(date) {
    var hoursPatt = /\d*(?=:)/;
    var minPatt = /\d*(?=$)/;

    var hours = parseInt(date.match(hoursPatt));
    var min = parseInt(date.match(minPatt));

    var AMPM= "AM";
    if (hours >= 12) {
        hours = hours-12;
        AMPM = "PM";
    }
    if (hours == 0) {
        hours = 12;
    }

    min = min<10?"0"+min:min;

    return hours + ":" + min + " " + AMPM;
}

export default LGSEventsCalendar;