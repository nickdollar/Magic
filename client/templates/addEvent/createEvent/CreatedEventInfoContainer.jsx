import { createContainer } from 'meteor/react-meteor-data';
import CreatedEventInfo from './CreatedEventInfo.jsx';

export default CreatedEventInfoContainer = createContainer(({eventInfo}) => {
    var handle = Meteor.subscribe("LGSByLocationDistance", Session.get("position"), Session.get("distance"));
    
    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        eventInfo : eventInfo
    };
}, CreatedEventInfo);