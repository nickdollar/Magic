
Router.configure({
    layoutTemplate: 'ApplicationLayout'
});

Router.route('dashBoard', {
    path : '/event/dashBoard',
    data: function(){
        Session.set("topMenuSite", "dashBoard");

    },
    waitOn : function(){

    }
});


Router.route('selectedEvent', {
    path : '/event/:format/:_eventID/:_deckID?',
    data: function(){
        Session.set("currentRouter", "selectedEvent");
        Session.set("topMenuSite", "event");
        Session.set("selectedEvent_format", "event");
        Session.set("selectedEvent__eventID", this.params._eventID);
        Session.set("selectedEvent__deckID", this.params._deckID);
        Session.set("selectedMenuFormat", this.params.format);
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

Router.route('events', {
    path : '/event/:format?',
    data: function(){
        Session.set("currentRouter", "selectedEvent");
        Session.set("topMenuSite", "event");
    },
    waitOn : function(){
        return [
            Meteor.subscribe("mtgoEventsTable", this.params.format),
            Meteor.subscribe("pastEventsTable", this.params.format),
            Meteor.subscribe("futureEventsTable", this.params.format)
        ]
    },
    fastRender : true
});

Router.route('audit', {
    path : '/audit/:format?',
    data: function(){
        Session.set("topMenuSite", "audit");
    },
    waitOn : function(){
        return [
            Meteor.subscribe("eventOthersTable", this.params.format)
        ]
    }
});



Router.route('deckSelected', {
    path: 'decks/:format/:archetype/:deckSelected?',
    data : function(){
        Session.set("topMenuSite", "deck");
        Session.set("currentRouter", "deckSelected");
        Session.set("selectedMenuFormat", this.params.format);
        //Meteor.call('getPlayListDataMETHOD', this.params.format, this.params.deckSelected.replace(/-/," "), function(error, result){
        //    if(error){
        //        alert('Error');
        //    }else{
        //        Session.set("playlists" , result);
        //    }
        //});
    },
    waitOn : function(){
        var subscriptions = [];
        if(this.params.deckSelected){
            subscriptions.push(Meteor.subscribe('deckSelectedDeckEventsDaily', this.params.format, this.params.deckSelected.replace(/-/g," ")));
            subscriptions.push(Meteor.subscribe('deckSelectedDeckEventsPtq', this.params.format, this.params.deckSelected.replace(/-/g," ")));
            subscriptions.push(Meteor.subscribe('joinExampleCardsDaily', this.params.format, this.params.deckSelected.replace(/-/g," ")));
            subscriptions.push(Meteor.subscribe('joinExampleCardsPtq', this.params.format, this.params.deckSelected.replace(/-/g," ")));
        }
        subscriptions.push(Meteor.subscribe('deckSelectedImages'));
        subscriptions.push(Meteor.subscribe('deckSelectedDeckPlaylistUpvotes'));
        subscriptions.push(Meteor.subscribe('deckSelectedDeckPlaylistResults'));
        subscriptions.push(Meteor.subscribe('deckSelectedDeckArchetypes', this.params.format));
        subscriptions.push(Meteor.subscribe('deckSelectedDeckCardsWeekChange'));
        subscriptions.push(Meteor.subscribe('deckSelectedArchetypeDeckNames', this.params.format, this.params.archetype));
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
        subscriptions.push(Meteor.subscribe('selectADeckDeckPlaylist'));
        subscriptions.push(Meteor.subscribe('selectADeckDeckArchetypes', this.params.format));
        subscriptions.push(Meteor.subscribe('decknames'));
        subscriptions.push(Meteor.subscribe('selectADeckDeck'));
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
        //var subscriptions = [];
        //subscriptions.push(Meteor.subscribe('event'));
        //subscriptions.push(Meteor.subscribe('images'));
        //subscriptions.push(Meteor.subscribe('event'));
        //subscriptions.push(Meteor.subscribe('deckplaylist'));
        //return subscriptions;
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
