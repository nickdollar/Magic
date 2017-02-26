import { createContainer } from 'meteor/react-meteor-data';
import AutoComplete from './Autocomplete.jsx';

export default AutoCompleteContainer = createContainer(({}) => {
    return {
        currentUser: Meteor.user(),
    };
}, AutoComplete);