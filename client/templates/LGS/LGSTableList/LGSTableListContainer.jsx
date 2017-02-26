import { createContainer } from 'meteor/react-meteor-data';
import LGSTableList from './LGSTableList.jsx';

export default ListContainer = createContainer(({}) => {
    return {
        currentUser: Meteor.user(),
        LGS: LGS.find().fetch(),
        positionOption : Session.get("positionOption")
    };
}, LGSTableList);