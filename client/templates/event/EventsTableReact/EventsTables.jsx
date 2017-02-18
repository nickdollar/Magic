import React from 'react' ;
import EventsTableComponent from './EventsTable/EventsTableComponent.jsx' ;

export default class EventsTables extends React.Component {
    constructor(){
        super();

    }

    render(){
        return(
            <div className="EventsTablesComponent">
                <div className="col-xs-6">
                    <div className="row">
                        <div className="MTGOEventsTable">
                            <div className="sectionHeader">
                                <div className="sectionName">
                                    <h2>Small Events</h2>
                                </div>
                            </div>
                            <div className="sectionTable">
                                <EventsTableComponent subscription="EventsSmall"
                                                      paramsServer={[["decks", "names"], this.props.format]}
                                                      queryClient={{state : {$in : ["decks", "names"]},  format : this.props.format, decks : {$lt : 16}}}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xs-6">
                    <div className="row">
                        <div className="MTGOEventsTable">
                            <div className="sectionHeader">
                                <div className="sectionName">
                                    <h2>Others Events</h2>
                                </div>
                            </div>
                            <div className="sectionTable">
                                <EventsTableComponent subscription="EventsBig"
                                                      paramsServer={[["decks", "names"], this.props.format]}
                                                      queryClient={{state : {$in : ["decks", "names"]},  format : this.props.format, decks : {$gte : 16}}}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}