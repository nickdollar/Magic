import { createContainer } from 'meteor/react-meteor-data';
import Select2 from './Select2.jsx';

export default Select2Container = createContainer(({subscription, collection, query, objectName, title}) => {
    console.log(query);
    // var queryNew = Object.assign({}, query);

    var handle = Meteor.subscribe(subscription, ...query);

    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        options : global[collection].find({}).fetch()
    };
}, Select2);