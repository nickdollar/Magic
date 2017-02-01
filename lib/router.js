FlowRouter.route('/decks/:format/:archetype/:deckSelected?', {
    name : 'ArchetypeDeckInformation',
    action (){
        Session.set("selectedMenuFormat", this.getParam("format"));
        Session.set("topMenuSite", "deck");
        BlazeLayout.render("ApplicationLayout", { main : "ArchetypeDeckInformation" });
    }
});

FlowRouter.route('/decks/:format/', {
    name : 'decks',
    action : function(){
        Session.set("topMenuSite", "decks");
        Session.set("selectedMenuFormat", this.getParam("format"));
        BlazeLayout.render("ApplicationLayout", { main : "decks" });
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
        Session.set("selectedMenuFormat", this.getParam("format"));
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
        Session.set("selectedMenuFormat", this.getParam("format"));
        BlazeLayout.render("ApplicationLayout", { main : "events" });
    }
});


FlowRouter.route('/events/:format/:Events_id/:DecksData_id?', {
    name : 'selectedEvent',
    action : function(){
        Session.set("topMenuSite", "events");
        Session.set("selectedMenuFormat", this.getParam("format"));
        BlazeLayout.render("ApplicationLayout", { main : "selectedEvent" });
    }
});

FlowRouter.route('/submitdeck/',{
    name: 'submitDeck',
    triggersEnter: [

    ],
    action: function ()
    {
        BlazeLayout.render('ApplicationLayout', {main: 'submitDeck'});
    }
});

FlowRouter.route('/lgs/',{
    name: 'lgs',
    triggersEnter: [
    ],
    action: function ()
    {
        Session.set("topMenuSite", "lgs");
        BlazeLayout.render('ApplicationLayout', {main: 'lgs'});
    }
});

FlowRouter.route('/addEvent/',{
    name: 'addEvent',
    triggersEnter: [
    ],
    action: function ()
    {
        Session.set("topMenuSite", "addEvent");
        BlazeLayout.render('ApplicationLayout', {main: 'addEvent'});
    }
});

FlowRouter.route('/adminEvent/:event_id',{
    name: 'adminEvent',
    triggersEnter: [

    ],
    action: function ()
    {
        Session.set("topMenuSite", "addEvent");
        BlazeLayout.render('ApplicationLayout', {main: 'adminEvent'});
    }
});