import { createContainer } from 'meteor/react-meteor-data';
import MetaDeckList from './MetaDeckList.jsx';

export default MetaDeckListComponent = createContainer(({}) => {
    return {
        Formats_id : FlowRouter.getParam("format").substring(0,3).toLowerCase(),
    };
}, MetaDeckList);