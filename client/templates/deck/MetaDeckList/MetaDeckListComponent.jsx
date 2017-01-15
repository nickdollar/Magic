import { createContainer } from 'meteor/react-meteor-data';
import MetaDeckList from './MetaDeckList.jsx';

export default AutoCompleteContainer = createContainer(({}) => {

    return {
        currentUser: Meteor.user(),
        format : FlowRouter.getParam("format")
    };
}, MetaDeckList);