import { createContainer } from 'meteor/react-meteor-data';
import LGSLatestEvents from './LGSLatestEvents.jsx';

export default LGSLastestEventsContainer = createContainer(({DecksData_id}) => {
    var handle = Meteor.subscribe("DecksDataBy_id_NonReactive", DecksData_id);
    var handle2 = Meteor.subscribe("CardsDataFromDeckData_id_NonReactive", DecksData_id);
    return {
        currentUser: Meteor.user(),
        listLoading: !(handle.ready() && handle2.ready()),
    };
}, LGSLatestEvents);