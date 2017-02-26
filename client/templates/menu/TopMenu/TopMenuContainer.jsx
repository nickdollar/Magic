import { createContainer } from 'meteor/react-meteor-data';
import TopMenu from './TopMenu.jsx';

export default TopMenuContainer = createContainer(({}) => {
    return {
        currentUser: Meteor.user(),
        activatedlink : Session.get("topMenuSite"),
        format : Session.get("selectedMenuFormat"),
    };
}, TopMenu);