import { createContainer } from 'meteor/react-meteor-data';
import AddEvent from './AddEvent.jsx';

export default AddEventContainer = createContainer(({ getUsersCreatedEvent }) => {
    return {
        LGS: LGS.find().fetch(),
    };
}, AddEvent);