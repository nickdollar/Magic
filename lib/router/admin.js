FlowRouter.route('/admin/:collection?',{
    name: 'admin',
    triggersEnter: [

    ],
    action: function ()
    {
        BlazeLayout.render('ApplicationLayout', {main: 'admin'});
    }
});

// FlowRouter.route('/admin/,{
//     name: 'admin',
//     triggersEnter: [
//
//     ],
//     action: function ()
//     {
//         BlazeLayout.render('ApplicationLayout', {main: 'admin'});
//     }
// });