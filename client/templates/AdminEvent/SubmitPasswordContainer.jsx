import { createContainer } from 'meteor/react-meteor-data';
import SubmitPassword from './SubmitPassword.jsx';

export default SubmitPasswordContainer = createContainer(({confirmPassword}) => {
    console.log(FlowRouter.getParam("event_id"));
    var handle = Meteor.subscribe("EventBy_id", FlowRouter.getParam("event_id"));

    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        confirmPassword : confirmPassword
    };
}, SubmitPassword);