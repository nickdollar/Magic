import { createContainer } from 'meteor/react-meteor-data';
import EventsTable from './EventsTable';

export default EventsTableSmallContainer = createContainer(({subscription, paramsServer, queryClient, format}) => {
    var handle = Meteor.subscribe(subscription, ...paramsServer);

    return {
        currentUser: Meteor.user(),
        listLoading: !handle.ready(),
        Events : Events.find(queryClient).fetch()
    };
}, EventsTable);
