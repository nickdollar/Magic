import { createContainer } from 'meteor/react-meteor-data';
import DeckNameListSubmit from '/client/dumbReact/DeckNameListSubmit/DeckNameListSubmit.jsx';

export default DeckNameListSubmitContainer = createContainer(({DecksData_id, format}) => {
    var handle = Meteor.subscribe("DecksNamesByFormat", format);
    var handle2 = Meteor.subscribe("DecksDataBy_id", DecksData_id);
    return {
        currentUser: Meteor.user(),
        listLoaded: handle.ready() && handle2.ready(),
        DecksNames : DecksNames.find({format : format, DecksArchetypes_id : {$ne : null}}).fetch(),

    };
}, DeckNameListSubmit);