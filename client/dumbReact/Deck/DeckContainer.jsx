import { createContainer } from 'meteor/react-meteor-data';
import Deck from '/client/dumbReact/Deck/Deck.jsx';

export default DeckContainer = createContainer(({DecksData_id, Events_id}) => {
    console.log(DecksData_id);
    var handle = Meteor.subscribe("DecksDataCardsDataByDecksdata_id", DecksData_id, Events_id);

    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        DeckSelected : DecksData_id ? DecksData.findOne({_id : DecksData_id}) :
                       DecksData.findOne({Events_id : Events_id}, {$sort : {position : 1, victory : 1}, limit : 1})
    };
}, Deck);