import { createContainer } from 'meteor/react-meteor-data';
import FixDecksWithNameAutoLessThan100List from './FixDecksWithNameAutoEqual100List.jsx';

export default FixDecksWithNameAutoLessThan100ListContainer = createContainer(({format}) => {
    var handle = Meteor.subscribe("DecksAutoPercentageLessThan100LeagueDailyComplete", format);

    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        ObjectsWithProblems : DecksData.find({
            format: format,
            autoPercentage : 1
        }).fetch(),
    };
}, FixDecksWithNameAutoLessThan100List);