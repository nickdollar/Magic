import { createContainer } from 'meteor/react-meteor-data';
import TopMenu from './TopMenu.jsx';

export default TopMenuContainer = createContainer(({}) => {
    return {
        currentUser: Meteor.user(),
        activatedlink : Session.get("topMenuSite"),
        format : Session.get("selectedMenuFormat"),
        distance : Session.get("distance"),
        positionOption : Session.get("positionOption"),
        ZIP : Session.get("ZIP"),
        state : Session.get("state"),
    };
}, TopMenu);