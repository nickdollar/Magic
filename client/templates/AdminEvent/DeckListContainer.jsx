import { createContainer } from 'meteor/react-meteor-data';
import DeckList from './DeckList.jsx';

export default DecklistContainer = createContainer((DecksData_id) => {
    var handle = Meteor.subscribe("DecksDataCardsDataByDecksdata_id", DecksData_id.DecksData_id);
    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        DecksData_id : DecksData_id.DecksData_id,
        deck : DecksData.findOne({_id : DecksData_id.DecksData_id})
    };
}, DeckList);