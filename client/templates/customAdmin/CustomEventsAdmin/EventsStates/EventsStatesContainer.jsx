import { createContainer } from 'meteor/react-meteor-data';
import EventsStates from './EventsStates.jsx';

export default EventsStatesContainer = createContainer(({}) => {
    var handle = Meteor.subscribe("EventsGetState");
    return {
        currentUser: Meteor.user(),
        collectionsLoading: !handle.ready(),
    };
}, EventsStates);