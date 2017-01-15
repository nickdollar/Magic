import { createContainer } from 'meteor/react-meteor-data';
import FixDecksWithWrongCardNameList from './FixDecksWithWrongCardNameList.jsx';

export default FixDecksWithWrongCardNameListContainer = createContainer(({format}) => {
    var handle = Meteor.subscribe("DecksWithoutNamesComplete", format);

    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        ObjectsWithProblems : DecksData.find({
            format: format,
            $or : [
                {"main.wrongName" : true},
                {"sideboard.wrongName" : true}
            ]
        }).fetch(),
    };
}, FixDecksWithWrongCardNameList);