import { createContainer } from 'meteor/react-meteor-data';
import CreatedEventInfo from './CreatedEventInfo.jsx';

export default CreatedEventInfoContainer = createContainer(({eventInfo, resetForm}) => {
    console.log("CreatedEventInfoContainer");
    return {
        eventInfo : eventInfo
    };
}, CreatedEventInfo);