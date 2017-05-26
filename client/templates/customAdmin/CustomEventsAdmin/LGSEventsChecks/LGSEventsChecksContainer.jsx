import { createContainer } from 'meteor/react-meteor-data';
import LGSEventsChecks from './LGSEventsChecks.jsx';

export default LGSEventsChecksContainer = createContainer(({}) => {
    var handle = Meteor.subscribe("EventsLGS");

    return {
        listLoading: ! handle.ready(),
        Events : Events.find({state : {$in : ["created", "locked", "published"]}}).fetch()
    };
}, LGSEventsChecks);