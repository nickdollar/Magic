import { createContainer } from 'meteor/react-meteor-data';
import ReactTable from './ReactTable.jsx';

export default ReactTableContainer = createContainer(({collection, subscription, subscriptionParams, query, options, columns}) => {

    var handle = Meteor.subscribe(subscription, ...subscriptionParams);
    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        rows : global[collection].find(query).fetch()
    };

}, ReactTable);

