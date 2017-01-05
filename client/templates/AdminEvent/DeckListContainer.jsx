import { createContainer } from 'meteor/react-meteor-data';
import DeckList from './DeckList.jsx';

export default DecklistContainer = createContainer((DecksData_id) => {
    var handle = Meteor.subscribe("DecksDataCardsDataByDecksdata_id", DecksData_id.DecksData_id);
    var deck = DecksData.findOne({_id : DecksData_id.DecksData_id});
    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        decks : DecksData.find({}, {sort : {position : 1}}).fetch()
    };
}, DeckList);