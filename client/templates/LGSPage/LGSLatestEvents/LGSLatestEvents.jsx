import React from 'react' ;
import Moment from 'moment' ;

export default class LGSLatestEvents extends React.Component {
    constructor(){
        super();
        this.state = {events : []}
    }

    getEventsByLGS_id(){
        Meteor.call("getEventsByLGS_idMethod", {LGS_id : this.props.LGS_id}, (err, response)=>{
            console.log(response);
            this.setState({events : response});
        })
    }

    componentDidMount(){
        this.getEventsByLGS_id();
    }


    render(){
        return(
            <div className="LGSLatestEventsComponent">
                <div className="row-wrapper row-wrapper--white-bg">
                    <div className="row-wrapper__title">
                        Latest Events
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Event</th>
                                <th>Name</th>
                                <th>Format</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.state.events.map((event)=>{
                            var lgs = LGS.findOne({_id : event.LGS_id});
                            return  <tr key={event._id}>
                                <td ><a href={FlowRouter.path("selectedEvent", {format : getLinkFormat(event.Formats_id), Events_id : event._id})}>Link</a></td>
                                <td>{event.name}</td>
                                <td>{Formats.findOne({_id : event.Formats_id}) ? Formats.findOne({_id : event.Formats_id}).name : event.Formats_id}</td>
                                <td>{Moment(event.date).format("L")}</td>
                            </tr>
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}