import { createContainer } from 'meteor/react-meteor-data';
import StateList from './StateList.jsx';

export default StateListContainer = createContainer(({collection, subscription, notState, states, format}) => {
    var handle = Meteor.subscribe(subscription, notState);

    return {
        currentUser: Meteor.user(),
        collectionsLoading: !handle.ready(),
        objects: global[collection].find({state : {$nin : notState}}).fetch()

    };
}, StateList);