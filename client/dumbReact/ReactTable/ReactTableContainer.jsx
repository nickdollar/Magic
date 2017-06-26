import { createContainer } from 'meteor/react-meteor-data';
import ReactTable from './ReactTable.jsx';

export default ReactTableContainer = createContainer(({collection, subscription, subscriptionParams, query, options, columns}) => {

    console.log("ReactTableContainer");
    var handle = Meteor.subscribe(subscription, ...subscriptionParams);
    return {
        listLoading: ! handle.ready(),
        rows : global[collection].find(query).fetch()
    };

}, ReactTable);

