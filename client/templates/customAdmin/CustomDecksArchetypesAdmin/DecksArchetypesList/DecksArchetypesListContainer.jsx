import { createContainer } from 'meteor/react-meteor-data';
import DecksArchetypesList from './DecksArchetypesList.jsx';

export default DecksArchetypesListContainer = createContainer(({Formats_id}) => {
    var handle = Meteor.subscribe("DecksArchetypesFormat", Formats_id);

    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        DecksArchetypes : DecksArchetypes.find({Formats_id : Formats_id}).fetch()
    };
}, DecksArchetypesList);