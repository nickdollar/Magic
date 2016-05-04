
Router.configure({
    layoutTemplate: 'ApplicationLayout'
});

Router.route('selectedEvent', {
    path : '/event/:format/:_eventID/:_deckID?',
    data: function(){
        Session.set("currentRouter", "selectedEvent");
        Session.set("topMenuSite", "event");
        Session.set("selectedEvent_format", "event");
        Session.set("selectedEvent__eventID", this.params._eventID);
        Session.set("selectedEvent__deckID", this.params._deckID);
    },
    waitOn : function(){
        return [
            Meteor.subscribe('selectedEventDeck', this.params._eventID),
            Meteor.subscribe('selectedEventDeckCard', "ozRBGq5Dph9uLDn2i"),
            Meteor.subscribe('selectedEvent', "ozRBGq5Dph9uLDn2i")
        ]
    },
    fastRender : true
});

Router.route('deckSelected', {
    path: 'decks/:format/:archetype/:deckSelected?',
    data : function(){
        Session.set("topMenuSite", "deck");
        Session.set("currentRouter", "deckSelected");
    },
    waitOn : function(){
        if(this.params.deckSelected != null){
            Meteor.call('getPlayListDataMETHOD', this.params.format, this.params.deckSelected, function (error, data) {
                if (error) {
                    console.log(error);
                    return;
                }
                Session.set("deckSelectedData", data);
            });
        }

        var subscriptions = [];
        if(this.params.deckSelected){
            subscriptions.push(Meteor.subscribe('deckEventsDaily', this.params.format, this.params.deckSelected.replace(/-/g," ")));
            subscriptions.push(Meteor.subscribe('deckEventsPtq', this.params.format, this.params.deckSelected.replace(/-/g," ")));
            subscriptions.push(Meteor.subscribe('joinExampleCardsDaily', this.params.format, this.params.deckSelected.replace(/-/g," ")));
            subscriptions.push(Meteor.subscribe('joinExampleCardsPtq', this.params.format, this.params.deckSelected.replace(/-/g," ")));
        }
        subscriptions.push(Meteor.subscribe('images'));
        subscriptions.push(Meteor.subscribe('deckplaylist'));
        subscriptions.push(Meteor.subscribe('deckArchetypes', this.params.format));
        subscriptions.push(Meteor.subscribe('deckcardsweekchange'));
        subscriptions.push(Meteor.subscribe('archetypeDeckNames', this.params.format, this.params.archetype));
        return subscriptions;
    }
});

Router.route('selectADeck', {
    path: '/decks/:format',
    data : function(){
        Session.set("topMenuSite", "deck");
        Session.set("currentRouter", "selectADeck");
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
    path: '/decks/',
    data: function(){
        Session.set("topMenuSite", "deck");
        Session.set("currentRouter", "selectADeck");
    },
    waitOn : function(){
        var subscriptions = [];
        subscriptions.push(Meteor.subscribe('event'));
        subscriptions.push(Meteor.subscribe('images'));
        subscriptions.push(Meteor.subscribe('event'));
        subscriptions.push(Meteor.subscribe('deckplaylist'));
        return subscriptions;
    }
});


Router.route('main', {
    path : '/main/:format?',
    data: function(){
        Session.set("topMenuSite", "main");
        Session.set("currentRouter", "main");
    }
});

//Router.route('main/', {
//    path : '/:format',
//    data: function(){
//        Session.set('siteName', Session.get('main'));
//        Session.set('siteColor', Session.get('main'));
//    }
//});

Router.route('selectedMeta', {
    path : '/meta/:format',
    data: function(){
        Session.set("topMenuSite", "meta");
        Session.set("currentRouter", "selectedMeta");
        Session.set("types", "daily4_0,daily3_1,ptqTop8,ptqTop9_16,ptqTop17_32");
        Session.set("date", "year");

        Session.set('eventsFormat', this.params.format);

        //Meteor.call('getCardMeta', null, function (error, data) {
        //    if (error) {
        //        console.log(error);
        //        return;
        //    }
        //    Session.set("metaCards", data);
        //});

        Meteor.call('updateMetaMethod', null, function (error, data) {
            if (error) {
                console.log(error);
                return;
            }
            //Session.set("metaDecks", data);
        });
    },
    waitOn : function(){
        return [
            Meteor.subscribe('decknames'),
            Meteor.subscribe('metaEvent', this.params.format, "daily"),
            Meteor.subscribe('AllArchetype'),
            Meteor.subscribe('metaValues', "daily4_0,daily3_1,ptqTop8,ptqTop9_16,ptqTop17_32", "year"),
            Meteor.subscribe('metaCards', "daily4_0,daily3_1,ptqTop8,ptqTop9_16,ptqTop17_32", "year", 20)
        ]
    },
    fastRender : true
});

Router.route('metaFP', {
    path : '/meta/',
    data: function(){
        Session.set("topMenuSite", "meta");
        Session.set("currentRouter", "selectedMeta");
    },
    waitOn : function(){
            return [
                Meteor.subscribe('simplifiedTables')
            ]
    },
    fastRender : true
});

//Router.route('debug', {
//    path : '/debug/:format?/:deckID?',
//    data: function(){
//
//        if(this.params.hasOwnProperty("format") ) {
//            Session.set(SV_deckNamingFormat, this.params.format);
//        }
//
//        if(this.params.deckID){
//            Meteor.call('findOneDeckWithoutName',this.params.deckID, function (error, data) {
//                if (error) {
//                    console.log(error);
//                    return;
//                }
//                Session.set('uniqueDeckPercentageOptions', data);
//            });
//        }
//
//        var siteName = "";
//        if(this.params.format){
//            siteName = "deck naming: " +  this.params.format;
//        }else{
//            siteName += "deck naming";
//        }
//    },
//    waitOn : function(){
//        return Meteor.subscribe("testing", this.params.format);
//    },
//    fastRender : true
//});
