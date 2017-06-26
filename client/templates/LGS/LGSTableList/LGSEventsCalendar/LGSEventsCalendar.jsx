import React from 'react' ;
import LGSEventsCalendarModal  from './LGSEventsCalendarModal/LGSEventsCalendarModal.jsx';
import ModalFirstPage from '/client/dumbReact/Modal/ModalFirstPage.jsx';
import FormValidate from '/client/dumbReact/FormValidate/FormValidate.jsx';
import TextFormInput from '/client/dumbReact/FormValidate/Inputs/TextFormInput/TextFormInput.jsx';
import Select2Container from '/client/dumbReact/FormValidate/Inputs/Select2/Select2Container.jsx';
import NumberInput from '/client/dumbReact/FormValidate/Inputs/NumberInput/NumberInput.jsx';
import HoursInput from '/client/dumbReact/FormValidate/Inputs/HoursInput/HoursInput.jsx';
import TextAreaInput from '/client/dumbReact/FormValidate/Inputs/TextAreaInput/TextAreaInput.jsx';
import Radio from '/client/dumbReact/FormValidate/Inputs/Radios/Radio.jsx';


var weekDays = {0 : "Sunday", 1 : "Monday", 2 : "Tuesday", 3 : "Wednesday", 4 : "Thursday", 5 : "Friday", 6 : "Saturday" };

export default class LGSEventsCalendar extends React.Component {
    constructor(){
        super();

        this.state = {
            showModalAddEvent: false,
            showModalEventInfo: false,
            events : [],
        }
    }


    getEventsFromServer(LGS){
        if(!LGS){
            return;
        }
        var arraysOfLGS_id = LGS.filter((obj)=>{
            return obj.checked == true && obj.showing == true;
        }).map((obj)=>{
            return  obj._id
        });
        Meteor.call("getLGSEventsFromId", arraysOfLGS_id, (err, data)=>{
            this.state.events = data
            this.eventsUpdate();
        });
    }

    componentDidMount(){
        var calendar = this.refs["calendar"];
        $(calendar).fullCalendar({
            header: {
                left: '',
                center: 'prev title next',
                right: ''
            },
            defaultView : "agendaWeek",
            customButtons: {
                addEvent: {
                    text: 'Request To Add Event',
                    click: ()=> {
                        this.handleShowModalAddEvent()
                    }
                }
            },
            minTime : "11:00",
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
        this.getEventsFromServer(this.props.LGS);
    }

    eventsUpdate(){
        var calendar = this.refs["calendar"];
        $(calendar).fullCalendar("removeEvents")
        var events = this.state.events.map((event)=>{
            event.id = event._id;
            event.dow = [parseInt(event.day)]
            if(event.format == "modern"){
                event.color = "#2E0E02";
            }else if(event.format == "standard"){
                event.color = "#764248";
            }else if(event.format == "legacy"){
                event.color = "#1E2D2F";
            }else if(event.format == "vintage"){
                event.color = "#041F1E";
            }
            return event;
        });
        $(calendar).fullCalendar("addEventSource", events)
    }

    // componentDidUpdate(){
    //     this.eventsUpdate();
    // }

    handleHideModalEventInfo(){
        this.setState({showModalEventInfo: false})
    }

    handleHideModalAddEvent(){
        this.setState({showModalAddEvent: false})
    }

    handleShowModalAddEvent(){
        this.setState({showModalAddEvent: true})
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.LGS){
            this.getEventsFromServer(nextProps.LGS)
        }

    }

    render() {
        return (
            <div className="LGSEventsCalendarContainer">
                <div ref="calendar"></div>
                <ModalFirstPage showModal={this.state.showModalAddEvent}
                                handleHideModal={this.handleHideModalAddEvent.bind(this)}
                                title="Request To Add Event" >
                    <FormValidate submitMethod="addLGSEventsMethod">
                        <TextFormInput
                            objectName={"title"}
                            title="Event Title"
                            errorMessage="Name is Missing"
                            required={true}
                        />
                        <Select2Container
                            objectName={"LGS_id"}
                            title="Local Game Store"
                            errorMessage="LGS Missing"
                            collection="LGS"
                            subscription="LGSByDistanceToAddEvent"
                            serverQuery={[Session.get("position"), Session.get("distance")]}
                            clientQuery={{}}
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
                            objectName={"Formats_id"}
                            title="Format"
                            opts={getFormatsForForm()}
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



getFormatsForForm = ()=>{
    return Formats.find({active : 1}).map(format=>{
        return Object.assign(format, {value : format._id, text : format.name});
    })
}