import { createContainer } from 'meteor/react-meteor-data';
import DecksDataStates from './DecksDataStates.jsx';

export default DecksDataStatesContainer = createContainer(({query, projection}) => {
    var handle = Meteor.subscribe("DecksData2", query, projection);

    return {
        currentUser: Meteor.user(),
        collectionsLoading: !handle.ready(),
        DecksData: DecksData.find(query).fetch()

    };
}, DecksDataStates);