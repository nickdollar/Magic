import { createContainer } from 'meteor/react-meteor-data';
import Deck from '/client/dumbReact/Deck/Deck.jsx';

export default DeckContainer = createContainer(({DecksData_id}) => {
    var handle = Meteor.subscribe("CardsFromDeckData_id_NonReactive", DecksData_id);
    return {
        listLoading: ! handle.ready(),
        Cards : Cards.find().fetch(),
        Collection: Session.get("cards")
    };
}, Deck);