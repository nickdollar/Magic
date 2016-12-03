// weeklyDeckChange = function(){
//     var options = {types : ["daily4_0", "daily3_1", "ptqTop8", "ptqTop9_16", "ptqTop17_32"], dates : ["twoWeeks", "sixWeeks", "year"]},
//         typesCombinations = positionCombinationsOptions(options.types),
//         dates = getDateSyntax(options.dates),
//         decksNames = _DeckNames.find({format : "modern"}).map(function(name){
//             return name.name;
//         });
//     dates.forEach(function(date){
//         typesCombinations.forEach(function(typeCombination){
//             var allDecksQuery = _Deck.find({format : "modern", $or : typeCombination.values, date : {$gte : date.date }}).fetch();
//             if(allDecksQuery.length == 0) return;
//             var deckValues = [];
//             decksNames.forEach(function(name){
//                 var deckQuery = _Deck.find({name : name, format : "modern", $or : typeCombination.values, date : {$gte : date.date }}).fetch();
//                 if(deckQuery.length == 0) return;
//                 deckValues.push({name : name, percentageBonita : prettifyPercentage(deckQuery.length/allDecksQuery.length, 2), percentage : deckQuery.length/allDecksQuery.length, quantity : deckQuery.length});
//             });
//
//             optionPosition(deckValues);
//             weeklyDeckBlockChange(deckValues, date, typeCombination);
//             weeklyDeckBlockAdding(deckValues, date, typeCombination);
//             weeklyDeckPositionChange(deckValues, date, typeCombination);
//             weeklyDeckPositionChangeAdding(deckValues, date, typeCombination);
//
//
//             deckValues.forEach(function(deck){
//
//                 var baseValues = {option: "deck", date : date.type, name : deck.name, type : typeCombination.toString, format : "modern"};
//                 var newValues = {option: "deck", date : date.type, name : deck.name, type : typeCombination.toString, format : "modern"};
//                 for(var key in deck){
//                     newValues[key] = deck[key];
//                 }
//
//                 _MetaValues.update(baseValues,
//                     {
//                         $set: deck,
//                         $setOnInsert: newValues
//                     },
//                     {
//                         upsert: true
//                     }
//                 );
//             });
//         });
//     });
// };
//
// weeklyDeckPositionChangeAdding = function(deckValues, date, typeCombination){
//
//     var weekDateEnd = new Date(Date.UTC(2015, 11, 12, 23, 59, 59, 999));
//     var dateStart = new Date((weekDateEnd.getTime()  + 1) - (86400000 * 7 *  (date.weeks + 1))),
//         dateEnd = new Date((dateStart.getTime()  - 1) + (86400000 * 7));
//
//     for(var i = 0; i < date.weeks; i++) {
//         var deckResults = [];
//         deckValues.forEach(function(obj){
//             var result = 0;
//
//             var allDecksQuery = _Deck.find({format: "modern", $or: typeCombination.values, date: {$gte: dateStart, $lte: dateEnd}}).fetch();
//             var deckQuery = _Deck.find({name: obj.name, format: "modern", $or: typeCombination.values, date: {$gte: dateStart, $lte: dateEnd}}).fetch();
//             if (allDecksQuery.length != 0){
//                 result = deckQuery.length/allDecksQuery.length;
//             }
//             deckResults.push({name : obj.name, percentage : result});
//         });
//
//         deckResults.sort(function(a, b){
//             return b.percentage - a.percentage;
//         });
//
//         var position = 0;
//         var base_value = 9999;
//         deckResults.forEach(function(obj){
//             if(obj.percentage == base_value){
//                 obj.position = position;
//             }else if(obj.percentage < base_value){
//                 position++;
//                 base_value = obj.percentage;
//                 obj.position = position;
//             }
//
//             var deck = deckValues.find(function(obj2){
//                 return obj.name == obj2.name;
//             });
//
//             if(typeof deck.weeklyPositionAdding === "undefined"){
//                 deck.weeklyPositionAdding = [];
//             };
//             deck.weeklyPositionAdding.push(obj.position);
//         });
//
//         dateEnd = new Date(dateEnd.getTime() + (86400000 * 7));
//     }
//
//     deckValues.forEach(function(obj){
//         var lastWeekPosition = 1;
//
//         var positionUpDownEqual = [];
//         var positionWeekChange = [];
//         obj.weeklyPositionAdding.forEach(function(obj2){
//             var upDownEqual = "";
//             if(obj2 > lastWeekPosition){
//                 upDownEqual = "upArrow";
//             }else if(obj2 < lastWeekPosition){
//                 upDownEqual = "downArrow";
//             }else{
//                 upDownEqual = "square";
//             }
//
//             var weekChange = obj2 - lastWeekPosition;
//             lastWeekPosition = obj2;
//             position = obj2;
//
//             positionUpDownEqual.push(upDownEqual);
//             positionWeekChange.push(weekChange);
//         });
//         obj.positionUpDownEqualAdding = positionUpDownEqual;
//         obj.positionWeekChangeAdding = positionWeekChange;
//     });
//
//
// };
//
//
// weeklyDeckPositionChange = function(deckValues, date, typeCombination){
//
//
//     var weeksQuantity = 10;
//
//     var dateEnd = new Date(Date.UTC(2015, 11, 12, 23, 59, 59, 999));
//     var weekDateStart = new Date((dateEnd.getTime()  + 1) - (86400000 * 7 * weeksQuantity));
//     var weekDateEnd = new Date((dateEnd.getTime()) - (86400000 * 7 * (weeksQuantity - 1)));
//
//     var lastWeekValue = 0;
//     for(var i = 0; i < weeksQuantity; i++) {
//         var deckResults = [];
//         deckValues.forEach(function(obj){
//             var result = 0;
//             var allDecksQuery = _Deck.find({format: "modern", $or: typeCombination.values, date: {$gte: weekDateStart, $lte: weekDateEnd}}).fetch();
//             var deckQuery = _Deck.find({name: obj.name, format: "modern", $or: typeCombination.values, date: {$gte: weekDateStart, $lte: weekDateEnd}}).fetch();
//             if (allDecksQuery.length != 0){
//                 result = deckQuery.length/allDecksQuery.length;
//             }
//             deckResults.push({name : obj.name, percentage : result});
//         });
//
//         deckResults.sort(function(a, b){
//             return b.percentage - a.percentage;
//         });
//
//         var position = 0;
//         var base_value = 9999;
//         deckResults.forEach(function(obj){
//             if(obj.percentage == base_value){
//                 obj.position = position;
//             }else if(obj.percentage < base_value){
//                 position++;
//                 base_value = obj.percentage;
//                 obj.position = position;
//             }
//
//             var deck = deckValues.find(function(obj2){
//                 return obj.name == obj2.name;
//             });
//
//             if(typeof deck.weeklyPosition === "undefined"){
//                 deck.weeklyPosition = [];
//             };
//             deck.weeklyPosition.push(obj.position);
//         });
//         weekDateStart = new Date(weekDateStart.getTime() + (86400000 * 7));
//         weekDateEnd = new Date(weekDateEnd.getTime() + (86400000 * 7));
//     }
//
//     deckValues.forEach(function(obj){
//         var lastWeekPosition = 0;
//
//         var positionUpDownEqual = [];
//         var positionWeekChange = [];
//         obj.weeklyPosition.forEach(function(obj2){
//             var upDownEqual = "";
//             if(obj2 > lastWeekPosition){
//                 upDownEqual = "upArrow";
//             }else if(obj2 < lastWeekPosition){
//                 upDownEqual = "downArrow";
//             }else{
//                 upDownEqual = "square";
//             }
//
//             var weekChange = obj2 - lastWeekPosition;
//             lastWeekPosition = obj2;
//             position = obj2;
//
//             positionUpDownEqual.push(upDownEqual);
//             positionWeekChange.push(weekChange);
//         });
//
//
//         obj.positionUpDownEqual = positionUpDownEqual;
//         obj.positionWeekChange = positionWeekChange;
//     });
//
//
// };
// weeklyDeckBlockChange = function(deckValues, date, typeCombination){
//
//     var weeksQuantity = 10;
//     deckValues.forEach(function(deck){
//         var weekDataPercentage = [],
//             weekDataQuantity = [],
//             weekChange = [],
//             weekNegPosChange = [];
//
//         var dateEnd = new Date(Date.UTC(2015, 11, 12, 23, 59, 59, 999));
//         var weekDateStart = new Date((dateEnd.getTime()  + 1) - (86400000 * 7 * weeksQuantity)),
//             weekDateEnd = new Date((dateEnd.getTime()) - (86400000 * 7 * (weeksQuantity - 1)));
//
//
//         var lastWeekValue = 0;
//         for(var i = 0; i < weeksQuantity; i++) {
//             var position = "";
//             var change = 0;
//             var result = 0;
//             var allDecksQuery = _Deck.find({format: "modern", $or: typeCombination.values, date: {$gte: weekDateStart, $lte: weekDateEnd}}).fetch();
//             var deckQuery = _Deck.find({name: deck.name, format: "modern", $or: typeCombination.values, date: {$gte: weekDateStart, $lte: weekDateEnd}}).fetch();
//             if (allDecksQuery.length != 0){
//                 result = deckQuery.length/allDecksQuery.length;
//             }
//
//             if(result > lastWeekValue){
//                 position = "up";
//             }else if(result < lastWeekValue){
//                 position = "down";
//             }else{
//                 position = "equal";
//             }
//             change = result - lastWeekValue;
//             lastWeekValue = result;
//
//             weekDataPercentage.push(result);
//             weekDataQuantity.push(deckQuery.length);
//             weekChange.push(position);
//             weekNegPosChange.push(change);
//
//             weekDateStart = new Date(weekDateStart.getTime() + (86400000 * 7));
//             weekDateEnd = new Date(weekDateEnd.getTime() + (86400000 * 7));
//         }
//
//         deck.weekDataPercentage = weekDataPercentage;
//         deck.weekDataQuantity = weekDataQuantity;
//         deck.weekChange = weekChange;
//         deck.weekNegPosChange = weekNegPosChange;
//     });
// };
//
// weeklyDeckBlockAdding = function(deckValues, date, typeCombination){
//     deckValues.forEach(function(deck){
//         var weekAddPercentage = [],
//             weekAddQuantity = [],
//             weekAddChange = [],
//             weekAddNegPosChange = [];
//
//         var weekDateEnd = new Date(Date.UTC(2015, 11, 12, 23, 59, 59, 999));
//         var dateStart = new Date((weekDateEnd.getTime()  + 1) - (86400000 * 7 *  (date.weeks + 1))),
//             dateEnd = new Date((dateStart.getTime()  - 1) + (86400000 * 7));
//
//         var lastWeekValue = 0;
//         for(var i = 0; i < date.weeks; i++) {
//             var position = "";
//             var change = 0;
//             var result = 0;
//
//             var allDecksQuery = _Deck.find({format: "modern", $or: typeCombination.values, date: {$gte: dateStart, $lte: dateEnd}}).fetch();
//             var deckQuery = _Deck.find({name: deck.name, format: "modern", $or: typeCombination.values, date: {$gte: dateStart, $lte: dateEnd}}).fetch();
//             if (allDecksQuery.length != 0){
//                 result = deckQuery.length/allDecksQuery.length;
//             }
//
//             if(result > lastWeekValue){
//                 position = "up";
//                 change = result - lastWeekValue;
//             }else if(result < lastWeekValue){
//                 change = result - lastWeekValue;
//                 position = "down";
//             }else{
//                 position = "equal";
//             }
//             change = result - lastWeekValue;
//             lastWeekValue = result;
//
//             weekAddChange.push(position);
//             weekAddNegPosChange.push(change);
//             weekAddPercentage.push(result);
//             weekAddQuantity.push(deckQuery.length);
//             dateEnd = new Date(dateEnd.getTime() + (86400000 * 7));
//         }
//
//
//         deck.weekAddPercentage = weekAddPercentage;
//         deck.weekAddQuantity = weekAddQuantity;
//         deck.weekAddChange = weekAddChange;
//         deck.weekAddNegPosChange = weekAddNegPosChange;
//     });
// };
//
// //weeklyDeckBlockChange
// //  weekDataPercentage                [0,0,0.111111111111111,0.125]
// //  weekDataQuantity                  [0,0,0,0,0,1,1]
// //  weekChange                        ["equal","equal","equal","up","up","down","equal"]
// //  weekNegPosChange                  [0,0,0,0.111111111111111,0.0138888888888889,-0.125]
//
//
// //weeklyDeckBlockAdding
// //  weekAddPercentage                 [0.0769230769230769,0.125,0.114285714285714,0.0888888888888889]
// //  weekAddQuantity                   [4,4,4,4,4,4,5,6]
// //  weekAddChange                     ["up","up","down","down","down","down"]
// //  weekAddNegPosChange               [0.0769230769230769,0.0480769230769231,-0.0107142857142857,-0.0253968253968254]
//
//
// //weeklyDeckPositionChange
// //  weeklyPosition                    [1,1,1,1,1,1]
// //  positionUpDownEqual               ["upArrow","square","square","square"]
// //  positionWeekChange                [1,0,0,0]
//
// //weeklyDeckPositionChangeAdding
// //  weeklyPositionAdding              [1,1,1,1,1,1,1]
// //  positionUpDownEqualAdding         ["square","square","square","square"]
// //  positionWeekChangeAdding          [0,0,0,0,0]