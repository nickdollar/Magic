import { createContainer } from 'meteor/react-meteor-data';
import BigEventsCalendar from './BigEventsCalendar.jsx';

export default BigEventsCalendarContainer = createContainer(({}) => {
    var handle = Meteor.subscribe("BIGEventsCalendar", FlowRouter.getParam("format"));
    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        EventsCalendar : EventsCalendar.find({}).fetch()
    };
}, BigEventsCalendar);