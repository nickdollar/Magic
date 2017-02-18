import { createContainer } from 'meteor/react-meteor-data';
import ImportByDeck from './ImportByDeck.jsx';

export default ImportByDeckContainer = createContainer(({ params }) => {
    var handle = Meteor.subscribe("DecksNames");
    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        DecksNames: DecksNames.find().fetch(),
    };
}, ImportByDeck);