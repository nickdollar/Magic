import { createContainer } from 'meteor/react-meteor-data';
import TopMenu from './TopMenu.jsx';

export default TopMenuContainer = createContainer(({}) => {
    return {
        activatedlink : Session.get("topMenuSite"),
        format : Session.get("selectedMenuFormat"),
    };
}, TopMenu);