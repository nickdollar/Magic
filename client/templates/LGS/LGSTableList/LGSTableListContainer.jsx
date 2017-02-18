import { createContainer } from 'meteor/react-meteor-data';
import LGSTableList from './LGSTableList.jsx';

export default ListContainer = createContainer(({}) => {
    var handle = Meteor.subscribe("LGSByLocationDistance", Session.get("position"), Session.get("distance"), Session.get("positionOption"), Session.get("state"), Session.get("ZIP"));
    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        LGS: LGS.find().fetch(),
    };
}, LGSTableList);