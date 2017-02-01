import { createContainer } from 'meteor/react-meteor-data';
import ReactTable from './ReactTable.jsx';

export default ReactTableContainer = createContainer(({collection, subscription, query, options, columns}) => {
    var handle = Meteor.subscribe(subscription, ...query);

    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        rows : global[collection].find(...query).fetch()
    };

}, ReactTable);