import { createContainer } from 'meteor/react-meteor-data';
import DeckTableExample from './DeckTableExample.jsx';

export default DeckTableExampleContainer = createContainer(({flowRouterDeckSelected}) => {
    var DecksNames_regex= new RegExp("^" + flowRouterDeckSelected.replace(/[-']/g, ".") + "$", "i");
    var DecksNames_id = DecksNames.findOne({name : {$regex : DecksNames_regex}})._id;
    var handle = Meteor.subscribe("DeckTableExample_Decksnames_id", DecksNames_id);

    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        DecksData : DecksData.find({DecksNames_id : DecksNames_id}, {reactive : false}).fetch(),
        DecksDataNewest : DecksData.findOne({DecksNames_id : DecksNames_id}, {sort : {date : 1}}),
        DecksNames_id : DecksNames_id
    };
}, DeckTableExample);