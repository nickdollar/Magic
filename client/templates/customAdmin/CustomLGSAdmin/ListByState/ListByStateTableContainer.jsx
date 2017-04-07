import { createContainer } from 'meteor/react-meteor-data';
import ListByStateTable from './ListByStateTable.jsx';

export default ListByStateTableContainer = createContainer(({state, Formats_id}) => {
    var handle = Meteor.subscribe("LGSEventsStateFormat", state, Formats_id);

    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        LGSEvents : LGSEvents.find({state : state, Formats_id : Formats_id}).fetch()
    };
}, ListByStateTable);