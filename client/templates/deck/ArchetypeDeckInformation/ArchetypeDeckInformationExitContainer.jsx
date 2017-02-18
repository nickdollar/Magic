import { createContainer } from 'meteor/react-meteor-data';
import ArchetypeDeckInformationExit from './ArchetypeDeckInformationExit.jsx';

export default ArchetypeDeckInformationExitContainer = createContainer(({format, archetype, listLoading}) => {

    if(listLoading){
        return {
            currentUser: Meteor.user(),
            listLoading: true,
            decksNames : null
        };
    }else{
        var handle = Meteor.subscribe("DecksNames_DecksArchetypes_id", archetype._id );

        return {
            currentUser: Meteor.user(),
            listLoading: !handle.ready(),
            decksNames : DecksNames.find({DecksArchetypes_id : archetype._id}).fetch(),
            flowRouterDeckSelected : FlowRouter.getParam("deckSelected"),
        };
    }


}, ArchetypeDeckInformationExit);