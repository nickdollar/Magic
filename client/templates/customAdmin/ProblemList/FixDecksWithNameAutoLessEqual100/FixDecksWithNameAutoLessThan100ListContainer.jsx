import { createContainer } from 'meteor/react-meteor-data';
import FixDecksWithNameAutoLessThan100List from './FixDecksWithNameAutoLessThan100List.jsx';

export default FixDecksWithNameAutoEqual100ListListContainer = createContainer(({format}) => {
    var handle = Meteor.subscribe("DecksAutoPercentageLessThan100LeagueDailyComplete", format);

    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        ObjectsWithProblems : DecksData.find({
            format: format,
            autoPercentage : {$lt : 1}
        }).fetch(),
    };
}, FixDecksWithNameAutoLessThan100List);