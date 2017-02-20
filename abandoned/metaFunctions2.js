// createMetaSLOW = function(format){
//     console.log("START: createMeta2");
//     Meta.remove({format : format});
//     // var optionsTypes = ["league5_0", "daily3_1", "daily4_0", "ptqTop8", "ptqTop9_16", "ptqTop17_32"];
//     var optionsTypes = ["league5_0", "daily3_1", "daily4_0"];
//     var optionsTimeSpan = ["month", "twoMonths", "sixMonths"];
//
//
//     var permComb = permutationAndCombination(optionsTypes);
//     permComb.forEach(function(optionsTypesObj, optionsTypesIndex){
//         var startDate = new Date();
//         var endDate = new Date();
//         optionsTimeSpan.forEach(function(timeSpanObj, timeSpanObjIndex){
//             // console.log(timeSpanObj.length, timeSpanObjIndex);
//             var days = optionsTimeSpanQuery[timeSpanObj];
//
//             startDate.setDate(startDate.getDate() - days);
//             var thatOptions = [];
//             for(var i = 0; i < optionsTypes.length; ++i){
//                 thatOptions.push(optionsTypeQuery[optionsTypes[i]]);
//             }
//
//             metaTotalDecks(format, timeSpanObj, startDate, endDate, optionsTypesObj, thatOptions);
//
//
//             metaDecksNamesMeta(format, timeSpanObj, startDate, endDate, optionsTypesObj, thatOptions);
//             // metaTotalDecksBlocks(format, timeSpanObj, startDate, endDate, optionsTypesObj, thatOptions);
//             metaDecksNamesMetaPosition(format, timeSpanObj, startDate, endDate, optionsTypesObj, thatOptions);
//             metaDecksNamesMetaPositionChange(format, timeSpanObj, startDate, endDate, optionsTypesObj, thatOptions);
//
//
//
//             metaDecksArchetypesMeta(format, timeSpanObj, startDate, endDate, optionsTypesObj, thatOptions);
//             // metaDecksArchetypesMetaBlocks(format, timeSpanObj, startDate, endDate, optionsTypesObj, thatOptions);
//             metaDecksArchetypesMetaPosition(format, timeSpanObj, startDate, endDate, optionsTypesObj, thatOptions);
//             metaDecksArchetypesMetaPositionChange(format, timeSpanObj, startDate, endDate, optionsTypesObj, thatOptions);
//         });
//     });
//     console.log("   END: createMeta2");
// }
//
//
// metaTotalDecks = function(format, timeSpan, startDate, endDate, options, thatOptions){
//
//     var totalAggregation = DecksNames.aggregate([
//         {$project : {"format" : 1}},
//         {$match : {format : format}},
//         {$lookup : {"from" : "DecksData", "localField" : "_id", "foreignField" : "DecksNames_id", "as" : "DecksData"}},
//         {$unwind : "$DecksData"},
//         {$project : {format : "$format", date : "$DecksData.date", victory : "$DecksData.victory", loss : "$DecksData.loss", type : "$DecksData.type"}},
//         {$match : {date : {$gte : startDate, $lte : endDate}, $or : thatOptions}},
//         {$group : {_id : "$format", total : {$sum : 1}}}
//     ]);
//
//     Meta.update(
//         {options : options, timeSpan : timeSpan, format : format},
//         {
//             $set : {totalDecks : totalAggregation[0].total},
//         },
//         {
//             upsert : true
//         }
//     );
//
//     // var totalDecks = DecksData.find({format : format, date : {$gte : startDate, $lte : endDate}, DecksNames_id : {$ne : null}, $or : thatOptions}).count();
// };
//
// metaDecksNamesMeta = function(format, timeSpan, startDate, endDate, options, thatOptions){
//     console.log("creating DecksNames Meta");
//
//     var DecksNamesMeta = DecksNames.aggregate([
//         {$project : {"format" : 1}},
//         {$match : {format : format}},
//         {$lookup : {"from" : "DecksData", "localField" : "_id", "foreignField" : "DecksNames_id", "as" : "DecksData"}},
//         {$project : {format : "$format", date : "$DecksData.date", victory : "$DecksData.victory", loss : "$DecksData.loss", type : "$DecksData.type", DecksData : "$DecksData"}},
//         {$match : {date : {$gte : startDate, $lte : endDate}, $or : thatOptions}},
//         {$project : {quantity : {$size : "$DecksData"}}}
//     ]);
//
//
//
//     for(var i = 0; i<DecksNamesMeta.length; ++i){
//         if(Meta.find({options : options, timeSpan : timeSpan, format : format, "DecksNamesMeta._id" : DecksNamesMeta[i]._id }).count()){
//             Meta.update(
//                 {options : options, timeSpan : timeSpan, format : format, "DecksNamesMeta._id" : DecksNamesMeta[i]._id},
//                 {
//                     $set : { "DecksNamesMeta.$.quantity" : DecksNamesMeta[i].quantity},
//                 }
//             );
//         }else{
//             Meta.update(
//                 {options : options, timeSpan : timeSpan, format : format},
//                 {
//                     $push : { DecksNamesMeta : DecksNamesMeta[i]},
//                 },
//                 {
//                     upsert : true
//                 }
//             );
//         }
//     }
// };
//
// metaDecksNamesMetaBlocks = function(format, timeSpan, startDate, endDate, options, thatOptions){
//     console.log("creating decks and blocks positions Change");
//     var decksNames = DecksNames.find({format : format}, {fields : {_id : 1 , name : 1}}).fetch();
//
//     var DecksNamesMetaBlocks = [];
//     for(var i = 0; i < decksNames.length; ++i){
//         var endDateBlocks = new Date(endDate.getTime());
//         var blocks = [];
//         while((startDate < endDateBlocks) && (blocks.length <5)){
//             blocks.push(DecksData.find({date : {$gte : startDate, $lte : endDateBlocks},  DecksNames_id : decksNames[i]._id, $or : thatOptions}).count());
//             endDateBlocks.setDate(endDateBlocks.getDate() - 7);
//         }
//         blocks.reverse();
//         DecksNamesMetaBlocks.push({_id : decksNames[i]._id, blocks : blocks});
//     }
//
//
//     for(var i = 0; i < DecksNamesMetaBlocks.length; ++i){
//         if(Meta.find({options : options, timeSpan : timeSpan, format : format, "DecksNamesMeta._id" : DecksNamesMetaBlocks[i]._id }).count()){
//             Meta.update(
//                 {options : options, timeSpan : timeSpan, format : format, "DecksNamesMeta._id" : DecksNamesMetaBlocks[i]._id},
//                 {
//                     $set : { "DecksNamesMeta.$.blocks" : DecksNamesMetaBlocks[i].blocks},
//                 }
//             );
//         }else{
//             Meta.update(
//                 {options : options, timeSpan : timeSpan, format : format},
//                 {
//                     $push : { DecksNamesMeta : DecksNamesMetaBlocks[i]},
//                 },
//                 {
//                     upsert : true
//                 }
//             );
//         }
//     }
// };
//
// metaDecksNamesMetaPosition = function(format, timeSpan, startDate, endDate, options, thatOptions){
//     console.log("metaDecksNamesMetaPosition");
//     var positions = DecksNames.aggregate([
//         {$project : {"format" : 1}},
//         {$match : {format : format}},
//         {$lookup : {"from" : "DecksData", "localField" : "_id", "foreignField" : "DecksNames_id", "as" : "DecksData"}},
//         {$unwind : "$DecksData"},
//         {$project : {date : "$DecksData.date", victory : "$DecksData.victory", loss : "$DecksData.loss", type : "$DecksData.type"}},
//         {$match : {date : {$gte : startDate, $lte : endDate}, $or : thatOptions}},
//         {$group : {_id : "$_id",quantity : {$sum : 1}}},
//         {$sort : {quantity : -1}}
//     ]);
//
//     //give Positions
//     var currentQuantity = 9999;
//     var position = 0;
//     positions.forEach(function(positionObj){
//         if(positionObj.quantity < currentQuantity){
//             position++;
//             currentQuantity = positionObj.quantity;
//             positionObj.position = position;
//         }else{
//             positionObj.position = position;
//         }
//     });
//
//     for(var i = 0; i < positions.length; ++i){
//         if(Meta.find({options : options, timeSpan : timeSpan, format : format, "DecksNamesMeta._id" : positions[i]._id }).count()){
//             Meta.update(
//                 {options : options, timeSpan : timeSpan, format : format, "DecksNamesMeta._id" : positions[i]._id},
//                 {
//                     $set : { "DecksNamesMeta.$.position" : positions[i].position},
//                 }
//             );
//         }else{
//             Meta.update(
//                 {options : options, timeSpan : timeSpan, format : format},
//                 {
//                     $push : { DecksNamesMeta : positions[i]},
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
// metaDecksNamesMetaPositionChange = function(format, timeSpan, startDate, endDate, options, thatOptions){
//     console.log("metaDecksNamesMetaPositionChange");
//     var optionsDays = [ {name : "week", days : 7}, {name : "twoWeeks", days : 14},
//         // {name : "month", days : 30}
//     ];
//
//
//     optionsDays.forEach(function(optionsDaysObj){
//         var DecksNamesMetaFirstDate = DecksNames.aggregate([
//             {$project : {"format" : 1}},
//             {$match : {format : format}},
//             {$lookup : {"from" : "DecksData", "localField" : "_id", "foreignField" : "DecksNames_id", "as" : "DecksData"}},
//             {$unwind : "$DecksData"},
//             {$project : {date : "$DecksData.date", victory : "$DecksData.victory", loss : "$DecksData.loss", type : "$DecksData.type"}},
//             {$match : {date : {$gte : startDate, $lte : endDate}, $or : thatOptions}},
//             {$group : {_id : "$_id",quantity : {$sum : 1}}},
//             {$sort : {quantity : -1}}
//         ]);
//
//
//
//         //old date query
//         var endDateBeforeDate = new Date(endDate.getTime());
//         endDateBeforeDate.setDate(endDateBeforeDate.getDate() - optionsDaysObj.days);
//
//         var DecksNamesMetaBeforeDate = DecksNames.aggregate([
//             {$project : {"format" : 1}},
//             {$match : {format : format}},
//             {$lookup : {"from" : "DecksData", "localField" : "_id", "foreignField" : "DecksNames_id", "as" : "DecksData" }},
//             {$unwind : "$DecksData"},
//             {$project : {date : "$DecksData.date", victory : "$DecksData.victory", loss : "$DecksData.loss", type : "$DecksData.type"}},
//             {$match : {date : {$gte : startDate, $lte : endDateBeforeDate},$or : thatOptions}},
//             {$group : {_id : "$_id", quantity : {$sum : 1}}},
//             {$sort : {quantity : -1}}
//         ]);
//
//         //give Positions
//         var currentQuantity = 9999;
//         var position = 0;
//         DecksNamesMetaFirstDate.forEach(function(DecksNamesMetaFirstDateObj){
//             if(DecksNamesMetaFirstDateObj.quantity < currentQuantity){
//                 position++;
//                 currentQuantity = DecksNamesMetaFirstDateObj.quantity;
//                 DecksNamesMetaFirstDateObj.position = position;
//             }else{
//                 DecksNamesMetaFirstDateObj.position = position;
//             }
//         });
//
//
//         currentQuantity = 9999;
//         position = 0;
//         DecksNamesMetaBeforeDate.forEach(function(DecksNamesMetaBeforeDateObj){
//             if(DecksNamesMetaBeforeDateObj.quantity < currentQuantity){
//                 position++;
//                 currentQuantity = DecksNamesMetaBeforeDateObj.quantity;
//                 DecksNamesMetaBeforeDateObj.position = position;
//             }else{
//                 DecksNamesMetaBeforeDateObj.position = position;
//             }
//         });
//
//
//
//         var DecksNamesPositionChange = [];
//
//         DecksNamesMetaFirstDate.forEach(function(DecksNamesMetaFirstDateObj){
//             var DecksNamesMetaBeforeDateQuery = DecksNamesMetaBeforeDate.find(function(DecksNamesMetaBeforeDateObj){
//                 return DecksNamesMetaBeforeDateObj._id == DecksNamesMetaFirstDateObj._id;
//             });
//
//             if(DecksNamesMetaBeforeDateQuery){
//                 var change = DecksNamesMetaBeforeDateQuery.position - DecksNamesMetaFirstDateObj.position;
//             }else{
//                 var change = 999;
//             }
//             DecksNamesPositionChange.push({_id : DecksNamesMetaFirstDateObj._id, change : change});
//         });
//
//         for(var i = 0; i < DecksNamesPositionChange.length; ++i){
//             if(Meta.find({options : options, timeSpan : timeSpan, format : format, "DecksNamesMeta._id" : DecksNamesPositionChange[i]._id }).count()){
//                 var setUpdate = {};
//                 setUpdate["DecksNamesMeta.$.positions."+ optionsDaysObj.name] = DecksNamesPositionChange[i].change;
//                 Meta.update(
//                     {options : options, timeSpan : timeSpan, format : format, "DecksNamesMeta._id" : DecksNamesPositionChange[i]._id},
//                     {
//                         $set : setUpdate,
//                     }
//                 );
//             }else{
//
//                 var setPush = {_id : DecksNamesPositionChange[i]._id};
//                 setPush.positions = {};
//                 setPush.positions[optionsDaysObj.name] = DecksNamesPositionChange[i].change;
//                 Meta.update(
//                     {options : options, timeSpan : timeSpan, format : format},
//                     {
//                         $push : { DecksNamesMeta : setPush},
//                     },
//                     {
//                         upsert : true
//                     }
//                 );
//             }
//         }
//
//     });
// };
//
// metaDecksArchetypesMeta = function(format, timeSpan, startDate, endDate, options, thatOptions){
//     console.log("Start Archetypes Meta");
//
//     var DecksArchetypesMeta = DecksArchetypes.aggregate([
//         {$project : {"format" : 1}},
//         {$match : {format : format}},
//         {$lookup : {"from" : "DecksNames", "localField" : "_id", "foreignField" : "DecksArchetypes_id", "as" : "DecksNames"}},
//         {$unwind : "$DecksNames"},
//         {$project : {DecksNames_id : "$DecksNames._id"}},
//         {$lookup : {"from" : "DecksData", "localField" : "DecksNames_id", "foreignField" : "DecksNames_id", "as" : "DecksData"}},
//         {$unwind : "$DecksData"},
//         {$project : {DecksNames_id : "$DecksNames_id", date : "$DecksData.date", victory : "$DecksData.victory", loss : "$DecksData.loss", type : "$DecksData.type"}},
//         {$match : {date : {$gte : startDate, $lte : endDate}, $or : thatOptions}},
//         {$group : {	_id : "$_id", quantity : {$sum : 1}}},
//         {$sort : {quantity : -1}}
//     ]);
//
//     for(var i = 0; i<DecksArchetypesMeta.length; ++i){
//         if(Meta.find({options : options, timeSpan : timeSpan, format : format, "DecksArchetypesMeta._id" : DecksArchetypesMeta[i]._id }).count()){
//             Meta.update(
//                 {options : options, timeSpan : timeSpan, format : format, "DecksArchetypesMeta._id" : DecksArchetypesMeta[i]._id},
//                 {
//                     $set : { "DecksArchetypesMeta.$.quantity" : DecksArchetypesMeta[i].quantity},
//                 }
//             );
//         }else{
//             Meta.update(
//                 {options : options, timeSpan : timeSpan, format : format},
//                 {
//                     $push : { DecksArchetypesMeta : DecksArchetypesMeta[i]},
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
// metaDecksArchetypesMetaBlocks = function(format, timeSpan, startDate, endDate, options, thatOptions){
//     console.log("metaDecksArchetypesMetaBlocks");
//
//     var decksArchetypes = DecksArchetypes.find({format : format}, {fields : {_id : 1}}).fetch();
//
//     var DecksArchetypesMetaBlocks = [];
//     for(var i = 0; i < decksArchetypes.length; ++i){
//         var decksNames_ids = DecksNames.find({DecksArchetypes_id : decksArchetypes[i]._id}, {fields : {_id : 1}}).map(function(obj){
//             return obj._id;
//         });
//
//         var endDateBlocks = new Date(endDate.getTime());
//         var blocks = [];
//         while((startDate < endDateBlocks) && (blocks.length <5)){
//             blocks.push(DecksData.find({date : {$gte : startDate, $lte : endDateBlocks},  DecksNames_id : {$in : decksNames_ids}, $or : thatOptions}).count());
//             endDateBlocks.setDate(endDateBlocks.getDate() - 7);
//         }
//         blocks.reverse();
//         DecksArchetypesMetaBlocks.push({_id : decksArchetypes[i]._id, blocks : blocks});
//     }
//
//
//     for(var i = 0; i < DecksArchetypesMetaBlocks.length; ++i){
//         if(Meta.find({options : options, timeSpan : timeSpan, format : format, "DecksArchetypesMeta._id" : DecksArchetypesMetaBlocks[i]._id }).count()){
//             Meta.update(
//                 {options : options, timeSpan : timeSpan, format : format, "DecksArchetypesMeta._id" : DecksArchetypesMetaBlocks[i]._id},
//                 {
//                     $set : { "DecksArchetypesMeta.$.blocks" : DecksArchetypesMetaBlocks[i].blocks},
//                 }
//             );
//         }else{
//             Meta.update(
//                 {options : options, timeSpan : timeSpan, format : format},
//                 {
//                     $push : { DecksArchetypesMeta : DecksArchetypesMetaBlocks[i]},
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
// metaDecksArchetypesMetaPosition = function(format, timeSpan, startDate, endDate, options, thatOptions){
//     console.log("metaDecksArchetypesMetaPositionChange");
//     var decksArchetypes = DecksArchetypes.find({format : format}, {fields : {_id : 1}}).fetch();
//
//     var DecksArchetypesMeta = DecksArchetypes.aggregate([
//         {$project : {"format" : 1}},
//         {$match : {format : format}},
//         {$lookup : {"from" : "DecksNames", "localField" : "_id", "foreignField" : "DecksArchetypes_id", "as" : "DecksNames"}},
//         {$unwind : "$DecksNames"},
//         {$project : {DecksNames_id : "$DecksNames._id"}},
//         {$lookup : {"from" : "DecksData", "localField" : "DecksNames_id", "foreignField" : "DecksNames_id", "as" : "DecksData"}},
//         {$unwind : "$DecksData"},
//         {$project : {DecksNames_id : "$DecksNames_id", date : "$DecksData.date", victory : "$DecksData.victory", loss : "$DecksData.loss", type : "$DecksData.type"}},
//         {$match : {date : {$gte : startDate, $lte : endDate}, $or : thatOptions}},
//         {$group : {	_id : "$_id", quantity : {$sum : 1}}},
//         {$sort : {quantity : -1}}
//     ]);
//
//     //give Positions
//     var currentQuantity = 9999;
//     var position = 0;
//     DecksArchetypesMeta.forEach(function(DecksArchetypesMetaObj){
//         if(DecksArchetypesMetaObj.quantity < currentQuantity){
//             position++;
//             currentQuantity = DecksArchetypesMetaObj.quantity;
//             DecksArchetypesMetaObj.position = position;
//         }else{
//             DecksArchetypesMetaObj.position = position;
//         }
//     });
//
//     for(var i = 0; i < DecksArchetypesMeta.length; ++i){
//         if(Meta.find({options : options, timeSpan : timeSpan, format : format, "DecksArchetypesMeta._id" : DecksArchetypesMeta[i]._id }).count()){
//             Meta.update(
//                 {options : options, timeSpan : timeSpan, format : format, "DecksArchetypesMeta._id" : DecksArchetypesMeta[i]._id},
//                 {
//                     $set : { "DecksArchetypesMeta.$.position" : DecksArchetypesMeta[i].position},
//                 }
//             );
//         }else{
//             Meta.update(
//                 {options : options, timeSpan : timeSpan, format : format},
//                 {
//                     $push : { DecksArchetypesMeta : DecksArchetypesMeta[i]},
//                 },
//                 {
//                     upsert : true
//                 }
//             );
//         }
//     }
// };
//
// metaDecksArchetypesMetaPositionChange = function(format, timeSpan, startDate, endDate, options, thatOptions){
//     console.log("metaDecksArchetypesMetaPositionChange");
//     var optionsDays = [ {name : "week", days : 7}, {name : "twoWeeks", days : 14},
//         // {name : "month", days : 30}
//     ];
//
//
//     optionsDays.forEach(function(optionsDaysObj){
//         var DecksArchetypesMetaFirstDate  = DecksArchetypes.aggregate([
//             {$project : {"format" : 1}},
//             {$match : {format : format}},
//             {$lookup : {"from" : "DecksNames", "localField" : "_id", "foreignField" : "DecksArchetypes_id", "as" : "DecksNames"}},
//             {$unwind : "$DecksNames"},
//             {$project : {DecksNames_id : "$DecksNames._id"}},
//             {$lookup : {"from" : "DecksData", "localField" : "DecksNames_id", "foreignField" : "DecksNames_id", "as" : "DecksData"}},
//             {$unwind : "$DecksData"},
//             {$project : {DecksNames_id : "$DecksNames_id", date : "$DecksData.date", victory : "$DecksData.victory", loss : "$DecksData.loss", type : "$DecksData.type"}},
//             {$match : {date : {$gte : startDate, $lte : endDate}, $or : thatOptions}},
//             {$group : {	_id : "$_id", quantity : {$sum : 1}}},
//             {$sort : {quantity : -1}}
//         ]);
//
//         //old date query
//         var endDateBeforeDate = new Date(endDate.getTime());
//         endDateBeforeDate.setDate(endDateBeforeDate.getDate() - optionsDaysObj.days);
//
//         var DecksArchetypesMetaBeforeDate = DecksArchetypes.aggregate([
//             {$project : {"format" : 1}},
//             {$match : {format : format}},
//             {$lookup : {"from" : "DecksNames", "localField" : "_id", "foreignField" : "DecksArchetypes_id", "as" : "DecksNames"}},
//             {$unwind : "$DecksNames"},
//             {$project : {DecksNames_id : "$DecksNames._id"}},
//             {$lookup : {"from" : "DecksData", "localField" : "DecksNames_id", "foreignField" : "DecksNames_id", "as" : "DecksData"}},
//             {$unwind : "$DecksData"},
//             {$project : {DecksNames_id : "$DecksNames_id", date : "$DecksData.date", victory : "$DecksData.victory", loss : "$DecksData.loss", type : "$DecksData.type"}},
//             {$match : {date : {$gte : startDate, $lte : endDateBeforeDate}, $or : thatOptions}},
//             {$group : {	_id : "$_id", quantity : {$sum : 1}}},
//             {$sort : {quantity : -1}}
//         ]);
//
//         //give Positions
//         var currentQuantity = 9999;
//         var position = 0;
//         DecksArchetypesMetaFirstDate.forEach(function(DecksArchetypesMetaFirstDateObj){
//             if(DecksArchetypesMetaFirstDateObj.quantity < currentQuantity){
//                 position++;
//                 currentQuantity = DecksArchetypesMetaFirstDateObj.quantity;
//                 DecksArchetypesMetaFirstDateObj.position = position;
//             }else{
//                 DecksArchetypesMetaFirstDateObj.position = position;
//             }
//         });
//
//         currentQuantity = 9999;
//         position = 0;
//         DecksArchetypesMetaBeforeDate.forEach(function(DecksArchetypesMetaBeforeDateObj){
//             if(DecksArchetypesMetaBeforeDateObj.quantity < currentQuantity){
//                 position++;
//                 currentQuantity = DecksArchetypesMetaBeforeDateObj.quantity;
//                 DecksArchetypesMetaBeforeDateObj.position = position;
//             }else{
//                 DecksArchetypesMetaBeforeDateObj.position = position;
//             }
//         });
//
//         var DecksArchetypesPositionChange = [];
//
//         DecksArchetypesMetaFirstDate.forEach(function(DecksArchetypesMetaFirstDateObj){
//             var DecksArchetypesMetaBeforeDateQuery = DecksArchetypesMetaBeforeDate.find(function(DecksNamesMetaBeforeDateObj){
//                 return DecksNamesMetaBeforeDateObj._id == DecksArchetypesMetaFirstDateObj._id;
//             });
//             if(DecksArchetypesMetaBeforeDateQuery){
//                 var change = DecksArchetypesMetaBeforeDateQuery.position - DecksArchetypesMetaFirstDateObj.position;
//             }else{
//                 var change = 999;
//             }
//             DecksArchetypesPositionChange.push({_id : DecksArchetypesMetaFirstDateObj._id, change : change});
//         });
//
//         for(var i = 0; i < DecksArchetypesPositionChange.length; ++i){
//             if(Meta.find({options : options, timeSpan : timeSpan, format : format, "DecksArchetypesMeta._id" : DecksArchetypesPositionChange[i]._id }).count()){
//                 var setUpdate = {};
//                 setUpdate["DecksArchetypesMeta.$.positions."+ optionsDaysObj.name] = DecksArchetypesPositionChange[i].change;
//                 Meta.update(
//                     {options : options, timeSpan : timeSpan, format : format, "DecksArchetypesMeta._id" : DecksArchetypesPositionChange[i]._id},
//                     {
//                         $set : setUpdate,
//                     }
//                 );
//             }else{
//                 var setPush = {_id : DecksArchetypesPositionChange[i]._id};
//                 setPush.positions = {};
//                 setPush.positions[optionsDaysObj.name] = DecksArchetypesPositionChange[i].change;
//                 Meta.update(
//                     {options : options, timeSpan : timeSpan, format : format},
//                     {
//                         $push : { DecksArchetypesMeta : setPush},
//                     },
//                     {
//                         upsert : true
//                     }
//                 );
//             }
//         }
//
//     });
// };
//
// metaTotalDecksBlocks = function(format, timeSpan, startDate, endDate, options, thatOptions){
//     console.log("creating Total Blocks");
//     var totalDecksBlocks = [];
//     var endDateBlock = new Date(endDate.getTime());
//
//     while((startDate < endDateBlock) && (totalDecksBlocks.length <5)){
//         totalDecksBlocks.push(DecksData.find({date : {$gte : startDate, $lte : endDateBlock}, $or : thatOptions}).count());
//         endDateBlock.setDate(endDateBlock.getDate() - 7);
//     }
//     totalDecksBlocks.reverse();
//
//     Meta.update(
//         {options : options, timeSpan : timeSpan, format : format},
//         {
//             $set : {totalDecksBlocks : totalDecksBlocks},
//         },
//         {
//             upsert : true
//         }
//     );
// }
//
// function combinations(str) {
//     var fn = function(active, rest, a) {
//         if (!active && !rest)
//             return;
//         if (!rest) {
//             a.push(active);
//         } else {
//             fn(active + rest[0], rest.slice(1), a);
//             fn(active, rest.slice(1), a);
//         }
//         return a;
//     }
//     return fn("", str, []);
// }
//
//
// permutationAndCombination = function(a) {
//     var fn = function(n, src, got, all) {
//         if (n == 0) {
//             if (got.length > 0) {
//                 all[all.length] = got;
//             }
//             return;
//         }
//         for (var j = 0; j < src.length; j++) {
//             fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
//         }
//         return;
//     }
//     var all = [];
//     for (var i=0; i < a.length; i++) {
//         fn(i, a, [], all);
//     }
//     all.push(a);
//     return all;
// };
//
//
// optionsTypeQuery = {
//     "league5_0": {victory: 5, loss: 0, type: "league"},
//     "daily4_0": {victory: 4, loss: 0, type: "daily"},
//     "daily3_1": {victory: 3, loss: 1, type: "daily"},
//     "ptqTop8": {position: {$gte: 1, $lte: 8}, type: "ptq"},
//     "ptqTop9_16": {position: {$gte: 9, $lte: 16}, type: "ptq"},
//     "ptqTop17_32": {position: {$gte: 17, $lte: 32}, type: "ptq"}
// }
//
// optionsTimeSpanQuery = {
//     "month" : 30,
//     "twoMonths" : 60,
//     "sixMonths" : 180
// }
//
//
//
//
// // var league = {type : "league", options : { victory : 5, loss : 0, type : "league"}};
// // var daily3_1 = {type : "daily3_1", options : { victory : 3, loss : 1, type : "daily"}};
// // var daily4_0 = {type : "daily4_0", options : { victory : 4, loss : 0, type : "daily"}};
// // var ptqTop8 = {type : "ptqTop8", options : { position : {$gte : 1, $lte : 8}, type : "ptq"}};
// // var ptqTop9_16 = {type : "ptqTop9_16", options : { position : {$gte : 9, $lte : 16}, type : "ptq"}};
// // var ptqTop17_32 = {type : "ptqTop17_32", options : { position : {$gte : 17, $lte : 32}, type : "ptq"}};