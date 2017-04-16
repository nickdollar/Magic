import { createContainer } from 'meteor/react-meteor-data';
import BigEventsCalendar from './BigEventsCalendar.jsx';

export default BigEventsCalendarContainer = createContainer(({}) => {
    return {
        Formats_id : getFormat_idFromLink(FlowRouter.getParam("format"))
    };
}, BigEventsCalendar);