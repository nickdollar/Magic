import { createContainer } from 'meteor/react-meteor-data';
import Problem from './Problem.jsx';

export default ProblemContainer = createContainer(({title, fixMethod, subscription, collection, format, ObjectWithProblemsObject}) => {
    var handle = Meteor.subscribe(subscription, format);

    var collections = {Events : Events, DecksData : DecksData};
    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        ObjectsWithProblems : collections[collection].find(ObjectWithProblemsObject).fetch(),
    };
}, Problem);