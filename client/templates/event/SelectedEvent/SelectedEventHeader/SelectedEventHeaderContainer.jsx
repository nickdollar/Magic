import { createContainer } from 'meteor/react-meteor-data';
import SelectedEvent from './SelectedEvent.jsx';

export default SelectedEventContainer = createContainer(({Events_id}) => {
    var handle = Meteor.subscribe("EventsById", Events_id);

    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        Event : Events.find({}).fetch()
    };
}, SelectedEvent);