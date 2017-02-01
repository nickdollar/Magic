import { createContainer } from 'meteor/react-meteor-data';
import ArchetypeDeckInformation from './ArchetypeDeckInformation.jsx';

export default ArchetypeDeckInfromationHeaderContainer = createContainer(({archetype, listLoading}) => {

    var handle = Meteor.subscribe("DecksNames_DecksArchetypes_id", archetype._id );

    if(listLoading){
        return {
            currentUser: Meteor.user(),
            listLoading: true,
            DecksNames : DecksNames.find({DecksArchetypes_id : archetype}).fetch()
        };
    }else{
        return {
            currentUser: Meteor.user(),
            listLoading: !handle.ready(),
            DecksNames : null
        };
    }


}, ArchetypeDeckInformation);