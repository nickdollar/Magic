import { createContainer } from 'meteor/react-meteor-data';
import CreatedEventInfo from './CreatedEventInfo.jsx';

export default CreatedEventInfoContainer = createContainer(({eventInfo, resetForm}) => {
    return {
        eventInfo : eventInfo
    };
}, CreatedEventInfo);