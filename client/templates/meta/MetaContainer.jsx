import { createContainer } from 'meteor/react-meteor-data';
import Meta from './Meta.jsx';

export default MetaContainer = createContainer(({}) => {

    return {
        Formats_id : FlowRouter.getParam("format").substring(0,3).toLowerCase(),
    };
}, Meta);