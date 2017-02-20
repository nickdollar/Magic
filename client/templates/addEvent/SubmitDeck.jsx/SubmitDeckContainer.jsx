import { createContainer } from 'meteor/react-meteor-data';
import SubmitDeck from './SubmitDeck.jsx';

export default SubmitDeckContainer = createContainer(({ params }) => {
    var handle = Meteor.subscribe("LGSByLocationDistance", Session.get("position"), Session.get("distance"), Session.get('positionOption'), Session.get('state'), Session.get('ZIP'));    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        LGS: LGS.find().fetch(),
    };
}, SubmitDeck);