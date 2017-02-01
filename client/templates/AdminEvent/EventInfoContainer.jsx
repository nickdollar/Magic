import { createContainer } from 'meteor/react-meteor-data';
import EventInfo from './EventInfo.jsx';

export default EventInfoContainer = createContainer(({}) => {
    var EventBy_idHandle = Meteor.subscribe("EventBy_id", FlowRouter.getParam("event_id"));
    var DecksDataFromEvent_idSimplified = Meteor.subscribe("DecksDataFromEvent_idSimplified", FlowRouter.getParam("event_id"));

    return {
        currentUser: Meteor.user(),
        collectionLoading: ! EventBy_idHandle.ready() && DecksDataFromEvent_idSimplified.ready(),
        event : Events.findOne({_id : FlowRouter.getParam("event_id")}),
        decks : DecksData.find({}, {sort : {position : 1}}).fetch()
    };
}, EventInfo);