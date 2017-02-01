import { createContainer } from 'meteor/react-meteor-data';
import ListByStateTable from './ListByStateTable.jsx';

export default ListByStateTableContainer = createContainer(({state, format}) => {
    var handle = Meteor.subscribe("LGSEventsStateFormat", state, format);

    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        LGSEvents : LGSEvents.find({state : state, format : format}).fetch()
    };
}, ListByStateTable);