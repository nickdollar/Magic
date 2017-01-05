import { createContainer } from 'meteor/react-meteor-data';
import LGSEventsCalendar from './LGSEventsCalendar.jsx';

export default ListContainer = createContainer(({ params }) => {
    var handle = Meteor.subscribe("LGSEventsByStoreInArea", Session.get("position"), Session.get("distance"));
    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        LGSEventsByStoreInArea: LGSEvents.find().fetch(),
    };

}, LGSEventsCalendar);