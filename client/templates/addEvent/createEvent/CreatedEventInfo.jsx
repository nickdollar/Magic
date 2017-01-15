import React from "react";
import moment from "moment";
class CreateEventInfo extends React.Component{
    constructor() {
        super();
        this.state = {
            inputValue : ""
        }
    }

    storeName(){
        return LGS.findOne({_id : this.props.eventInfo.LGS_id}).name + " (" +LGS.findOne({_id : this.props.eventInfo.LGS_id}).location.city + ")"
    }

    render() {
        return (
            <div>
                <div>
                    <span className="rightTitle">LGS: </span><span className="leftInformation">{this.storeName()}</span>
                </div>
                <div>
                    <span className="rightTitle">Event name: </span><span className="leftInformation">{this.props.eventInfo.eventName}</span>
                </div>
                <div>
                    <span className="rightTitle">Date: </span><span className="leftInformation">{moment(this.props.date).format("LL")}</span>
                </div>
                <div>
                    <span className="rightTitle">Token: </span><span className="leftInformation">{this.props.eventInfo.token}</span>
                </div>
                <div>
                    <span className="rightTitle">Format: </span><span className="leftInformation">{this.props.eventInfo.format}</span>
                </div>
                <div>
                    <span className="rightTitle">link: </span><span className="leftInformation"><a href={"/adminEvent/" + this.props.eventInfo.Event_id}>{"www.crowdmtg.com/adminEvent/" + this.props.eventInfo.Event_id}</a></span>
                </div>
                <button onClick={this.props.closeCreatedEventInfo}>Close and Create a New Event</button>
            </div>
            
        )
    }
}

export default CreateEventInfo;