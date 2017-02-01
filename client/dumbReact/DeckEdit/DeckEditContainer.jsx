import { createContainer } from 'meteor/react-meteor-data';
import DeckEdit from '/client/dumbReact/DeckEdit/DeckEdit.jsx';

export default DeckEditContainer = createContainer(({DecksData_id}) => {
    var handle = Meteor.subscribe("DecksDataBy_id_NonReactive", DecksData_id);
    var handle2 = Meteor.subscribe("CardsDataFromDeckData_id_NonReactive", DecksData_id);
    return {
        currentUser: Meteor.user(),
        listLoading: !(handle.ready() && handle2.ready()),
        deck : DecksData.findOne({_id : DecksData_id}, {reactive : false}),
        cards : CardsData.find().fetch(),

    };
}, DeckEdit);