import { createContainer } from 'meteor/react-meteor-data';
import DeckNameListSubmit from '/client/dumbReact/DeckNameListSubmit/DeckNameListSubmit.jsx';

export default DeckNameListSubmitContainer = createContainer(({DecksData_id, Formats_id}) => {
    var handle = Meteor.subscribe("DecksNamesByFormat", Formats_id);
    var handle2 = Meteor.subscribe("DecksDataBy_id", DecksData_id);
    return {
        currentUser: Meteor.user(),
        listLoaded: handle.ready() && handle2.ready(),
        DecksNames : DecksNames.find({Formats_id : Formats_id, DecksArchetypes_id : {$ne : null}}).fetch(),

    };
}, DeckNameListSubmit);