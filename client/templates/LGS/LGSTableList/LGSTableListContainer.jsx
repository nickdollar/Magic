import { createContainer } from 'meteor/react-meteor-data';
import LGSTableList from './LGSTableList.jsx';

export default ListContainer = createContainer(({}) => {
    console.log("ListContainer");
    return {
        LGS: LGS.find().fetch(),
        positionOption : Session.get("positionOption")
    };
}, LGSTableList);