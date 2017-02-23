import { createContainer } from 'meteor/react-meteor-data';
import DecksNamesDecksDataList from './DecksNamesDecksDataList.jsx';

export default DecksNamesDecksDataListContainer = createContainer(({flowRouterDeckSelected, DecksData_id, selectedDeckHandle}) => {
    var DecksNames_regex= new RegExp("^" + flowRouterDeckSelected.replace(/[-']/g, ".") + "$", "i");
    var DecksNames_id = DecksNames.findOne({name : {$regex : DecksNames_regex}})._id;

    return {
        currentUser: Meteor.user(),
        DecksData : DecksData.find({DecksNames_id : DecksNames_id}, {reactive : false}).fetch()
    };
}, DecksNamesDecksDataList);