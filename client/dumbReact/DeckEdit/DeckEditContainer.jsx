import { createContainer } from 'meteor/react-meteor-data';
import DeckEdit from '/client/dumbReact/DeckEdit/DeckEdit.jsx';

export default DeckEditContainer = createContainer(({DecksData_id}) => {
    var handle = Meteor.subscribe("DecksDataCardsDataByDecksdata_id", DecksData_id);
    var handle2 = Meteor.subscribe("CardsDataFromDeckData_id", DecksData_id);

    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready() ,
        listLoading2: ! handle2.ready() ,
        DeckSelected : DecksData.findOne({_id : DecksData_id})
    };
}, DeckEdit);