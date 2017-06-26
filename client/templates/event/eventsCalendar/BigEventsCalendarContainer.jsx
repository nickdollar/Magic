import { createContainer } from 'meteor/react-meteor-data';
import BigEventsCalendar from './BigEventsCalendar.jsx';

export default BigEventsCalendarContainer = createContainer(({}) => {
    console.log("BigEventsCalendarContainer");
    return {
        Formats_id : FlowRouter.getParam("format").substring(0,3).toLowerCase(),
    };
}, BigEventsCalendar);