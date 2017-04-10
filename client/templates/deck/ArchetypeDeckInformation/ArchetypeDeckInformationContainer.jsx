import { createContainer } from 'meteor/react-meteor-data';
import ArchetypeDeckInformation from './ArchetypeDeckInformation.jsx';

export default ArchetypeDeckInformationContainer = createContainer(({}) => {
    return {
        Formats_id : getFormat_idFromLink(FlowRouter.getParam("format")),
        DeckArchetypeLink : FlowRouter.getParam("DeckArchetype"),
        DeckNameLink : FlowRouter.getParam("DeckName")
    };
}, ArchetypeDeckInformation);