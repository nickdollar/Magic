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
//             getMTGOPTQEventsAndDecks({Formats_id : "sta", days : 15, dateType : "current"});
//             getMTGOPTQEventsAndDecks({Formats_id : "mod", days : 15, dateType : "current"});
//             getMTGOPTQEventsAndDecks({Formats_id : "leg", days : 15, dateType : "current"});
//             getMTGOPTQEventsAndDecks({Formats_id : "vin", days : 15, dateType : "current"});
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
//             getLeagueEventsAndDecks({Formats_id : "sta", days : 15, dateType : "current"});
//             getLeagueEventsAndDecks({Formats_id : "mod", days : 15, dateType : "current"});
//             getLeagueEventsAndDecks({Formats_id : "leg", days : 15, dateType : "current"});
//             getLeagueEventsAndDecks({Formats_id : "vin", days : 15, dateType : "current"});
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
//     //
//     // SyncedCron.add({
//     //     name: "Update Meta Newest",
//     //     schedule: function(parser) {
//     //         timer += distanceBetween;
//     //         return parser.text(`every ${hour} h on the ${timer} m`);
//     //     },
//     //     job: function() {
//     //         Meteor.call("createMetaNewest", "sta");
//     //         Meteor.call("createMetaNewest", "mod");
//     //         Meteor.call("createMetaNewest", "leg");
//     //         Meteor.call("createMetaNewest", "vin");
//     //     }
//     // });
//     //
//     SyncedCron.add({
//         name: "Update Meta Newest Last Days",
//         schedule: function(parser) {
//             timer += distanceBetween;
//             return parser.text(`every ${hour} h on the ${timer} m`);
//         },
//         job: function() {
//             createMetaNewThings({Formats_id : "sta"});
//             createMetaNewThings({Formats_id : "mod"});
//             createMetaNewThings({Formats_id : "leg"});
//             createMetaNewThings({Formats_id : "vin"});
//
//         }
//     });
// }
//
// Meteor.startup(function() {
//     addCron();
//     SyncedCron.start();
// });