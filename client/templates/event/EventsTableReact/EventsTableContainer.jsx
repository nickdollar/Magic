import { createContainer } from 'meteor/react-meteor-data';
import EventsTables from './EventsTables.jsx';

export default EventsTableContainer = createContainer(({}) => {
    console.log("EventsTableContainer");

    return {
        Formats_id : FlowRouter.getParam("format").substring(0,3).toLowerCase(),
        LGS : LGS.find({}).fetch()
    };
}, EventsTables);