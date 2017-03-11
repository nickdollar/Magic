import React from 'react' ;
import EventsTableContainer from './EventsTable/EventsTableContainer.jsx' ;

export default class EventsTables extends React.Component {
    constructor(){
        super();

    }

    render(){
        var lgs_id = this.props.LGS.map((LGSObj)=>{
            return LGSObj._id
        })
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
                            <EventsTableContainer subscription="EventsSmall"
                                                  paramsServer={[["decks", "names", "published"], this.props.format, lgs_id]}
                                                  queryClient={{state : {$in : ["decks", "names", "published"]},  format : this.props.format, $or : [{decks : {$lt : 16}}, {type : "lgs"}]}}
                            />
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
                            <EventsTableContainer subscription="EventsBig"
                                                  paramsServer={[["decks", "names"], this.props.format]}
                                                  queryClient={{state : {$in : ["decks", "names"]},  format : this.props.format, decks : {$gte : 16}}}
                                                  format = {this.props.format}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
