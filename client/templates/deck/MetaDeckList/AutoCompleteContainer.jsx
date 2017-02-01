import { createContainer } from 'meteor/react-meteor-data';
import AutoComplete from './Autocomplete.jsx';

export default AutoCompleteContainer = createContainer(({}) => {
    var handle = Meteor.subscribe("LGSByLocationDistance", Session.get("position"), Session.get("distance"));

    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
    };
}, AutoComplete);