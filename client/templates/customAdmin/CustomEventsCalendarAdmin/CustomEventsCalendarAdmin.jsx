import React from 'react' ;
import ListByStateTableContainer from './ListByState/ListByStateTableContainer.jsx';

export default class CustomEventsCalendar extends React.Component {
    constructor(){
        super();

    }

    render(){
        return(
            <div className="CustomEventsCalendarComponent">
                <ListByStateTableContainer/>
            </div>
        );
    }
}