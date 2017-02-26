import { createContainer } from 'meteor/react-meteor-data';
import SubmitPassword from './AdminEventSubmitPassword.jsx';

export default SubmitPasswordContainer = createContainer(({confirmPassword}) => {
    var handle = Meteor.subscribe("EventBy_id", FlowRouter.getParam("Event_id"));

    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        confirmPassword : confirmPassword
    };
}, SubmitPassword);