import { createContainer } from 'meteor/react-meteor-data';
import EventDeckListAdmin from './EventDeckListAdmin';

export default EventDeckListAdminContainer = createContainer(({_id}) => {
    var handle = Meteor.subscribe("DecksDataFromEvent_idSimplified", _id);
    var handle2 = Meteor.subscribe('EventBy_id');

    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        listLoading2: ! handle2.ready(),
        Event : Events.findOne({_id : _id}),
        EventDecks : DecksData.find({Events_id : _id}).fetch(),

    };
}, EventDeckListAdmin);