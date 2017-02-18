import { createContainer } from 'meteor/react-meteor-data';
import LatestDecks from './LatestDecks.jsx';

export default LatestDecksContainer = createContainer(({}) => {
    var handle = Meteor.subscribe("metaNewestLatest");

    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        List : MetaNewest.findOne({type : "lastDays"})
    };
}, LatestDecks);