import { createContainer } from 'meteor/react-meteor-data';
import SubmitDeck from './SubmitDeck.jsx';

export default SubmitDeckContainer = createContainer(({ params }) => {
    return {
        currentUser: Meteor.user(),
        LGS: LGS.find().fetch(),
    };
}, SubmitDeck);