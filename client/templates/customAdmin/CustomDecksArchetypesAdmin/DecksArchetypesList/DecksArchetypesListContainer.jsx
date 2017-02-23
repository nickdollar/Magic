import { createContainer } from 'meteor/react-meteor-data';
import DecksArchetypesList from './DecksArchetypesList.jsx';

export default DecksArchetypesListContainer = createContainer(({format}) => {
    var handle = Meteor.subscribe("DecksArchetypesFormat", format);

    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        DecksArchetypes : DecksArchetypes.find({format : format}).fetch()
    };
}, DecksArchetypesList);