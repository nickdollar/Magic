import React from 'react' ;
import CreateEventForm from './CreateEventForm/CreateEventForm.jsx';
import CreatedEventInfoContainer from './CreatedEventInfo/CreatedEventInfoContainer.jsx';


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

    resetForm(){
        this.setState(
                {
                eventInfo : {
                    LGS : "",
                    name : "",
                    token : "",
                    emailInput : "",
                    formatsInput : "",

                },
                createdEventInfo : false
            }
        );
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
                    {this.state.createdEventInfo ? <CreatedEventInfoContainer closeCreatedEventInfo = {this.closeCreatedEventInfo.bind(this)}
                                                                              eventInfo={this.state.eventInfo}
                                                                              resetForm={this.resetForm.bind(this)}/>
                        : <CreateEventForm receiveCreatedEventInfo={this.receiveCreatedEventInfo.bind(this)}
                                           LGS={this.props.LGS}
                        />}
                </div>
            </div>
        )
    }
}

export default CreateEvent;