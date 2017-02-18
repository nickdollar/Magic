import { createContainer } from 'meteor/react-meteor-data';
import DecksWithoutNames from './DecksWithoutNames.jsx';

export default DecksWithoutNamesContainer = createContainer(({serverQuery, clientQuery}) => {
    var handle = Meteor.subscribe("DecksWithoutNamesContainer", ...serverQuery);

    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        DecksList : DecksData.find(...clientQuery).fetch()
    };
}, DecksWithoutNames);