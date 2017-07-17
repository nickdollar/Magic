import React from 'react' ;
import moment from 'moment';
export default class ConfirmEvents extends React.Component {
    constructor(){
        super();
        this.state = {Events : []}
    }


    getEventToConfirm(){
        Meteor.call("getEventsToConfirmMethod", (err, response)=>{
            this.setState({Events : response});
        });
    }

    componentDidMount(){
        this.getEventToConfirm();
    }

    render(){
        return(
            <div className="ConfirmEventsComponent">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Link</th>
                            <th>_id</th>
                            <th>State</th>
                            <th>Date</th>
                            <th>Lock</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.Events.map((event)=>{
                        return  <tr key={event._id}>
                                    <td><a href={FlowRouter.path("selectedEvent", {format : event.Formats_id, Events_id : event._id})}>link</a></td>
                                            <td>{event._id}</td>
                                            <td>{event.state}</td>
                                            <td>{moment(event.date).format("MM/DD")}</td>
                                            <td><button onClick={()=>{Meteor.call("confirmLGSPrePublishMethod", {Events_id : event._id}, ()=>{this.getEventToConfirm()})}}>Lock</button></td>
                                </tr>
                    })}
                    </tbody>
                </table>
            </div>
        );
    }
}