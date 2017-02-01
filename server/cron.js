addCron = function(){
    var distanceBetween = 4;
    var hour = 1;
    var timer = 0;
    timer -= distanceBetween;

    SyncedCron.add({
        name: "Fix All GP Events",
        schedule: function(parser) {
            timer += distanceBetween;
            return parser.text("every " + hour + " h on the "+ timer +" m");
        },
        job: function() {
            Meteor.call("fixAllGPEvents", "standard");
            Meteor.call("fixAllGPEvents", "modern");
            Meteor.call("fixAllGPEvents", "legacy");
            Meteor.call("fixAllGPEvents", "vintage");
        }
    });

    SyncedCron.add({
        name: "methods Download New Leagues",
        schedule: function(parser) {
            timer += distanceBetween;
            return parser.text("every " + hour + " h on the "+ timer +" m");
        },
        job: function() {
            Meteor.call("methodEventLeagueGetNewEvents", "standard");
            Meteor.call("methodEventLeagueGetNewEvents", "modern");
            Meteor.call("methodEventLeagueGetNewEvents", "legacy");
            Meteor.call("methodEventLeagueGetNewEvents", "vintage");
        }
    });

    SyncedCron.add({
        name: "Add Names To Decks Automatic",
        schedule: function(parser) {
            timer += distanceBetween;
            return parser.text("every " + hour + " h on the "+ timer +" m");
        },
        job: function() {
            Meteor.call("methodAddNameToDeckAutomatically", "standard");
            Meteor.call("methodAddNameToDeckAutomatically", "modern");
            Meteor.call("methodAddNameToDeckAutomatically", "legacy");
            Meteor.call("methodAddNameToDeckAutomatically", "vintage");
        }
    });

    SyncedCron.add({
        name: "Update Meta Cards",
        schedule: function(parser) {
            timer += distanceBetween;
            return parser.text("every " + hour + " h on the "+ timer +" m");
        },
        job: function() {
            Meteor.call("updateMetaCards", "standard");
            Meteor.call("updateMetaCards", "modern");
            Meteor.call("updateMetaCards", "legacy");
            Meteor.call("updateMetaCards", "vintage");
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