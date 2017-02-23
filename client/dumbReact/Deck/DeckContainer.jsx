import { createContainer } from 'meteor/react-meteor-data';
import Deck from '/client/dumbReact/Deck/Deck.jsx';

export default DeckContainer = createContainer(({DecksData_id}) => {
    var handle = Meteor.subscribe("DecksDataBy_id", DecksData_id);
    var handle2 = Meteor.subscribe("CardsDataFromDeckData_id_NonReactive", DecksData_id);

    return {
        currentUser: Meteor.user(),
        listLoading: ! (handle.ready() && handle2.ready()),
        DeckSelected : DecksData.findOne({_id : DecksData_id}),
        CardsData : CardsData.find().fetch()
    };
}, Deck);