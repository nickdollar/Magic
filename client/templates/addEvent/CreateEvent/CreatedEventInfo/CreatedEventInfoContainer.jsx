import { createContainer } from 'meteor/react-meteor-data';
import CreatedEventInfo from './CreatedEventInfo.jsx';

export default CreatedEventInfoContainer = createContainer(({eventInfo, resetForm}) => {
    var handle = Meteor.subscribe("LGSByLocationDistance", Session.get("position"), Session.get("distance"), Session.get('positionOption'), Session.get('state'), Session.get('ZIP'));
    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        eventInfo : eventInfo
    };
}, CreatedEventInfo);