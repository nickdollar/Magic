import { createContainer } from 'meteor/react-meteor-data';
import Select2 from './Select2.jsx';

export default Select2Container = createContainer(({subscription, collection, serverQuery, clientQuery, objectName, title, fieldUnique, fieldText, initialValue}) => {

    var handle = Meteor.subscribe(subscription, ...serverQuery);

    return {
        listLoading: ! handle.ready(),
        options : global[collection].find(clientQuery).fetch()
    };
}, Select2);