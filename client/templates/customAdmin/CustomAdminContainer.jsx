import { createContainer } from 'meteor/react-meteor-data';
import CustomAdminContainer from './CustomAdminContainer.jsx';

export default CustomAdminContainerContainer = createContainer(({}) => {

    return {
        collection :  FlowRouter.getParam("")

    };
}, CustomAdminContainer);