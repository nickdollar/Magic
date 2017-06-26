import { createContainer } from 'meteor/react-meteor-data';
import ArchetypeDeckInformation from './ArchetypeDeckInformation.jsx';

export default ArchetypeDeckInformationContainer = createContainer(({}) => {
    return {
        Formats_id : FlowRouter.getParam("format").substring(0,3).toLowerCase(),
        DeckArchetypeLink : FlowRouter.getParam("DeckArchetype")
    };
}, ArchetypeDeckInformation);