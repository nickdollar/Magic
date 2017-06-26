FlowRouter.route('/admin/:collection?',{
    name: 'admin',
    triggersEnter: [
        (content, redirect) =>{
            if(!Roles.userIsInRole(Meteor.userId(), "admin")){
                redirect('/')
            }
        }
    ],
    action: function (params, queryParams)
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