import { createContainer } from 'meteor/react-meteor-data';
import AddEvent from './AddEvent.jsx';

export default AddEventContainer = createContainer(({}) => {
    return {
         LGS : LGS.find({}).fetch()
    };
}, AddEvent);