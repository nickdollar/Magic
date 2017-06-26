import { createContainer } from 'meteor/react-meteor-data';
import DeckList from './AdminEventInfoDeckList.jsx';

export default DecklistContainer = createContainer((DecksData_id) => {
    console.log("DecklistContainer");
    var handle = Meteor.subscribe("DecksCardsByDecksdata_id", DecksData_id.DecksData_id);
    return {
        listLoading: ! handle.ready(),
        DecksData_id : DecksData_id.DecksData_id,
        deck : DecksData.findOne({_id : DecksData_id.DecksData_id})
    };
}, DeckList);