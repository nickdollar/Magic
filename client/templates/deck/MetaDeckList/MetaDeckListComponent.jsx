import { createContainer } from 'meteor/react-meteor-data';
import MetaDeckList from './MetaDeckList.jsx';

export default MetaDeckListComponent = createContainer(({}) => {


    return {
        currentUser: Meteor.user(),
        Formats_id : Formats.findOne({names : {$regex : FlowRouter.getParam("format"), $options : "i"}})
    };
}, MetaDeckList);