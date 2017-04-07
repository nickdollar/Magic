import { createContainer } from 'meteor/react-meteor-data';
import ArchetypeDeckInformationExitContainer from './ArchetypeDeckInformationExitContainer.jsx';

export default ArchetypeDeckInformationEntryContainer = createContainer(() => {
    var DecksArchetypesRegex = new RegExp("^" + FlowRouter.getParam("archetype").replace(/[-']/g, ".") + "$", "i");
    var handle = Meteor.subscribe("DecksArchetypesNameRegex", format, archetype);

    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        archetype: DecksArchetypes.findOne({format : format, name : {$regex : DecksArchetypesRegex}}),
        flowRouterDeckSelected : FlowRouter.getParam("archetype"),
        Formats_id : Formats.findOne({names : {$regex : FlowRouter.getParam("format"), $options : ""}})
    };
}, ArchetypeDeckInformationExitContainer);