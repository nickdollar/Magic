import { createContainer } from 'meteor/react-meteor-data';
import SubmitPassword from './AdminEventSubmitPassword.jsx';

export default SubmitPasswordContainer = createContainer(({confirmPassword}) => {
    console.log("DecklistContainers");

    var handle = Meteor.subscribe("EventBy_id", FlowRouter.getParam("Event_id"));

    return {
        listLoading: ! handle.ready(),
        confirmPassword : confirmPassword
    };
}, SubmitPassword);