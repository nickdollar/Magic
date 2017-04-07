import React from 'react' ;
import EventsTableContainer from './EventsTable/EventsTableContainer.jsx' ;
import EventsTable from './EventsTableMethod/EventsTable.jsx';


export default class EventsTables extends React.Component {
    constructor(){
        super();
        this.state = {eventsSmall : [], eventsBig : []};
    }

    getEventsSmall(){
        var LGS_ids = LGS.find({}).map(lgs => lgs._id);
        Meteor.call("eventsSmall", {format : this.props.format, LGS_ids : LGS_ids}, (err, data)=>{
            this.setState({eventsSmall : data});
        })
    }

    getEventsBig(){
        var LGS_ids = LGS.find({}).map(lgs => lgs._id);
        Meteor.call("eventsBig", {format : this.props.format, LGS_ids : LGS_ids}, (err, data)=>{
            this.setState({eventsBig : data});
        })
    }

    componentDidMount(){
        this.getEventsSmall();
        this.getEventsBig();
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
