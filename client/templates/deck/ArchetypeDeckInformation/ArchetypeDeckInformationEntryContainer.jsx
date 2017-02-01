import { createContainer } from 'meteor/react-meteor-data';
import ArchetypeDeckInformationExit from './ArchetypeDeckInformationExit.jsx';

export default ArchetypeDeckInformationEntry = createContainer(({format, archetype}) => {
    var handle = Meteor.subscribe("DecksArchetypesNameRegex", format, archetype);
    var DecksArchetypesRegex = new RegExp("^" + archetype.replace(/[-']/g, ".") + "$", "i");

    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        archetype: DecksArchetypes.findOne({format : format, name : {$regex : DecksArchetypesRegex}})
    };
}, ArchetypeDeckInformationExit);