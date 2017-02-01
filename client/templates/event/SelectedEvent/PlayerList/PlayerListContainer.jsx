import { createContainer } from 'meteor/react-meteor-data';
import PlayerList from './PlayerList.jsx';

export default PlayerListContainer = createContainer(({Events_id,}) => {

    var handle = Meteor.subscribe("DecksDataPLayerList_FromEvents", Events_id);

    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        Players : DecksData.find({Events_id : Events_id}).fetch()
    };
}, PlayerList);