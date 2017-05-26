import { createContainer } from 'meteor/react-meteor-data';
import SelectedEvent from './SelectedEvent.jsx';

export default SelectedEventContainer = createContainer(({}) => {
    return {
        Events_id : FlowRouter.getParam("Events_id"),
        DecksData_id : FlowRouter.getParam("DecksData_id")
    };
}, SelectedEvent);