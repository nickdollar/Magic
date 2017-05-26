import { createContainer } from 'meteor/react-meteor-data';
import DeckEdit from '/client/dumbReact/DeckEdit/DeckEdit.jsx';

export default DeckEditContainer = createContainer(({DecksData_id}) => {
    var handle = Meteor.subscribe("DecksDataBy_id_NonReactive", DecksData_id);
    var handle2 = Meteor.subscribe("CardsFromDeckData_id_NonReactive", DecksData_id);
    return {
        listLoading: !(handle.ready() && handle2.ready()),
        deck : DecksData.findOne({_id : DecksData_id}, {reactive : false}),
        cards : Cards.find().fetch(),

    };
}, DeckEdit);