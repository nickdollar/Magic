addCron = function(){
    var distanceBetween = 15;
    var hour = 1;
    var timer = 5;
    timer -= distanceBetween;
    var date = new Date();

    SyncedCron.add({
        name: "CreateTCGDailyPricesMethod",
        schedule: function(parser) {
            return parser.recur().on(fixTimeZone(3, date.getTimezoneOffset()/60, 5)).hour().on(0).minute();
        },
        job: function() {
            CreateTCGDailyPrices();
        }
    });

    SyncedCron.add({
        name: "giveLatestPriceForEachPrintings",
        schedule: function(parser) {
            return parser.recur().on(fixTimeZone(4, date.getTimezoneOffset()/60, 5)).hour().on(0).minute();
        },
        job: function() {
            giveLatestPriceForEachPrintings();
        }
    });

    SyncedCron.add({
        name: "giveLatestPriceForEach",
        schedule: function(parser) {
            return parser.recur().on(fixTimeZone(4, date.getTimezoneOffset()/60, 5)).hour().on(30).minute();
        },
        job: function() {
            giveLatestPriceForEach();
        }
    });

    SyncedCron.add({
        name: "getSCGEventsAndDecks",
        schedule: function(parser) {
            timer += distanceBetween;
            return parser.recur().on(fixTimeZone(3, date.getTimezoneOffset()/60, date.getTimezoneOffset()/60)).hour().on(timer).minute();
        },
        job: function() {
            getSCGEventsAndDecks();
        }
    });

    SyncedCron.add({
        name: "getSCGDecksCards",
        schedule: function(parser) {
            timer += distanceBetween;
            return parser.recur().on(fixTimeZone(3, date.getTimezoneOffset()/60, date.getTimezoneOffset()/60)).hour().on(timer).minute()
        },
        job: function() {
            getSCGDecksCards();
        }
    });

    SyncedCron.add({
        name: "getMTGOPTQEventsAndDecks",
        schedule: function(parser) {
            timer += distanceBetween;
            return parser.recur().on(fixTimeZone(3, date.getTimezoneOffset()/60, date.getTimezoneOffset()/60)).hour().on(timer).minute()
        },
        job: function() {
            getMTGOPTQEventsAndDecks({Formats_id : "sta", days : 15, dateType : "current"});
            getMTGOPTQEventsAndDecks({Formats_id : "mod", days : 15, dateType : "current"});
            getMTGOPTQEventsAndDecks({Formats_id : "leg", days : 15, dateType : "current"});
            getMTGOPTQEventsAndDecks({Formats_id : "vin", days : 15, dateType : "current"});
        }
    });

    SyncedCron.add({
        name: "getLeagueEventsAndDecks",
        schedule: function(parser) {
            timer += distanceBetween;
            return parser.recur().on(fixTimeZone(3, date.getTimezoneOffset()/60, date.getTimezoneOffset()/60)).hour().on(timer).minute()
        },
        job: function() {
            getLeagueEventsAndDecks({Formats_id : "sta", days : 15, dateType : "current"});
            getLeagueEventsAndDecks({Formats_id : "mod", days : 15, dateType : "current"});
            getLeagueEventsAndDecks({Formats_id : "leg", days : 15, dateType : "current"});
            getLeagueEventsAndDecks({Formats_id : "vin", days : 15, dateType : "current"});
        }
    });

    // SyncedCron.add({
    //     name: "getGpEventsAndDecks",
    //     schedule: function(parser) {
    //         timer += distanceBetween;
    //         return parser.text(`every ${hour} am on the ${timer} m`);
    //     },
    //     job: function() {
    //         getGpEventsAndDecks();
    //     }
    // });

    // SyncedCron.add({
    //     name: "GPGetPosition",
    //     schedule: function(parser) {
    //         timer += distanceBetween;
    //         return parser.text(`every ${hour} am on the ${timer} m`);
    //     },
    //     job: function() {
    //         getGPPosition();
    //     }
    // });

    SyncedCron.add({
        name: "Update Meta Newest Last Days",
        schedule: function(parser) {
            timer += distanceBetween;
            return parser.recur().on(1).hour().on(timer).minute()
        },
        job: function() {
            createMetaLastAddition();
            createMetaLastDaysAdditions();
        }
    });

    SyncedCron.add({
        name: "RemoveRemovedEventsMethod",
        schedule: function(parser) {
            timer += distanceBetween;
            return parser.recur().on(fixTimeZone(3, date.getTimezoneOffset()/60, date.getTimezoneOffset()/60)).hour().on(timer).minute()
        },
        job: function() {
            RemoveRemovedEvents();
        }
    });
}

Meteor.startup(function() {
    addCron();
    SyncedCron.start();
});