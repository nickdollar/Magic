//
//
//
// addCron = function(){
//     var distanceBetween = 5;
//     var hour = 4;
//     var timer = 0;
//     timer -= distanceBetween;
//     SyncedCron.add({
//         name: "Fix All Events",
//         schedule: function(parser) {
//             return parser.text("every " + hour + " h on the "+ timer +" m");
//         },
//         job: function() {
//             Meteor.call("fixAllEvents", "standard");
//             Meteor.call("fixAllEvents", "modern");
//             Meteor.call("fixAllEvents", "legacy");
//             Meteor.call("fixAllEvents", "vintage");
//         }
//     });
//
//     SyncedCron.add({
//         name: "Fix Old Events",
//         schedule: function(parser) {
//             timer += distanceBetween;
//             return parser.text("every " + hour + " h on the "+ timer +" m");
//         },
//         job: function() {
//             Meteor.call("fixOldEvents", "standard");
//             Meteor.call("fixOldEvents", "modern");
//             Meteor.call("fixOldEvents", "legacy");
//             Meteor.call("fixOldEvents", "vintage");
//         }
//     });
//
//     SyncedCron.add({
//         name: "methods Download New Leagues",
//         schedule: function(parser) {
//             timer += distanceBetween;
//             return parser.text("every " + hour + " h on the "+ timer +" m");
//         },
//         job: function() {
//             Meteor.call("methodEventLeagueGetNewEvents", "standard");
//             Meteor.call("methodEventLeagueGetNewEvents", "modern");
//             Meteor.call("methodEventLeagueGetNewEvents", "legacy");
//             Meteor.call("methodEventLeagueGetNewEvents", "vintage");
//         }
//     });
//
//     SyncedCron.add({
//         name: "Add Names To Decks Automatic",
//         schedule: function(parser) {
//             timer += distanceBetween;
//             return parser.text("every " + hour + " h on the "+ timer +" m");
//         },
//         job: function() {
//             Meteor.call("methodAddNameToDeckAutomatically", "standard");
//             Meteor.call("methodAddNameToDeckAutomatically", "modern");
//             Meteor.call("methodAddNameToDeckAutomatically", "legacy");
//             Meteor.call("methodAddNameToDeckAutomatically", "vintage");
//         }
//     });
//
//     SyncedCron.add({
//         name: "Update Meta DecksNames and Archetypes",
//         schedule: function(parser) {
//             timer += distanceBetween;
//
//             return parser.text("every " + hour + " h on the "+ timer +" m");
//         },
//         job: function() {
//             Meteor.call("MethodCreateMeta", "standard");
//             Meteor.call("MethodCreateMeta", "modern");
//             Meteor.call("MethodCreateMeta", "legacy");
//             Meteor.call("MethodCreateMeta", "vintage");
//         }
//     });
//
//     SyncedCron.add({
//         name: "Update Meta Cards",
//         schedule: function(parser) {
//             timer += distanceBetween;
//             return parser.text("every " + hour + " h on the "+ timer +" m");
//         },
//         job: function() {
//             Meteor.call("updateMetaCards", "standard");
//             Meteor.call("updateMetaCards", "modern");
//             Meteor.call("updateMetaCards", "legacy");
//             Meteor.call("updateMetaCards", "vintage");
//         }
//     });
//
//     SyncedCron.add({
//         name: "Update Meta Newest",
//         schedule: function(parser) {
//             timer += distanceBetween;
//             return parser.text("every " + hour + " h on the "+ timer +" m");
//         },
//         job: function() {
//             Meteor.call("createMetaNewest", "standard");
//             Meteor.call("createMetaNewest", "modern");
//             Meteor.call("createMetaNewest", "legacy");
//             Meteor.call("createMetaNewest", "vintage");
//         }
//     });
//
//     SyncedCron.add({
//         name: "Update Meta Newest Last Days",
//         schedule: function(parser) {
//             timer += distanceBetween;
//             console.log("every " + hour + " h on the "+ timer +" m");
//             return parser.text("every " + hour + " h on the "+ timer +" m");
//         },
//         job: function() {
//             Meteor.call("createMetaNewThingsDaysAllFormats");
//         }
//     });
// }
//
// Meteor.startup(function() {
//     addCron();
//     SyncedCron.start();
//
// });