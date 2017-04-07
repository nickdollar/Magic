import { createContainer } from 'meteor/react-meteor-data';
import DecksNamesList from './DecksNamesList.jsx';

export default DecksNamesListContainer = createContainer(({Formats_id}) => {
    var handle = Meteor.subscribe("DecksNamesByFormat", Formats_id);

    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        DecksNames : DecksNames.find({Formats_id : Formats_id}).fetch()
    };
}, DecksNamesList);