import React from 'react' ;
import ListByStateTableContainer from './ListByStateTable/ListByStateTableContainer.jsx';

export default class CustomEventsCalendar extends React.Component {
    constructor(){
        super();

    }

    render(){
        return(
            <div className="CustomEventsCalendarComponent">
                <ListByStateTableContainer Formats_id={this.props.Formats_id}
                />
            </div>
        );
    }
}