import { createContainer } from 'meteor/react-meteor-data';
import Meta from './Meta.jsx';

export default MetaContainer = createContainer(({}) => {
    var format = FlowRouter.getParam("format");
    return {
        currentUser: Meteor.user(),
        format : format,
        LGS : LGS.find().fetch()
    };
}, Meta);