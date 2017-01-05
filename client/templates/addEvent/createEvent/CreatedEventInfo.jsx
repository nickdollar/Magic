import React from "react";

class CreateEventInfo extends React.Component{
    constructor() {
        super();
        this.state = {
            inputValue : ""
        }
    }

    render() {
        return (
            <div>
                <div>
                    <span className="rightTitle">LGS:</span><span className="leftInformation">{this.props.eventInfo.lgs_id}</span>
                </div>
                <div>
                    <span className="rightTitle">Event name:</span><span className="leftInformation">{this.props.eventInfo.eventName}</span>
                </div>
                <div>
                    <span className="rightTitle">Token:</span><span className="leftInformation">{this.props.eventInfo.token}</span>
                </div>
                <div>
                    <span className="rightTitle">Format:</span><span className="leftInformation">{this.props.eventInfo.formatsInput}</span>
                </div>
                <div>
                    <span className="rightTitle">Format:</span><span className="leftInformation">{this.props.eventInfo.formatsInput}</span>
                </div>
            </div>
        )
    }
}

export default CreateEventInfo;