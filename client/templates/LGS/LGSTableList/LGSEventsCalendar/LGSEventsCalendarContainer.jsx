import { createContainer } from 'meteor/react-meteor-data';
import LGSEventsCalendar from './LGSEventsCalendar.jsx';

export default ListContainer = createContainer(({ LGS }) => {
    var arraysOfLGS_id = LGS.filter((obj)=>{
        return obj.checked == true && obj.showing == true;
    }).map((obj)=>{
       return  obj._id
    });
    var handle = Meteor.subscribe("LGSEventsByArrayOfLGS_ids", arraysOfLGS_id);
    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        LGSEventsByArrayOfLGS_ids: LGSEvents.find().fetch(),
    };

}, LGSEventsCalendar);