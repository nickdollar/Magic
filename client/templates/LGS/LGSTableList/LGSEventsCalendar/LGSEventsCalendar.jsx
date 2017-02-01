import React from 'react' ;
import LGSEventsCalendarModal  from './LGSEventsCalendarModal.jsx';
import ModalFirstPage from '/client/dumbReact/Modal/ModalFirstPage.jsx';
import FormValidate from '/client/dumbReact/FormValidate/FormValidate.jsx';
import TextFormInput from '/client/dumbReact/FormValidate/Inputs/TextFormInput/TextFormInput.jsx';
import Select2Container from '/client/dumbReact/FormValidate/Inputs/Select2/Select2Container.jsx';
import NumberInput from '/client/dumbReact/FormValidate/Inputs/NumberInput/NumberInput.jsx';
import HoursInput from '/client/dumbReact/FormValidate/Inputs/HoursInput/HoursInput.jsx';
import TextAreaInput from '/client/dumbReact/FormValidate/Inputs/TextAreaInput/TextAreaInput.jsx';
import Radio from '/client/dumbReact/FormValidate/Inputs/Radios/Radio.jsx';


import Moment from "moment";

var weekDays = {0 : "Sunday", 1 : "Monday", 2 : "Tuesday", 3 : "Wednesday", 4 : "Thursday", 5 : "Friday", 6 : "Saturday" };

class LGSEventsCalendar extends React.Component {
    constructor(){
        super();

        this.state = {
            showModalAddEvent: false,
            showModalEventInfo: false,
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
                    text: 'Request To Add Event',
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
                    price : "$" + event.price,
                    rounds : event.rounds,
                    description : event.description,
                    LGS_id : event.LGS_id,
                    title : event.title

                }
                this.setState({ showModalEventInfo: true,
                                eventObj : eventObj
                });
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
            event.dow = [parseInt(event.day)]
            return event;
        });

        $(calendar).fullCalendar("addEventSource", events)
    }

    handleHideModalEventInfo(){
        this.setState({showModalEventInfo: false})
    }

    handleShowModalEventInfo(){
        this.setState({showModalEventInfo: true})
    }
    handleHideModalAddEvent(){
        this.setState({showModalAddEvent: false})
    }

    handleShowModalAddEvent(){
        this.setState({showModalAddEvent: true})
    }

    render() {
        return (
            <div>
                <div ref="calendar"></div>
                <ModalFirstPage showModal={this.state.showModalAddEvent}
                                handleHideModal={this.handleHideModalAddEvent.bind(this)}
                                title="Request To Add Event" >
                    <FormValidate submitMethod="addLGSEvents">
                        <TextFormInput
                            objectName={"name"}
                            title="Event Name"
                            errorMessage="Name is Missing"
                            required={true}
                        />
                        <Select2Container
                            objectName={"LGS_id"}
                            title="Local Game Store"
                            errorMessage="LGS Missing"
                            collection="LGS"
                            subscription="LGSByDistanceToAddEvent"
                            query={[Session.get("position"), Session.get("distance")]}
                            required={true}
                            fieldUnique="_id"
                            fieldText="name"
                        />
                        <NumberInput
                            objectName={"price"}
                            title="Price"
                            errorMessage="Price is Missing"
                            required={true}
                            min={0}
                        />

                        <Radio
                            objectName={"format"}
                            title="Format"
                            opts={[ {value : "modern", text : "modern"},
                                    {value : "standard", text : "standard"},
                                    {value : "legacy", text : "legacy"},
                                    {value : "vintage", text : "vintage"}]
                            }
                            errorMessage="Format is Missing"
                            required={true}
                        />

                        <NumberInput
                            objectName={"rounds"}
                            title="Min Rounds"
                            errorMessage="Round is Missing"
                            required={true}
                            min={0}
                        />
                        <Radio
                            objectName={"day"}
                            title="Day"
                            opts={[ {value : 0, text : "Sun"},
                                    {value : 1, text : "Mon"},
                                    {value : 2, text : "tues"},
                                    {value : 3, text : "Wed"},
                                    {value : 4, text : "Thurs"},
                                    {value : 5, text : "Fri"},
                                    {value : 6, text : "Sat"},
                                ]}
                            errorMessage="Day is Missing"
                            required={true}
                        />
                        <HoursInput
                            objectName={"startTime"}
                            title="Start Time"
                            errorMessage="Round is Missing"
                            required={true}
                            min={0}
                        />
                        <TextAreaInput
                            objectName={"description"}
                            title="Extra Information"
                            errorMessage="Extra Information"
                            required={true}
                        />



                    </FormValidate>
                </ModalFirstPage>
                {this.state.showModalEventInfo ? <LGSEventsCalendarModal handleHideModal={this.handleHideModalEventInfo.bind(this)} eventObject={this.state.eventObj}/> : null}
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