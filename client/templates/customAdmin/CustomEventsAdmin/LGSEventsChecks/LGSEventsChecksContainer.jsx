import { createContainer } from 'meteor/react-meteor-data';
import LGSEventsChecks from './LGSEventsChecks.jsx';

export default LGSEventsChecksContainer = createContainer(({}) => {
    var handle = Meteor.subscribe("EventsLGS");

    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        Events : Events.find({state : {$in : ["prePublish", "published"]}}).fetch()
    };
}, LGSEventsChecks);