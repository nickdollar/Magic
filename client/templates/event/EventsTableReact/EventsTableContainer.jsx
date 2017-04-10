import { createContainer } from 'meteor/react-meteor-data';
import EventsTables from './EventsTables.jsx';

export default EventsTableContainer = createContainer(({}) => {
    return {
        currentUser: Meteor.user(),
        Formats_id : getFormat_idFromLink(FlowRouter.getParam("format")),
        LGS : LGS.find({}).fetch()
    };
}, EventsTables);