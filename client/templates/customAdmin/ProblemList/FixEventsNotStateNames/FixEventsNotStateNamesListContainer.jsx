import { createContainer } from 'meteor/react-meteor-data';
import FixEventsNotStateNamesList from './FixEventsNotStateNamesList.jsx';

export default FixEventsNotStateNamesListContainer = createContainer(({format}) => {
    var handle = Meteor.subscribe("DecksWithoutNamesComplete", format);

    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        ObjectsWithProblems : Events.find({
            format : format,
            state : "decks"
        }).fetch(),
    };
}, FixEventsNotStateNamesList);