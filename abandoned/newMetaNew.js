// createMetaNewThings = function(){
//     var formats = ["standard","modern","legacy", "vintage"];
//     console.log("createMetaNewThings");
//     for(var i = 0; i < formats.length; ++i){
//         createMetaNewDecks(formats[i]);
//         createMetaArchetypesDecks(formats[i]);
//         createMetaNewCards(formats[i]);
//     }
//     console.log("end");
// }
//
// createMetaNewThingsDays = function(){
//     console.log("createMetaNewThingsDays");
//     createMetaNewDecksLatestDays(14);
//     createMetaArchetypesDecksLatestDays(14);
//     createMetaNewCardsLatestDays(14);
//     console.log("end");
// }
//
// createMetaNewDecks = function(format){
//     var newestDecks = DecksData.aggregate(
//         [
//             {
//                 $match : {
//                     DecksNames_id : {$exists : 1}, format : format
//                 }
//             },
//             {
//                 $group : {
//                     _id : "$DecksNames_id",
//                     format : {$first : "$format"},
//                     DecksData_id : {$first : "$_id"},
//                     Events_id : {$first : "$Events_id"},
//                     date : {
//                         $min : "$date"
//                     }
//                 }
//             },
//             {
//                 $sort : {
//                     date : -1
//                 }
//             },
//             {
//                 $limit : 20
//             },
//             {
//                 $project : {
//                     _id : "$_id",
//                     format : "$format",
//                     DecksData_id : "$DecksData_id",
//                     Events_id : "$Events_id",
//                     date : "$date",
//                     t : {$const : 1}
//                 }
//             }
//         ]
//     )
//
//     MetaNewest.update(
//         {type : "lastTwenty", format : format},
//         {$set : {newestDecks : newestDecks}},
//         {upsert : true}
//     )
// }
//
// createMetaArchetypesDecks = function(format){
//     var newestArchetypes = DecksData.aggregate(
//         [
//             {
//                 $match : {
//                     format : format,
//                 }
//             },
//             {
//                 $sort : {
//                     date : -1
//                 }
//             },
//             {
//                 $group : {
//                     _id : {DecksNames_id : "$DecksNames_id"},
//                     format : {$first : "$format"},
//                     DecksData_id : {$first : "$_id"},
//                     Events_id : {$first : "$Events_id"},
//                     date : {$min : "$date"}
//                 }
//             },
//             {
//                 $lookup : {
//                     "from" : "DecksNames",
//                     "localField" : "_id.DecksNames_id",
//                     "foreignField" : "_id",
//                     "as" : "DecksNames"
//                 }
//             },
//             {
//                 $unwind : "$DecksNames"
//             },
//             {
//                 $group : {
//                     _id : {DecksArchetypes_id : "$DecksNames.DecksArchetypes_id"},
//                     format : {$first : "$format"},
//                     DecksNames_id : {$first : "$DecksNames._id"},
//                     DecksData_id : {$first : "$DecksData_id"},
//                     Events_id : {$first : "$Events_id"},
//                     date : { $min : "$date"}
//                 }
//             },
//             {
//                 $sort : {
//                     date : -1
//                 }
//             },
//             {
//                 $limit : 20
//             },
//             {
//                 $project : {
//                     _id : "$_id.DecksArchetypes_id",
//                     format : "$format",
//                     DecksNames_id : "$DecksNames_id",
//                     DecksData_id : "$DecksData_id",
//                     Events_id : "$Events_id",
//                     date : "$date",
//                     t : {$const : 2}
//                 }
//             }
//         ]
//     )
//
//     MetaNewest.update(
//         {type : "lastTwenty", format : format},
//         {$set : {newestArchetypes : newestArchetypes}},
//         {upsert : true}
//     )
// }
//
//
// createMetaNewCards = function(format){
//     var newestCards = DecksData.aggregate(
//         [
//             {
//                 $match : {
//                     format : format,
//                 }
//             },
//             { $project :
//             {
//                 cards : {
//                     "$setUnion" :
//                         [
//                             {
//                                 $map : {
//                                     input : "$main",
//                                     as: "el",
//                                     in : {
//                                         name : "$$el.name",
//                                         format : "$format",
//                                         class : {"$const" : "main"},
//                                         date : "$date",
//                                         DecksData_id : "$_id",
//                                         Events_id : "$Events_id"
//                                     }
//                                 }
//                             },
//                             {
//                                 $map : {
//                                     input : "$sideboard",
//                                     as: "el",
//                                     in : {
//                                         name : "$$el.name",
//                                         format : "$format",
//                                         class : {"$const" : "sideboard"},
//                                         date : "$date",
//                                         DecksData_id : "$_id",
//                                         Events_id : "$Events_id"
//                                     }
//                                 }
//                             }
//                         ]
//                 }
//             }
//             },
//             {$unwind : "$cards"},
//             {$sort : {
//                 "cards.date" : -1
//             }},
//             {$group:
//             {
//                 _id : "$cards.name",
//                 format : {$first : "$cards.format"},
//                 DecksData_id : {$first : "$cards.DecksData_id"},
//                 Events_id : {$first : "$cards.Events_id"},
//                 date : {$min : "$cards.date"}
//             }
//             },
//             {$sort : {
//                 date : -1
//             }},
//             {
//                 $limit : 20
//             },
//             {
//                 $project : {
//                     _id : "$_id",
//                     format : "$format",
//                     DecksData_id : "$DecksData_id",
//                     Events_id : "$Events_id",
//                     date : "$date",
//                     t : {$const : 3}
//                 }
//             }
//         ]
//     )
//
//     MetaNewest.update(
//         {type : "lastTwenty", format : format},
//         {$set : {newestCards : newestCards}},
//         {upsert : true}
//     )
// }
//
//
//
// createMetaNewDecksLatestDays = function(days){
//     var date = new Date();
//     date.setDate(date.getDate() - days);
//     var newestDecks = DecksData.aggregate(
//         [
//             {
//                 $match : {
//                     DecksNames_id : {$exists : 1}
//                 }
//             },
//             {
//                 $group : {
//                     _id : {DecksNames_id : "$DecksNames_id", format : "$format"},
//                     DecksData_id : {$first : "$_id"},
//                     Events_id : {$first : "$Events_id"},
//                     date : {
//                         $min : "$date"
//                     }
//                 }
//
//             },
//             {
//                 $sort : {
//                     date : -1
//                 }
//             },
//             {
//                 $match : {date : {$gte : date}}
//             },
//             {
//                 $project : {
//                     _id : "$_id.DecksNames_id",
//                     format : "$_id.format",
//                     DecksData_id : "$DecksData_id",
//                     Events_id : "$Events_id",
//                     date : "$date",
//                     t : {$const : 1}
//                 }
//             }
//         ]
//     )
//
//     MetaNewest.update(
//         {type : "lastDays"},
//         {$set : {newestDecks : newestDecks}},
//         {upsert : true}
//     )
// }
//
// createMetaArchetypesDecksLatestDays = function(days){
//     var date = new Date();
//     date.setDate(date.getDate() - days);
//     var newestArchetypes = DecksData.aggregate(
//         [
//             {
//                 $sort : {
//                     date : -1
//                 }
//             },
//             {
//                 $group : {
//                     _id : {DecksNames_id : "$DecksNames_id"},
//                     format : {$first : "$format"},
//                     DecksData_id : {$first : "$_id"},
//                     Events_id : {$first : "$Events_id"},
//                     date : {$min : "$date"}
//                 }
//             },
//             {
//                 $lookup : {
//                     "from" : "DecksNames",
//                     "localField" : "_id.DecksNames_id",
//                     "foreignField" : "_id",
//                     "as" : "DecksNames"
//                 }
//             },
//             {
//                 $unwind : "$DecksNames"
//             },
//             {
//                 $group : {
//                     _id : {DecksArchetypes_id : "$DecksNames.DecksArchetypes_id"},
//                     format : {$first : "$format"},
//                     DecksNames_id : {$first : "$DecksNames._id"},
//                     DecksData_id : {$first : "$DecksData_id"},
//                     Events_id : {$first : "$Events_id"},
//                     date : { $min : "$date"}
//                 }
//             },
//             {
//                 $sort : {
//                     date : -1
//                 }
//             },
//             {
//                 $match : {date : {$gte : date}}
//             },
//             {
//                 $project : {
//                     _id : "$_id.DecksArchetypes_id",
//                     format : "$format",
//                     DecksNames_id : "$DecksNames_id",
//                     DecksData_id : "$DecksData_id",
//                     Events_id : "$Events_id",
//                     date : "$date",
//                     t : {$const : 2}
//                 }
//             }
//         ]
//     )
//
//     MetaNewest.update(
//         {type : "lastDays"},
//         {$set : {newestArchetypes : newestArchetypes}},
//         {upsert : true}
//     )
// }
//
//
// createMetaNewCardsLatestDays = function(days){
//
//     var date = new Date();
//     date.setDate(date.getDate() - days);
//
//     var newestCards = DecksData.aggregate(
//         [
//             { $project :
//             {
//                 cards : {
//                     "$setUnion" :
//                         [
//                             {
//                                 $map : {
//                                     input : "$main",
//                                     as: "el",
//                                     in : {
//                                         name : "$$el.name",
//                                         format : "$format",
//                                         class : {"$const" : "main"},
//                                         date : "$date",
//                                         DecksData_id : "$_id",
//                                         Events_id : "$Events_id"
//                                     }
//                                 }
//                             },
//                             {
//                                 $map : {
//                                     input : "$sideboard",
//                                     as: "el",
//                                     in : {
//                                         name : "$$el.name",
//                                         format : "$format",
//                                         class : {"$const" : "sideboard"},
//                                         date : "$date",
//                                         DecksData_id : "$_id",
//                                         Events_id : "$Events_id"
//                                     }
//                                 }
//                             }
//                         ]
//                 }
//             }
//             },
//             {$unwind : "$cards"},
//             {$sort : {
//                 "cards.date" : -1
//             }},
//             {$group:
//             {
//                 _id : {name : "$cards.name", format : "$cards.format"},
//                 DecksData_id : {$first : "$cards.DecksData_id"},
//                 Events_id : {$first : "$cards.Events_id"},
//                 date : {$min : "$cards.date"}
//             }
//             },
//             {
//                 $match : {date : {$gte : date}}
//             },
//             {$sort : {
//                 date : -1
//             }},
//             {
//                 $project : {
//                     _id : "$_id",
//                     DecksData_id : "$DecksData_id",
//                     Events_id : "$Events_id",
//                     date : "$date",
//                     t : {$const : 3}
//                 }
//             }
//         ]
//     )
//     MetaNewest.update(
//         {type : "lastDays"},
//         {$set : {newestCards : newestCards}},
//         {upsert : true}
//     )
// }