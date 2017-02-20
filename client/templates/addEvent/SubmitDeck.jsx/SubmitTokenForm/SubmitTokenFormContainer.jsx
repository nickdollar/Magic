import { createContainer } from 'meteor/react-meteor-data';
import SubmitTokenForm from './SubmitTokenForm.jsx';

export default SubmitTokenFormContainer = createContainer(({tokenConfirmed}) => {
    var handle = Meteor.subscribe("LGSByLocationDistance", Session.get("position"), Session.get("distance"), Session.get('positionOption'), Session.get('state'), Session.get('ZIP'));
    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
    };
}, SubmitTokenForm);