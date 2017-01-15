import { createContainer } from 'meteor/react-meteor-data';
import Deck from '/client/dumbReact/Deck/Deck.jsx';

export default DeckContainer = createContainer(({DecksData_id}) => {
    console.log(DecksData_id);
    var handle = Meteor.subscribe("DecksDataCardsDataByDecksdata_id", DecksData_id);

    var DeckSeleted;
    if(DecksData.find({_id : DecksData_id}).count()){
        DeckSeleted = DecksData.find({_id : DecksData_id}).fetch()[0]
    }
    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        DeckSelected : DeckSeleted
    };
}, Deck);