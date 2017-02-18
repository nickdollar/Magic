import { createContainer } from 'meteor/react-meteor-data';
import ListByStateTable from './ListByStateTable.jsx';

export default ListByStateTableContainer = createContainer(({format}) => {
    var handle = Meteor.subscribe("EventsCalendarNotConfirmed", format);
    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        EventsCalendar : EventsCalendar.find({formats : format}).fetch()
    };
}, ListByStateTable);