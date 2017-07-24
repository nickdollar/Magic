import React from 'react' ;
import EventsTable from './EventsTableMethod/EventsTable.jsx';


export default class EventsTables extends React.Component {
    constructor(){
        super();
        this.state = {eventsSmall : [], eventsBig : []};
    }

    getEventsSmall(Formats_id){
        var LGS_ids = LGS.find({}).map(lgs => lgs._id);
        Meteor.call("eventsSmallMethod", {Formats_id : Formats_id, LGS_ids : LGS_ids}, (err, response)=>{
            this.setState({eventsSmall : response});
        })
    }

    getEventsBig(Formats_id){
        var LGS_ids = LGS.find({}).map(lgs => lgs._id);
        Meteor.call("eventsBigMethod", {Formats_id : Formats_id, LGS_ids : LGS_ids}, (err, response)=>{
            this.setState({eventsBig : response});
        })
    }

    componentDidMount(){
        this.getEventsSmall(this.props.Formats_id);
        this.getEventsBig(this.props.Formats_id);
    }

    componentWillReceiveProps(nextProps){
        this.getEventsSmall(nextProps.Formats_id);
        this.getEventsBig(nextProps.Formats_id);
    }
    render(){
        return(
            <div className="EventsTablesComponent">
                <div className="col-xs-6">
                    <div className="MTGOEventsTable">
                        <div className="sectionHeader">
                            <div className="sectionName">
                                <h2>Small Events</h2>
                            </div>
                        </div>
                        <div className="sectionTable">
                            <EventsTable Events={this.state.eventsSmall}/>
                        </div>
                    </div>
                </div>
                <div className="col-xs-6">
                    <div className="MTGOEventsTable">
                        <div className="sectionHeader">
                            <div className="sectionName">
                                <h2>Big Events</h2>
                            </div>
                        </div>
                        <div className="sectionTable">
                            <EventsTable Events={this.state.eventsBig}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
