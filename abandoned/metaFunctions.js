// optionPosition = function(decks){
//
//     decks.sort(function(a, b){
//         return b.percentage - a.percentage;
//     });
//
//     var position = 0;
//     var base_value = 9999;
//     decks.forEach(function(deck){
//         if(deck.percentage == base_value){
//             deck.position = position;
//         }else if(deck.percentage < base_value){
//             position++;
//             base_value = deck.percentage;
//             deck.position = position;
//         }
//     });
// };
//
//
// arrayfy = function (archetypes) {
//     var options = {types : ["daily3_1", "daily4_0", "ptqTop8", "ptqTop9_16", "ptqTop17_32"], dates : ["twoWeeks", "sixWeeks", "year"]};
//     var typesCombinations = permutationAndCombination(options.types);
//     var dates = options.dates;
//     var archetypesResults = [];
//     for(var i = 0; i < dates.length; i++){
//         for(var j = 0; j < typesCombinations.length; j++){
//             var typesCombination = typesCombinations[j].toString();
//             var archeTypesValues = [];
//             for(var archeType in archetypes[dates[i]][typesCombination]){
//                 var decks = [];
//                 for(var deck in archetypes[dates[i]][typesCombination][archeType]["decks"]){
//                     decks.push({name : deck, value : archetypes[dates[i]][typesCombination][archeType][deck]});
//                 }
//                 archeTypesValues.push({ archetype : archeType, decks : decks});
//             }
//             archetypesResults.push({date : dates[i], types : typesCombination, archetypes : archeTypesValues});
//         }
//     }
//     return archetypesResults;
// }
//
// positionValues = function(positions){
//     var finalValues = [];
//     for(var i = 0; i < positions.length; i++){
//         var position = positions[i];
//
//         if(position == "daily3_1"){
//             finalValues.push({name : "daily3_1", position : {victory : 3, loss : 1}});
//         }
//
//         if(position == "daily4_0"){
//             finalValues.push({name : "daily4_0", position : {victory : 4, loss : 0}});
//         }
//
//         if(position == "ptqTop8"){
//             finalValues.push({name : "ptqTop8", position : {position : {$lte : 8}}});
//         }
//
//         if(position == "ptqTop9_16"){
//             finalValues.push({name : "ptqTop9_16", position : {position : {$gte : 9 , $lte : 16}}});
//         }
//
//         if(position == "ptqTop17_32"){
//             finalValues.push({name : position, position : {position : {$gte : 17, $lte : 32}}});
//         }
//     }
//     return finalValues;
// }
//
// getDateSyntax = function(types) {
//     var curr = new Date(Date.UTC(2015, 11, 12));
//     curr.setHours(0, 0, 0, 0);
//     var weekStart = new Date(curr.getTime() - 86400000 * (curr.getDay() - 1));
//     var weekEnd = new Date(weekStart.getTime() + 86400000 * 6);
//     weekEnd.setHours(23, 59, 59, 999);
//
//     var dates = [];
//     types.forEach(function(type){
//         if (type == "twoWeeks") {
//             dates.push({type : type, date: new Date(curr.getTime() - 86400000 * 2 * 7), weekStart : weekStart, weekEnd : weekEnd, weeks: 2});
//         }
//         if (type == "sixWeeks") {
//             dates.push({type : type, date: new Date(curr.getTime() - 86400000 * 6 * 7), weekStart : weekStart, weekEnd : weekEnd, weeks: 6});
//         }
//         if (type == "year") {
//             dates.push({type : type, date: new Date(curr.getTime() - 86400000 * 52 * 7), weekStart : weekStart, weekEnd : weekEnd,  weeks: 52});
//         }
//     })
//     return dates;
// }
//
// positionCombinationsOptions = function(x){
//     var positionCombinations = permutationAndCombination(x);
//     var finalValues = [];
//     for(var i = 0; i < positionCombinations.length; i++){
//         var positions = positionCombinations[i];
//         var values = [];
//         for(var j = 0; j < positions.length; j++){
//             var position = positions[j];
//             if(position == "daily3_1"){
//                 values.push({victory : 3, loss : 1});
//             }
//
//             if(position == "daily4_0"){
//                 values.push({victory : 4, loss : 0});
//             }
//
//             if(position == "ptqTop8"){
//                 values.push({position : {$lte : 8}});
//             }
//
//             if(position == "ptqTop9_16"){
//                 values.push({position : { $gte : 9 , $lte : 16}});
//             }
//
//             if(position == "ptqTop17_32"){
//                 values.push({position : {$gte : 17, $lte : 32}});
//             }
//         }
//         finalValues.push({toString : positions.toString(), values : values});
//     }
//     return finalValues;
// }
