import { createContainer } from 'meteor/react-meteor-data';
import DecksNamesList from './DecksNamesList.jsx';

export default DecksNamesListContainer = createContainer(({format}) => {
    var handle = Meteor.subscribe("DecksNamesByFormat");

    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        DecksNames : DecksNames.find({format : format}).fetch()
    };
}, DecksNamesList);