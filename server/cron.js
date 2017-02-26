addCron = function(){
    var distanceBetween = 4;
    var hour = 1;
    var timer = 0;
    timer -= distanceBetween;

    SyncedCron.add({
        name: "Event League Get New Events",
        schedule: function(parser) {
            timer += distanceBetween;
            return parser.text("every " + hour + " h on the "+ timer +" m");
        },
        job: function() {
            Meteor.call("methodEventLeagueGetNewEvents", {format : "standard"});
            Meteor.call("methodEventLeagueGetNewEvents", {format : "modern"});
            Meteor.call("methodEventLeagueGetNewEvents", {format : "legacy"});
            Meteor.call("methodEventLeagueGetNewEvents", {format : "vintage"});
        }
    });

    SyncedCron.add({
        name: "Event League Get New Events",
        schedule: function(parser) {
            timer += distanceBetween;
            return parser.text("every " + hour + " h on the "+ timer +" m");
        },
        job: function() {
            Meteor.call("methodEventMTGOPTQGetInfoOld", {format : "standard"});
            Meteor.call("methodEventMTGOPTQGetInfoOld", {format : "modern"});
            Meteor.call("methodEventMTGOPTQGetInfoOld", {format : "legacy"});
            Meteor.call("methodEventMTGOPTQGetInfoOld", {format : "vintage"});
        }
    });

    SyncedCron.add({
        name: "Event GP Get New Events",
        schedule: function(parser) {
            timer += distanceBetween;
            return parser.text("every " + hour + " h on the "+ timer +" m");
        },
        job: function() {
            Meteor.call("methodGetGPEvents");
       }
    });

    SyncedCron.add({
        name: "getStarCityGamesEvents",
        schedule: function(parser) {
            timer += distanceBetween;
            return parser.text("every " + hour + " h on the "+ timer +" m");
        },
        job: function() {
            Meteor.call("getStarCityGamesEvents", {format : "standard"});
            Meteor.call("getStarCityGamesEvents", {format : "modern"});
            Meteor.call("getStarCityGamesEvents", {format : "legacy"});
            Meteor.call("getStarCityGamesEvents", {format : "vintage"});
        }
    });

    SyncedCron.add({
        name: "fixLeagueDailyEvent",
        schedule: function(parser) {
            timer += distanceBetween;
            return parser.text("every " + hour + " h on the "+ timer +" m");
        },
        job: function() {
            Meteor.call("fixLeagueDailyEvent");
            Meteor.call("fixLeagueDailyEvent");
            Meteor.call("fixLeagueDailyEvent");
            Meteor.call("fixLeagueDailyEvent");
        }
    });

    SyncedCron.add({
        name: "fixMTGOPTQEvent",
        schedule: function(parser) {
            timer += distanceBetween;
            return parser.text("every " + hour + " h on the "+ timer +" m");
        },
        job: function() {
            Meteor.call("fixMTGOPTQEvent");
            Meteor.call("fixMTGOPTQEvent");
            Meteor.call("fixMTGOPTQEvent");
            Meteor.call("fixMTGOPTQEvent");
        }
    });

    SyncedCron.add({
        name: "fixGPEvent",
        schedule: function(parser) {
            timer += distanceBetween;
            return parser.text("every " + hour + " h on the "+ timer +" m");
        },
        job: function() {
            Meteor.call("fixGPEvent");
        }
    });

    SyncedCron.add({
        name: "fixSCGEvent",
        schedule: function(parser) {
            timer += distanceBetween;
            return parser.text("every " + hour + " h on the "+ timer +" m");
        },
        job: function() {
            Meteor.call("fixSCGEvent");
        }
    });

    SyncedCron.add({
        name: "Update Meta Newest",
        schedule: function(parser) {
            timer += distanceBetween;
            return parser.text("every " + hour + " h on the "+ timer +" m");
        },
        job: function() {
            Meteor.call("createMetaNewest", "standard");
            Meteor.call("createMetaNewest", "modern");
            Meteor.call("createMetaNewest", "legacy");
            Meteor.call("createMetaNewest", "vintage");
        }
    });

    SyncedCron.add({
        name: "Update Meta Newest Last Days",
        schedule: function(parser) {
            timer += distanceBetween;
            console.log("every " + hour + " h on the "+ timer +" m");
            return parser.text("every " + hour + " h on the "+ timer +" m");
        },
        job: function() {
            Meteor.call("createMetaNewThingsDaysAllFormats");
        }
    });
}

Meteor.startup(function() {
    addCron();
    SyncedCron.start();
});