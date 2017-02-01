import { createContainer } from 'meteor/react-meteor-data';
import DecksWithoutNames from './DecksWithoutNames.jsx';

export default DecksWithoutNamesContainer = createContainer(({query, projection, format}) => {
    var handle = Meteor.subscribe("DecksWithoutNamesContainer", query, projection);

    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        DecksList : DecksData.find(query, projection).fetch()
    };
}, DecksWithoutNames);