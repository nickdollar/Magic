import { createContainer } from 'meteor/react-meteor-data';
import Meta from './Meta.jsx';

export default MetaContainer = createContainer(({}) => {

    console.log("MetaContainer2");

    return {
        Formats_id : getFormat_idFromLink(FlowRouter.getParam("format")),
        // LGS : LGS.find({}).fetch()
    };
}, Meta);