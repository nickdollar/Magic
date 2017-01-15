import { createContainer } from 'meteor/react-meteor-data';
import FixDecksWithoutNameLists from './FixDecksWithoutNameLists.jsx';

export default FixDecksWithoutnameListsContainer = createContainer(({format}) => {
    var handle = Meteor.subscribe("DecksWithoutNamesComplete", format);

    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        ObjectsWithProblems : DecksData.find({
            DecksNames_id: null
        }).fetch(),
    };
}, FixDecksWithoutNameLists);