FlowRouter.route('/decks/:format/:DeckArchetype', {
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

FlowRouter.route('/user/', {
    name : 'User',
    action : function(){
        Session.set("topMenuSite", "User");
        // Session.set("selectedMenuFormat", this.getParam("format"));
        BlazeLayout.render("ApplicationLayout", { main : "User" });
    }
});

FlowRouter.route('/decks/', {
    name : 'deckFP',
    triggersEnter: [
        (content, redirect) =>{
                redirect('/decks/standard')
        }
    ],
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
    triggersEnter: [
        (content, redirect) =>{
            redirect('/meta/standard')
        }
    ],
    action : function(){
        Session.set("topMenuSite", "meta");
        BlazeLayout.render("ApplicationLayout", { main : "metaFP" });
    }
});

FlowRouter.route('/events/', {
    name : 'eventsFP',
    triggersEnter: [
        (content, redirect) =>{
            redirect('/events/standard')
        }
    ],
    action : function(){
        Session.set("topMenuSite", "events");
        BlazeLayout.render("ApplicationLayout", { main : "eventsFP" });
    }
});

FlowRouter.route('/events/:format', {
    name : 'events',
    action : function(){
        Session.set("topMenuSite", "events");
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

FlowRouter.route('/links', {
    name : 'links',
    action : function(){
        Session.set("topMenuSite", "decks");
        Session.set("selectedMenuFormat", this.getParam("format"));
        BlazeLayout.render("ApplicationLayout", { main : "Links" });
    }
});

FlowRouter.route('/FAQ', {
    name : 'FAQ',
    action : function(){
        Session.set("topMenuSite", "decks");
        Session.set("selectedMenuFormat", this.getParam("format"));
        BlazeLayout.render("ApplicationLayout", { main : "FAQ" });
    }
});

FlowRouter.route('/CompanyInformation', {
    name : 'CompanyInformation',
    action : function(){
        Session.set("topMenuSite", "decks");
        Session.set("selectedMenuFormat", this.getParam("format"));
        BlazeLayout.render("ApplicationLayout", { main : "CompanyInformation" });
    }
});

FlowRouter.route('/user/usersdecks/:UsersDecks_id', {
    name : 'CompanyInformation',
    action : function(){
        Session.set("topMenuSite", "decks");
        Session.set("selectedMenuFormat", this.getParam("format"));
        BlazeLayout.render("ApplicationLayout", { main : "UsersDecks" });
    }
});


FlowRouter.route('/user/LGS/:LGS_id', {
    name : 'LGSPage',
    action : function(){
        BlazeLayout.render("ApplicationLayout", { main : "LGSPage" });
    }
});

