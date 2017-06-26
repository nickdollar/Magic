import { createContainer } from 'meteor/react-meteor-data';
import LatestDecks from './LatestDecks.jsx';

export default LatestDecksContainer = createContainer(({}) => {
    console.log("LatestDecksContainer");
    var handle = Meteor.subscribe("metaNewestLatest");

    return {
        listLoading: ! handle.ready(),
        List : MetaLastDaysAdditions.findOne({})
    };
}, LatestDecks);