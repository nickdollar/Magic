import { createContainer } from 'meteor/react-meteor-data';
import DecksDataTable from './DecksDataTable.jsx';

export default DecksDataTableContainer = createContainer(({DecksNames_id, selectDeck}) => {
    var handle = Meteor.subscribe("DecksDataByDecksNames_idSimple", DecksNames_id);

    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        DecksData : DecksNames_id ?  DecksData.find({DecksNames_id : DecksNames_id}).fetch() : []
    };
}, DecksDataTable);