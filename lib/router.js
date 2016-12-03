FlowRouter.route('/decks/:format/:archetype/:deckSelected?', {
    name : 'decksSelected',
    action (){
        Session.set("topMenuSite", "deck");
        BlazeLayout.render("ApplicationLayout", { main : "deckSelected" });
    }
});

FlowRouter.route('/decks/:format/', {
    name : 'selectADeck',
    action : function(){
        Session.set("topMenuSite", "deck");
        BlazeLayout.render("ApplicationLayout", { main : "selectADeck" });
    }
});

FlowRouter.route('/decks/', {
    name : 'deckFP',
    action : function(){
        Session.set("topMenuSite", "deck");
        BlazeLayout.render("ApplicationLayout", { main : "deckFP" });
    }
});

FlowRouter.route('/', {
    name : 'main',
    action : function(){
        Session.set("topMenuSite", "main");
        BlazeLayout.render("ApplicationLayout", { main : "main" });
    }
});


FlowRouter.route('/meta/:format/', {
    name : 'selectedMeta',
    action : function(){
        Session.set("topMenuSite", "meta");
        BlazeLayout.render("ApplicationLayout", { main : "selectedMeta" });
    }
});

FlowRouter.route('/meta/', {
    name : 'metaFP',
    action : function(){
        Session.set("topMenuSite", "meta");
        BlazeLayout.render("ApplicationLayout", { main : "metaFP" });
    }
});

FlowRouter.route('/events/', {
    name : 'eventsFP',
    action : function(){
        Session.set("topMenuSite", "event");
        BlazeLayout.render("ApplicationLayout", { main : "eventsFP" });
    }
});

FlowRouter.route('/events/:format', {
    name : 'events',
    action : function(){
        Session.set("topMenuSite", "event");
        BlazeLayout.render("ApplicationLayout", { main : "events" });
    }
});


FlowRouter.route('/events/:format/:Events_id/:DecksData_id?', {
    name : 'selectedEvent',
    action : function(){
        Session.set("topMenuSite", "event");
        BlazeLayout.render("ApplicationLayout", { main : "selectedEvent" });
    }
});

FlowRouter.route(AdminDashboard.path('/DecksArchetypes/delete'),{
    name: 'AdminController',
    triggersEnter: [
        // function(context){
        //     Session.set('admin_title',"Dashboard");
        //     Session.set('admin_collection_name',"");
        //     Session.set('admin_collection_page',"");
        // }
    ],
    action: function ()
    {
        BlazeLayout.render('fAdminLayout', {main: 'AdminController'});
    }
});

FlowRouter.route(  AdminDashboard.path('/Events/delete'),{
    name: 'AdminEventsDelete',
    triggersEnter: [
        // function(context){
        //     Session.set('admin_title',"Dashboard");
        //     Session.set('admin_collection_name',"");
        //     Session.set('admin_collection_page',"");
        // }
    ],
    action: function ()
    {
        BlazeLayout.render('fAdminLayout', {main: 'AdminEventsDelete'});
    }
});

FlowRouter.route( AdminDashboard.path('/DecksNames/delete'),{
    name: 'AdminDecksNamesDelete',
    triggersEnter: [
        // function(context){
        //     Session.set('admin_title',"Dashboard");
        //     Session.set('admin_collection_name',"");
        //     Session.set('admin_collection_page',"");
        // }
    ],
    action: function ()
    {
        BlazeLayout.render('fAdminLayout', {main: 'AdminDecksNamesDelete'});
    }
});


FlowRouter.route( AdminDashboard.path('/DecksData/addNames'),{
    name: 'AdminDecksdataAddNames',
    triggersEnter: [
        // function(context){
        //     Session.set('admin_title',"Dashboard");
        //     Session.set('admin_collection_name',"");
        //     Session.set('admin_collection_page',"");
        // }
    ],
    action: function ()
    {
        BlazeLayout.render('fAdminLayout', {main: 'AdminDecksdataAddNames'});
    }
});




FlowRouter.route(AdminDashboard.path('/DecksData/addNamesAudit/'),{
    name: 'AdminDecksDataAddNamesAudit',
    triggersEnter: [
        // function(context){
        //     Session.set('admin_title',"Dashboard");
        //     Session.set('admin_collection_name',"");
        //     Session.set('admin_collection_page',"");
        // }
    ],
    action: function ()
    {
        BlazeLayout.render('fAdminLayout', {main: 'AdminDecksDataAddNamesAudit'});
    }
});

FlowRouter.route(AdminDashboard.path('/CardsFullData/fix/'),{
    name: 'AdminCardsFullDataFix',
    triggersEnter: [
        // function(context){
        //     Session.set('admin_title',"Dashboard");
        //     Session.set('admin_collection_name',"");
        //     Session.set('admin_collection_page',"");
        // }
    ],
    action: function ()
    {
        BlazeLayout.render('fAdminLayout', {main: 'AdminCardsFullDataFix'});
    }
});


FlowRouter.route(AdminDashboard.path('/CardsFullData/updateWholeDatabase/'),{
    name: 'AdminCardsFullDataUpdateWholeCollection',
    triggersEnter: [
        // function(context){
        //     Session.set('admin_title',"Dashboard");
        //     Session.set('admin_collection_name',"");
        //     Session.set('admin_collection_page',"");
        // }
    ],
    action: function ()
    {
        BlazeLayout.render('fAdminLayout', {main: 'AdminCardsFullDataUpdateWholeCollection'});
    }
});


FlowRouter.route(AdminDashboard.path('/Events/fix'),{
    name: 'AdminEventsFix',
    triggersEnter: [
        // function(context){
        //     Session.set('admin_title',"Dashboard");
        //     Session.set('admin_collection_name',"");
        //     Session.set('admin_collection_page',"");
        // }
    ],
    action: function ()
    {
        BlazeLayout.render('fAdminLayout', {main: 'AdminEventsFix'});
    }
});