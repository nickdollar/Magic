import { createContainer } from 'meteor/react-meteor-data';
import EventInfo from './EventInfo.jsx';

export default EventInfoContainer = createContainer(({confirmPassword}) => {
    var EventBy_idHandle = Meteor.subscribe("EventBy_id", FlowRouter.getParam("event_id"));
    var DecksDataFromEvent_idSimplified = Meteor.subscribe("DecksDataFromEvent_idSimplified", FlowRouter.getParam("event_id"));


    return {
        currentUser: Meteor.user(),
        EventBy_idHandle: ! EventBy_idHandle.ready(),
        EventBy_idHandle: ! DecksDataFromEvent_idSimplified.ready(),
        confirmPassword : confirmPassword,
        event : Event.findOne({_id : EventBy_idHandle}),
        decks : DecksData.find({}, {sort : {position : 1}}).fetch()
    };
}, EventInfo);