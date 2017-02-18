import { createContainer } from 'meteor/react-meteor-data';
import EventsTable from './EventsTable.jsx';

export default EventsTableSmallContainer = createContainer(({subscription, paramsServer, queryClient}) => {
    var handle = Meteor.subscribe(subscription, ...paramsServer);

    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        Events : Events.find(queryClient).fetch()
    };
}, EventsTable);