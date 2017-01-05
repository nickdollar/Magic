import { createContainer } from 'meteor/react-meteor-data';
import List from './LGSTableList.jsx';

export default ListContainer = createContainer(({ params }) => {
    var handle = Meteor.subscribe("LGSByLocationDistance", Session.get("position"), Session.get("distance"));
    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        LGS: LGS.find().fetch(),
    };

}, List);