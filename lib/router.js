
Router.configure({
    layoutTemplate: 'ApplicationLayout',
    yieldRegions: {
        //'PostAside': {to: 'aside'},
        //'PostFooter': {to: 'footer'},
        //'deck': {to: 'deck'}
    }
});


Router.route('event', {
    path : '/event/:_eventID?/:_deckID?',
    data: function(){
        if(this.params._eventID == null){
            Session.set("_selectedEventID", null);
        }else{
            Session.set("_selectedEventID", this.params._eventID);
            console.log("Selected ID: " + Session.get("_selectedEventID"));
        }

        if(this.params._deckID == null){
            Session.set("_selectedDeckID", null);
        }else{
            Session.set("_selectedDeckID", this.params._eventID);
        }

        Session.set("siteName", 'event');
        Session.set('siteColor', Session.get('deckCardName'));
    },
    yieldRegions: {
        'MENU_deckNames': {to: 'popUpMenu'}
        //,
        //'deckFormList': {to: 'base'}
    },
    action : function(){
        this.render(this.params.options, {to: 'base'});
        this.render();
    }
});


Router.route('decks', {
    //name : '',
    path: '/decks/:deckName?/',
    //controller : '',
    //template : 'homeTemplate',
    autoRender: false,
    //,
    //subscriptions: function(){},
    //layoutTemplate : 'ApplicationLayout'
    //,
    yieldRegions: {
        //'PostAside': {to: 'aside'},
        //'PostFooter': {to: 'footer'}
    },
    //,
    data: function(){
        if(this.params.hasOwnProperty('deckName')){
            //Session.set("selectedDeckName");
        }
        Session.set('siteColor', Session.get('deckCardName'));
    }
    //,
    //onRun: function () {},
    //onRerun: function () {},
    //onBeforeAction: function () {this.next();},
    //onAfterAction: function () {},
    //onStop: function () {},
    //action : function(){}
});


Router.route('main', {
    path : '/',
    data: function(){
        Session.set('siteName', Session.get('main'));
        Session.set('siteColor', Session.get('main'));
    },
    yieldRegions: {
        'testMenu': {to: 'popUpMenu'}
    }
});

Router.route('meta', {
    path : '/meta',
    data: function(){
        Session.set('siteColor', Session.get('meta'));
        Session.set("siteName", 'meta');
    },
    yieldRegions: {
        //'ironMeta': {to: 'something'},
        //'PostFooter': {to: 'footer'}
    }
});

Router.route('IRONdeckNaming', {
    path : '/deckNaming/:options/:format?/:deckID?',
    data: function(){
        if(this.params.deckID == null) {
            Session.set("noNameSelectedDeck", null);
        }

        if(this.params.format == null) {
            Session.set("noNameDeckFormat", null);
        }

        Session.set("noNameDeckFormat", this.params.format);


        if(this.params.deckID != null){
            Session.set("noNameSelectedDeck", this.params.deckID);

            Meteor.call('findOneDeckWithoutName',Session.get("noNameSelectedDeck"), Session.get("noNameDeckFormat"), function (error, data) {
                if (error) {
                    console.log(error);
                    return;
                }
                Session.set('uniqueDeckPercentageOptions', data);
            });
            console.log(this.params.hasOwnProperty('format'));
        }

        var siteName = "";
        if(this.params.format != null){
            siteName = "deck naming: " +  this.params.format;
        }else{
            siteName += "deck naming";
        }

        Session.set("siteName", siteName);
        Session.set('siteColor', Session.get('deckCardName'));
    },
    yieldRegions: {
        'MENU_deckNames': {to: 'popUpMenu'}
        //,
        //'deckFormList': {to: 'base'}
    },
    action : function(){

        this.render(this.params.options, {to: 'base'});
        this.render();
    }
});


Router.route('testing', {
    path : '/testing',
    data: function(){

        Session.set('siteColor', Session.get('testing'));
    }
    //yieldRegions: {
    //    'PostAside': {to: 'aside'},
    //    'PostFooter': {to: 'footer'}
    //}
});

Router.route('bootStrapTesting', {
    path : '/bootStrapTesting',
    data: function(){
        Session.set('siteColor', Session.get('bootStrapTesting'));
    }
    //yieldRegions: {
    //    'PostAside': {to: 'aside'},
    //    'PostFooter': {to: 'footer'}
    //}
});

//Router.route('/deck', function () {
//        this.layout('ApplicationLayout');
//        // render the Post template into the "main" region
//        // {{> yield}}
//        this.render('decks');
//
//        // render the PostAside template into the yield region named "aside"
//        // {{> yield "aside"}}
//        this.render('PostAside', {to: 'aside'});
//
//        // render the PostFooter template into the yield region named "footer"
//        // {{> yield "footer"}}
//        this.render('PostFooter', {to: 'footer'});
//});

//Router.route('/', function () {
//    this.layout('ApplicationLayout');
//
//    // render the Post template into the "main" region
//    // {{> yield}}
//    this.render('Post');
//
//    // render the PostAside template into the yield region named "aside"
//    // {{> yield "aside"}}
//    this.render('PostAside', {to: 'aside'});
//
//    // render the PostFooter template into the yield region named "footer"
//    // {{> yield "footer"}}
//    this.render('PostFooter', {to: 'footer'});
//});


//Router.route('home', {
//        //name : '',
//        path: '/',
//        //controller : '',
//        template : 'homeTemplate',
//        yieldRegions : {},
//        subscriptions: function(){},
//        layoutTemplate : 'ApplicationLayout',
//        waitOn : function(){
//        return[
//                Meteor.subscribe('deck', function(){
//                    console.log('deck Loaded');
//                }),
//                Meteor.subscribe('event', function(){
//                    console.log('event Loaded');
//                }),
//                Meteor.subscribe('joinCards', Session.get('selectedDeck'), function(){
//                    console.log('joinCards Loaded');
//                    Session.set('deckCardsLoaded', true);
//                })
//            ]
//        }
//    //,
//    //data: function(){},
//    //onRun: function () {},
//    //onRerun: function () {},
//    //onBeforeAction: function () {},
//    //onAfterAction: function () {},
//    //onStop: function () {},
//    //action : function(){}
//});
