// createDeckCardsMeta = function(format, startDate, endDate){
//     console.log("start createDeckCardsMeta2");
//     var optionsTypes = ["league5_0", "daily3_1", "daily4_0", "ptqTop8", "ptqTop9_16", "ptqTop17_32"];
//     var optionsTypes = ["league5_0"];
//     var optionsTimeSpan = ["month", "twoMonths", "sixMonths"];
//
//     MetaCards.remove({format : format});
//     var permComb = permutationAndCombination(optionsTypes);
//     permComb.forEach(function(optionsTypesObj, optionsTypesIndex){
//         console.log(optionsTypesObj.length, optionsTypesIndex)
//         optionsTimeSpan.forEach(function(timeSpanObj){
//             var days = optionsTimeSpanQuery[timeSpanObj];
//             var startDate = new Date();
//             var endDate = new Date();
//
//             startDate.setDate(startDate.getDate() - days);
//
//             var thatOptions = [];
//             for(var i = 0; i < optionsTypes.length; ++i){
//                 thatOptions.push(optionsTypeQuery[optionsTypes[i]]);
//             }
//             metaTotalDecksCards(format, timeSpanObj, startDate, endDate, optionsTypes, thatOptions);
//             metaCardsMain(format, timeSpanObj, startDate, endDate, optionsTypes, thatOptions);
//             metaCardsSideboard(format, timeSpanObj, startDate, endDate, optionsTypes, thatOptions);
//             metaCardsMainSideboard(format, timeSpanObj, startDate, endDate, optionsTypes, thatOptions);
//         });
//     });
//     metaCardsSortArrays();
//     console.log("end create meta 2");
// }
//
//
//
// metaTotalDecksCards = function(format, timeSpan, startDate, endDate, options, thatOptions){
//     var totalDecks = DecksData.find({format : format, date : {$gte : startDate, $lte : endDate}, DecksNames_id : {$ne : null}, $or : thatOptions}).count();
//
//     MetaCards.update(
//         {options : options, timeSpan : timeSpan, format : format},
//         {
//             $set : {totalDecks : totalDecks},
//         },
//         {
//             upsert : true
//         }
//     );
// };
//
//
// metaCardsMain = function(format, timeSpan, startDate, endDate, options, thatOptions){
//     var mainCards = DecksData.aggregate(
//         [
//             {$match : {date: {$gte: startDate, $lte: endDate}, format : format, $or: thatOptions, DecksNames_id : {$ne : null}}},
//             {$unwind : "$main"},
//             {$group : {_id : "$main.name", total : {$sum : "$main.quantity"}, count : {$sum : 1}}},
//             {$sort : {total : -1}}
//         ]
//     );
//
//     for(var i = 0; i < mainCards.length; ++i){
//         if(MetaCards.find({options : options, timeSpan : timeSpan, format : format, "main._id" : mainCards[i]._id }).count()){
//             MetaCards.update(
//                 {options : options, timeSpan : timeSpan, format : format, "main._id" : mainCards[i]._id},
//                 {
//                     $set : { "main.$" : mainCards[i]},
//                 }
//             );
//         }else{
//             MetaCards.update(
//                 {options : options, timeSpan : timeSpan, format : format},
//                 {
//                     $push : { main : mainCards[i]},
//                 },
//                 {
//                     upsert : true
//                 }
//             );
//         }
//     }
// };
//
// metaCardsSideboard = function(format, timeSpan, startDate, endDate, options, thatOptions){
//     var sideboard = DecksData.aggregate(
//         [
//             {$match : {date: {$gte: startDate, $lte: endDate}, format : format, $or: thatOptions, DecksNames_id : {$ne : null}}},
//             {$unwind : "$sideboard"},
//             {$group : {_id : "$sideboard.name", total : {$sum : "$sideboard.quantity"}, count : {$sum : 1}}},
//             {$sort : {total : -1}}
//         ]
//     );
//
//     for(var i = 0; i < sideboard.length; ++i){
//         if(MetaCards.find({options : options, timeSpan : timeSpan, format : format, "sideboard._id" : sideboard[i]._id }).count()){
//             MetaCards.update(
//                 {options : options, timeSpan : timeSpan, format : format, "sideboard._id" : sideboard[i]._id},
//                 {
//                     $set : { "sideboard.$" : sideboard[i]},
//                 }
//             );
//         }else{
//             MetaCards.update(
//                 {options : options, timeSpan : timeSpan, format : format},
//                 {
//                     $push : { sideboard : sideboard[i]},
//                 },
//                 {
//                     upsert : true
//                 }
//             );
//         }
//     }
// };
//
// metaCardsMainSideboard = function(format, timeSpan, startDate, endDate, options, thatOptions){
//
//     var mainSideboard = DecksData.aggregate(
//         [
//             {$match : {date: {$gte: startDate, $lte: endDate}, format : format, $or: thatOptions, DecksNames_id : {$ne : null}}},
//             {$project : {cards : {"$setUnion" : [{$map : {input : "$main", as: "el", in : {name : "$$el.name", quantity : "$$el.quantity", class : {"$const" : "main"}}}},
//             {$map : { input : "$sideboard", as: "el", in : { name : "$$el.name", quantity : "$$el.quantity", class : {"$const" : "sideboard"}}}}]}}},
//             {$unwind : "$cards"},
//             {$group : {"_id": { _id : "$_id", class: "$cards.class", name: "$cards.name" }, quantity : {$sum : "$cards.quantity"}}},
//             {$group : {_id : {_id : "$_id._id", name : "$_id.name"}, quantity: {$sum : "$quantity"}}},
//             {$group : {	_id : "$_id.name", total: {$sum : "$quantity"}, count: {$sum : 1}}}
//         ]
//     );
//
//
//     console.log(mainSideboard);
//     for(var i = 0; i < mainSideboard.length; ++i){
//         if(MetaCards.find({options : options, timeSpan : timeSpan, format : format, "mainSideboard._id" : mainSideboard[i]._id }).count()){
//             MetaCards.update(
//                 {options : options, timeSpan : timeSpan, format : format, "mainSideboard._id" : mainSideboard[i]._id},
//                 {
//                     $set : { "mainSideboard.$" : mainSideboard[i]},
//                 }
//             );
//         }else{
//             MetaCards.update(
//                 {options : options, timeSpan : timeSpan, format : format},
//                 {
//                     $push : { mainSideboard : mainSideboard[i]},
//                 },
//                 {
//                     upsert : true
//                 }
//             );
//         }
//     }
// };
//
//
// metaCardsSortArrays = function(){
//     MetaCards.find({}).forEach(function(obj){
//         obj.main.sort(function(a, b){
//             return b.count - a.count;
//         });
//
//         obj.sideboard.sort(function(a, b){
//             return b.count - a.count;
//         });
//
//         obj.mainSideboard.sort(function(a, b){
//             return b.count - a.count;
//         });
//
//         MetaCards.update(
//             {_id : obj._id},
//             {
//                 $set : obj
//             })
//     })
// };