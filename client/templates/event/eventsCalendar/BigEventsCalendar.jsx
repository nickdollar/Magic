import React from 'react' ;
import ModalFirstPage from '/client/dumbReact/Modal/ModalFirstPage.jsx';
import FormValidate from '/client/dumbReact/FormValidate/FormValidate.jsx';
import TextFormInput from '/client/dumbReact/FormValidate/Inputs/TextFormInput/TextFormInput.jsx';
import URLTextInput from '/client/dumbReact/FormValidate/Inputs/URLTextInput/URLTextInput.jsx';
import TextAreaInput from '/client/dumbReact/FormValidate/Inputs/TextAreaInput/TextAreaInput.jsx';
import DateHoursInput from '/client/dumbReact/FormValidate/Inputs/DateHoursInput/DataHoursInput.jsx';
import CheckBox from '/client/dumbReact/FormValidate/Inputs/Checkbox/Checkbox.jsx';
import GoogleAddresAutoComplete from '/client/dumbReact/FormValidate/Inputs/GoogleAddressAutoComplete/GoogleAddressAutoComplete.jsx'



export default class BigEventsCalendar extends React.Component {
    constructor(){
        super();
        this.state = {
            showModalAddEvent: false,
            showModalEventInfo: false,
            events : []
        }
    }

    handleHideModalAddEvent(){
        this.setState({showModalAddEvent: false})
    }

    handleShowModalAddEvent(){
        this.setState({showModalAddEvent: true})
    }

    componentWillReceiveProps(){
        this.eventsUpdate();
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
        this.eventsUpdate();
    }

    eventsUpdate(){
        var calendar = this.refs["calendar"];
        $(calendar).fullCalendar("removeEvents");
        Meteor.call("getBigEventsCalendar", {Formats_id : this.props.Formats_id}, (err, response)=>{
            var events = response.map((event)=>{
                event.id = event._id;
                return event;
            });
            $(this.refs.calendar).fullCalendar("addEventSource", events)
        })
    }

    render(){
        return(
            <div className="BigEventsCalendarComponent">
                <h2>Future Events</h2>
                <div ref="calendar"></div>
                <ModalFirstPage showModal={this.state.showModalAddEvent}
                                handleHideModal={this.handleHideModalAddEvent.bind(this)}
                                title="Add Event (Will Be Added After Confirmation)" >
                    <FormValidate submitMethod={"addBigEvent"}>
                        <TextFormInput
                            objectName={"title"}
                            title="Event Title"
                            errorMessage="Name is Missing"
                            required={true}
                        />
                        <URLTextInput
                            objectName={"url"}
                            title="URL Source Info"
                            errorMessage="URL Wrong Syntax"
                            required={true}
                        />
                        <URLTextInput
                            objectName={"streamURL"}
                            title="Stream URL"
                            errorMessage="URL Wrong Syntax"
                        />
                        <CheckBox
                            objectName={"Formats_id"}
                            title="Format"
                            opts={getFormatsForForm()}
                            errorMessage="Format is Missing"
                            required={true}
                            minimunRequired={1}
                        />
                        <GoogleAddresAutoComplete
                            objectName="address"
                            title="Event Location"
                        />
                        <DateHoursInput
                            objectName="start"
                            title="Event Start Time"
                        />
                        <TextAreaInput
                            objectName={"description"}
                            title="Extra Information"
                            errorMessage="Extra Information"
                            required={true}
                        />
                    </FormValidate>
                </ModalFirstPage>

            </div>
        );
    }
}