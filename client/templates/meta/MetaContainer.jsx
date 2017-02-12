import { createContainer } from 'meteor/react-meteor-data';
import Meta from './Meta.jsx';

export default MetaContainer = createContainer(({}) => {

    return {
        currentUser: Meteor.user(),
        format : FlowRouter.getParam("format")
    };
}, Meta);