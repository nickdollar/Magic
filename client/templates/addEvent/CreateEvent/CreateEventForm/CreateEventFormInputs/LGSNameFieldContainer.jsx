import { createContainer } from 'meteor/react-meteor-data';
import LGSNameField from './LGSNameField.jsx';

export default LGSNameFieldContainer = createContainer(({ onComponenetMounted, objectName, title, errorMessage }) => {
    var handle = Meteor.subscribe("LGSByLocationDistance", Session.get("position"), Session.get("distance"), Session.get('positionOption'), Session.get('state'), Session.get('ZIP'));    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        LGSByLocationDistance: LGSEvents.find().fetch(),
        onComponenetMounted : onComponenetMounted,
        title : title,
        objectName : objectName,
        errorMessage : errorMessage
    };

}, LGSNameField);