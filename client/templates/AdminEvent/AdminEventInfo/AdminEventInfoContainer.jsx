import { createContainer } from 'meteor/react-meteor-data';
import AdminEventInfo from './AdminEventInfo.jsx';

export default AdminEventInfoContainer = createContainer(({}) => {
    var EventBy_idHandle = Meteor.subscribe("EventBy_id", FlowRouter.getParam("Event_id"));
    var DecksDataFromEvent_idSimplified = Meteor.subscribe("DecksDataFromEvent_idSimplified", FlowRouter.getParam("Event_id"));

    return {
        currentUser: Meteor.user(),
        collectionLoading: ! (EventBy_idHandle.ready() && DecksDataFromEvent_idSimplified.ready()),
        event : Events.findOne({_id : FlowRouter.getParam("Event_id")}),
        decks : DecksData.find({}, {sort : {position : 1}}).fetch()
    };
}, AdminEventInfo);