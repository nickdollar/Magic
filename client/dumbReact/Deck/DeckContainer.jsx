import { createContainer } from 'meteor/react-meteor-data';
import Deck from '/client/dumbReact/Deck/Deck.jsx';

export default DeckContainer = createContainer(({DecksData_id}) => {
    var handle = Meteor.subscribe("CardsDataFromDeckData_id_NonReactive", DecksData_id);
    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        CardsData : CardsData.find().fetch(),
        Collection: Session.get("cards")
    };
}, Deck);