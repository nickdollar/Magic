import { createContainer } from 'meteor/react-meteor-data';
import LGSNameField from './LGSNameField.jsx';

export default LGSNameFieldContainer = createContainer(({ onComponenetMounted, objectName, title, errorMessage }) => {
    return {
        LGSByLocationDistance: LGSEvents.find().fetch(),
        onComponenetMounted : onComponenetMounted,
        title : title,
        objectName : objectName,
        errorMessage : errorMessage
    };

}, LGSNameField);