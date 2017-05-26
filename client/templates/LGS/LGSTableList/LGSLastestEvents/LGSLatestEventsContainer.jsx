import { createContainer } from 'meteor/react-meteor-data';
import LGSLatestEvents from './LGSLatestEvents.jsx';

export default ListContainer = createContainer(({ LGS }) => {
    var arraysOfLGS_id = LGS.filter((obj)=>{
        return obj.checked == true && obj.showing == true;
    }).map((obj)=>{
        return  obj._id
    });
    var handle = Meteor.subscribe("EventsByLGS_idArray", arraysOfLGS_id);
    return {
        listLoading: ! handle.ready(),
        Events: Events.find({LGS_id : {$in : arraysOfLGS_id}}).fetch(),
    };

}, LGSLatestEvents);