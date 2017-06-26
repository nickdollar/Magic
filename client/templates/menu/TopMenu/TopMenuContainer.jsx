import { createContainer } from 'meteor/react-meteor-data';
import TopMenu from './TopMenu.jsx';

export default TopMenuContainer = createContainer(({}) => {
    console.log("TopMenuContainer");
    var activatedlink = Session.get("topMenuSite");
    var format = Session.get("selectedMenuFormat");
    return {
        currentUser: Meteor.userId(),
        activatedlink : activatedlink,
        format : format,
    };
}, TopMenu);