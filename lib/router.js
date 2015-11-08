
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
    path: '/decks/:format?/:deckName?',
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
    data: function(){
        if(this.params.hasOwnProperty('deckName')){
            Session.set(SV_decksSelectedDeckName, this.params.deckName);
        }

        if(this.params.hasOwnProperty('format')){
            Session.set(SV_decksSelectedFormat, this.params.format);
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
    path : '/meta/:format?',
    data: function(){
        if(this.params.hasOwnProperty('format')){
            Session.set(SV_metaSelectedFormat, this.params.format);
        }
        Session.set('siteColor', Session.get('meta'));
        Session.set("siteName", 'meta');
    },
    yieldRegions: {
        'bottomMenu': {to: 'secondaryMenu'}
    }
});

Router.route('IRONdeckNaming', {
    path : '/deckNaming/:options/:format?/:deckID?',
    //name: 'IRONdeckNaming',
    data: function(){

        if(this.params.hasOwnProperty("format") ) {
            Session.set(SV_deckNamingFormat, this.params.format);
        }

        if(this.params.deckID){

            Meteor.call('findOneDeckWithoutName',this.params.deckID, function (error, data) {
                if (error) {
                    console.log(error);
                    return;
                }
                Session.set('uniqueDeckPercentageOptions', data);
            });
        }

        var siteName = "";
        if(this.params.format){
            siteName = "deck naming: " +  this.params.format;
        }else{
            siteName += "deck naming";
        }
        Session.set('siteColor', Session.get('meta'));
        Session.set("siteName", siteName);
        console.log("data");
    },
    yieldRegions: {
        'MENU_deckNames': {to: 'popUpMenu'}
        //,
        //'deckFormList': {to: 'base'}
    },
    action : function(){
        console.log("action");
        this.render(this.params.options, {to: 'base'});
        this.render();
    },
    waitOn : function(){
        return Meteor.subscribe("testing", this.params.format);

        //return [Meteor.subscribe('decksWithoutName', this.params.format), Meteor.subscribe('joinCards', this.params.deckID)];
    },
    fastRender : true
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

