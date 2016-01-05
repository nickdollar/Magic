
Router.configure({
    layoutTemplate: 'ApplicationLayout'
});

Router.route('eventFP', {
    path : '/event/',
    data: function(){
        Session.set('siteColor', Session.get('meta'));
    }
});


Router.route('deckSelected', {
    path: 'decks/:format/:archetype/:deckSelected?',
    data : function(){
        Session.set('siteColor', Session.get('deckCardName'));
    },
    waitOn : function(){
        var subscriptions = [];
        if(this.params.deckSelected){
            subscriptions.push(Meteor.subscribe('deckEvents', this.params.format, this.params.deckSelected.replace(/-/g," ")));
            subscriptions.push(Meteor.subscribe('joinExampleCardsDaily', this.params.format, this.params.deckSelected.replace(/-/g," ")));
            subscriptions.push(Meteor.subscribe('joinExampleCardsPtq', this.params.format, this.params.deckSelected.replace(/-/g," ")));
        }
        subscriptions.push(Meteor.subscribe('images'));
        subscriptions.push(Meteor.subscribe('deckplaylist'));
        subscriptions.push(Meteor.subscribe('deckArchetypes', this.params.format));
        subscriptions.push(Meteor.subscribe('deckcardsweekchange'));
        return subscriptions;
    }
});



Router.route('selectADeck', {
    path: 'decks/:format',
    data : function(){
        Session.set('siteColor', Session.get('deckCardName'));
    },
    waitOn : function(){
        var subscriptions = [];
        subscriptions.push(Meteor.subscribe('event'));
        subscriptions.push(Meteor.subscribe('images'));
        subscriptions.push(Meteor.subscribe('event'));
        subscriptions.push(Meteor.subscribe('deckplaylist'));
        subscriptions.push(Meteor.subscribe('deckArchetypes', this.params.format));
        subscriptions.push(Meteor.subscribe('decknames'));
        subscriptions.push(Meteor.subscribe('deck'));
        return subscriptions;
    }
});


Router.route('deckFP', {
    path: '/decks',
    data: function(){
        Session.set('siteColor', Session.get('deckCardName'));
    },
    waitOn : function(){
        var subscriptions = [];
        subscriptions.push(Meteor.subscribe('event'));
        subscriptions.push(Meteor.subscribe('images'));
        subscriptions.push(Meteor.subscribe('event'));
        subscriptions.push(Meteor.subscribe('deckplaylist'));
        subscriptions.push(Meteor.subscribe('deckplaylist'));
        return subscriptions;
    }
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

Router.route('selectedMeta', {
    path : '/meta/:format',
    data: function(){
        Session.set('eventsFormat', this.params.format);
        Meteor.call('getCardMeta', null, function (error, data) {
            if (error) {
                console.log(error);
                return;
            }
            Session.set("metaCards", data);
        });

        Meteor.call('getDeckMeta', null, function (error, data) {
            if (error) {
                console.log(error);
                return;
            }
            Session.set("metaDecks", data);
        });

        Session.set('siteColor', Session.get('meta'));
        Session.set("siteName", 'meta');
    },
    waitOn : function(){
        return [
            Meteor.subscribe('decknames'),
            Meteor.subscribe('metaEvent', this.params.format, "daily")
        ]
    },
    fastRender : true

});

Router.route('metaFP', {
    path : '/meta/',
    data: function(){
        Session.set('siteColor', Session.get('meta'));
        Session.set("siteName", 'meta');
    },
    waitOn : function(){
            return [
                Meteor.subscribe('simplifiedTables')
            ]
    },
    fastRender : true
});

Router.route('debug', {
    path : '/debug/:format?/:deckID?',
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
    waitOn : function(){
        return Meteor.subscribe("testing", this.params.format);
    },
    fastRender : true
});
