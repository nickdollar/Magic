import { createContainer } from 'meteor/react-meteor-data';
import Select2 from './Select2.jsx';

export default Select2Container = createContainer(({subscription, collection, serverQuery, clientQuery, objectName, title, fieldUnique, fieldText}) => {

    var handle = Meteor.subscribe(subscription, ...serverQuery);

    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        options : global[collection].find(clientQuery).fetch()
    };
}, Select2);