import { createContainer } from 'meteor/react-meteor-data';
import ListByStateTable from './ListByStateTable.jsx';

export default ListByStateTableContainer = createContainer(({Formats_id}) => {
    var handle = Meteor.subscribe("EventsCalendarNotConfirmed", Formats_id);
    return {
        listLoading: ! handle.ready(),
        EventsCalendar : EventsCalendar.find({Formats_id : Formats_id}).fetch()
    };
}, ListByStateTable);