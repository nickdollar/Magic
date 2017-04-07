// addCron = function(){
//     var distanceBetween = 15;
//     var hour = 1;
//     var timer = 0;
//     timer -= distanceBetween;
//
//     SyncedCron.add({
//         name: "getSCGEventsAndDecks",
//         schedule: function(parser) {
//             timer += distanceBetween;
//             return parser.text(`every ${hour} h on the ${timer} m`);
//         },
//         job: function() {
//             getSCGEventsAndDecks();
//         }
//     });
//
//     SyncedCron.add({
//         name: "getSCGDecksCards",
//         schedule: function(parser) {
//             timer += distanceBetween;
//             return parser.text(`every ${hour} h on the ${timer} m`);
//         },
//         job: function() {
//             getSCGDecksCards();
//         }
//     });
//
//     SyncedCron.add({
//         name: "getMTGOPTQEventsAndDecks",
//         schedule: function(parser) {
//             timer += distanceBetween;
//             return parser.text(`every ${hour} h on the ${timer} m`);
//         },
//         job: function() {
//             getMTGOPTQEventsAndDecks({format : "standard", days : 15, dateType : "current"});
//             getMTGOPTQEventsAndDecks({format : "modern", days : 15, dateType : "current"});
//             getMTGOPTQEventsAndDecks({format : "legacy", days : 15, dateType : "current"});
//             getMTGOPTQEventsAndDecks({format : "vintage", days : 15, dateType : "current"});
//         }
//     });
//
//     SyncedCron.add({
//         name: "getLeagueEventsAndDecks",
//         schedule: function(parser) {
//             timer += distanceBetween;
//             return parser.text(`every ${hour} h on the ${timer} m`);
//         },
//         job: function() {
//             getLeagueEventsAndDecks({format : "standard", days : 15, dateType : "current"});
//             getLeagueEventsAndDecks({format : "modern", days : 15, dateType : "current"});
//             getLeagueEventsAndDecks({format : "legacy", days : 15, dateType : "current"});
//             getLeagueEventsAndDecks({format : "vintage", days : 15, dateType : "current"});
//         }
//     });
//
//     SyncedCron.add({
//         name: "getGpEventsAndDecks",
//         schedule: function(parser) {
//             timer += distanceBetween;
//             return parser.text(`every ${hour} h on the ${timer} m`);
//         },
//         job: function() {
//             getGpEventsAndDecks();
//         }
//     });
//
//     SyncedCron.add({
//         name: "GPGetPosition",
//         schedule: function(parser) {
//             timer += distanceBetween;
//             return parser.text(`every ${hour} h on the ${timer} m`);
//         },
//         job: function() {
//             getGPPosition();
//         }
//     });
//
//     // SyncedCron.add({
//     //     name: "stopEventsPublished",
//     //     schedule: function(parser) {
//     //         timer += distanceBetween;
//     //         return parser.text("every 10 min");
//     //     },
//     //     job: function() {
//     //         Meteor.call("stopEventsPublished");
//     //     }
//     // });
//
//     // SyncedCron.add({
//     //     name: "Update Meta Newest",
//     //     schedule: function(parser) {
//     //         timer += distanceBetween;
//     //         return parser.text(`every ${hour} h on the ${timer} m`);
//     //     },
//     //     job: function() {
//     //         Meteor.call("createMetaNewest", "standard");
//     //         Meteor.call("createMetaNewest", "modern");
//     //         Meteor.call("createMetaNewest", "legacy");
//     //         Meteor.call("createMetaNewest", "vintage");
//     //     }
//     // });
//
//     // SyncedCron.add({
//     //     name: "Update Meta Newest Last Days",
//     //     schedule: function(parser) {
//     //         timer += distanceBetween;
//     //         console.log(`every ${hour} h on the ${time} m`);
//     //         return parser.text(`every ${hour} h on the ${timer} m`);
//     //     },
//     //     job: function() {
//     //         Meteor.call("createMetaNewThingsDays AllFormats");
//     //     }
//     // });
// }
//
// Meteor.startup(function() {
//     addCron();
//     SyncedCron.start();
// });