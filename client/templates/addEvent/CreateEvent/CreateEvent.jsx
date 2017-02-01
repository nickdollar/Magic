import React from 'react' ;
import CreateEventForm from './CreateEventForm.jsx';
import CreatedEventInfoContainer from './CreatedEventInfoContainer.jsx';


class CreateEvent extends React.Component{

    constructor(props){
        super();
        this.state = {
            eventInfo : {
                LGS : "",
                name : "",
                token : "",
                emailInput : "",
                formatsInput : "",

            },
            createdEventInfo : false
        };

    }

    componentDidMount(){

    }

    receiveCreatedEventInfo (data){
        this.setState(
                        {
                            eventInfo : data,
                            createdEventInfo: true
                        }
        )
    }

    closeCreatedEventInfo (data){
        this.setState(
            {
                eventInfo : {
                    LGS : "",
                    name : "",
                    token : "",
                    emailInput : "",
                    formatsInput : "",

                },
                createdEventInfo: false
            }
        )
    }

    render(){
        return (
            <div>
                <h3>Create Event</h3>
                <div className="createEvent">
                    {this.state.createdEventInfo ? <CreatedEventInfoContainer closeCreatedEventInfo = {this.closeCreatedEventInfo.bind(this)} eventInfo={this.state.eventInfo}/> : <CreateEventForm receiveCreatedEventInfo={this.receiveCreatedEventInfo.bind(this)}/>}
                </div>
            </div>
        )
    }
}

export default CreateEvent;