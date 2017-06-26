import { createContainer } from 'meteor/react-meteor-data';
import CreateEventForm from './CreateEventForm.jsx';

export default CreateEventFormContainer = createContainer(({}) => {
    console.log("CreateEventFormContainer");
    return {
        LGS : LGS.find().fetch()
    };
}, CreateEventForm);