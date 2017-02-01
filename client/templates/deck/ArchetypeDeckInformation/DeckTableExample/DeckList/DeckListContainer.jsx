import { createContainer } from 'meteor/react-meteor-data';
import DeckList from './DeckList.jsx';

export default DeckListContainer = createContainer(({flowRouterDeckSelected, selectedDeck_id, selectedDeckHandle, eventsType}) => {

    var DecksNames_regex= new RegExp("^" + flowRouterDeckSelected.replace(/[-']/g, ".") + "$", "i");
    var DecksNames_id = DecksNames.findOne({name : {$regex : DecksNames_regex}})._id;

    return {
        currentUser: Meteor.user(),
        DecksData : DecksData.find({DecksNames_id : DecksNames_id, type : {$in : eventsType}}, {reactive : false}).fetch()
    };
}, DeckList);