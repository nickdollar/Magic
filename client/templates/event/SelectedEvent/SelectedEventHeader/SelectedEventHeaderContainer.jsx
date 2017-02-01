import { createContainer } from 'meteor/react-meteor-data';
import SelectedEventHeader from './SelectedEventHeader.jsx';

export default SelectedEventHeaderContainer = createContainer(({DecksData_id, Events_id}) => {
    var EventsById = Meteor.subscribe("EventsById", Events_id);

    var DecksDataPLayerList_FromEvents = Meteor.subscribe("DecksDataDecksData_idOrEvents_id", DecksData_id, Events_id);

    return {
        currentUser: Meteor.user(),
        listLoading: ! (EventsById.ready() && DecksDataPLayerList_FromEvents.ready()),
        EventSelected : Events.findOne({_id : Events_id}),
        DeckSelected :  DecksData_id ? DecksData.findOne({_id : DecksData_id}) :
                        DecksData.findOne({Events_id : Events_id}, {$sort : {position : 1, victory : 1}, limit : 1})
    };
}, SelectedEventHeader);