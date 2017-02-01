
FlowRouter.wait();

Tracker.autorun(() => {
    // wait on roles to intialise so we can check is use is in proper role
    if (Roles.subscription.ready() && !FlowRouter._initialized) {
        FlowRouter.initialize()
    }
});



Meteor.startup(function () {

    import { $ } from 'meteor/jquery';
    import dataTablesBootstrap from 'datatables.net-bs';
    import 'datatables.net-bs/css/dataTables.bootstrap.css';


    dataTablesBootstrap(window, $);
});
