import { createContainer } from 'meteor/react-meteor-data';
import MetaDeckList from './MetaDeckList.jsx';

export default MetaDeckListComponent = createContainer(({}) => {
    return {
        Formats_id : getFormat_idFromLink(FlowRouter.getParam("format"))
    };
}, MetaDeckList);