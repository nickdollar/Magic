
weeklyArchetypeChange = function(){
    var options = {types : ["daily4_0", "daily3_1", "ptqTop8", "ptqTop9_16", "ptqTop17_32"], dates : ["twoWeeks", "sixWeeks", "year"]},
        typesCombinations = positionCombinationsOptions(options.types),
        dates = getDateSyntax(options.dates),
        archetypes = _deckArchetypes.find({format : "modern"}).fetch();


    dates.forEach(function(date){
        typesCombinations.forEach(function(typeCombination){

                var allDecksQuery = _Deck.find({format : "modern", $or : typeCombination.values, date : {$gte : date.date }}).fetch();
                if(allDecksQuery.length == 0) return;
                var archetypesValues = [];
                archetypes.forEach(function(archetype){
                    var deckNames = archetype.deckNames.map(function(obj){
                        return obj.name;
                    });
                    var deckQuery = _Deck.find({name : {$in : deckNames}, format : "modern", $or : typeCombination.values, date : {$gte : date.date }}).fetch();
                    if(deckQuery.length == 0) return;
                    archetypesValues.push({name : archetype.archetype, deckNames : deckNames, percentageBonita : prettifyPercentage(deckQuery.length/allDecksQuery.length, 2), percentage : deckQuery.length/allDecksQuery.length, quantity : deckQuery.length});
                });

                optionPosition(archetypesValues);
                weeklyArchetypeBlockChange(archetypesValues, date, typeCombination);
                weeklyArchetypeBlockAdding(archetypesValues, date, typeCombination);
                weeklyArchetypePositionChange(archetypesValues, date, typeCombination);
                weeklyArchetypePositionChangeAdding(archetypesValues, date, typeCombination);



            _temp.insert({value : archetypesValues});
            archetypesValues.forEach(function(archetype){
                    var baseValues = {option: "archetype", date : date.type, name : archetype.name, type : typeCombination.toString, format : "modern"};
                    var newValues = {option: "archetype",  date : date.type, name : archetype.name, type : typeCombination.toString, format : "modern"};

                    for(var key in archetype){
                        newValues[key] = archetype[key];
                    }

                    _MetaValues.update(baseValues,
                        {
                            $set: archetype,
                            $setOnInsert: newValues
                        },
                        {
                            upsert: true
                        }
                    );
                });
        });
    });
};




weeklyArchetypePositionChangeAdding = function(archetypesValues, date, typeCombination){

    var weekDateEnd = new Date(Date.UTC(2015, 11, 12, 23, 59, 59, 999));
    var dateStart = new Date((weekDateEnd.getTime()  + 1) - (86400000 * 7 *  (date.weeks + 1))),
        dateEnd = new Date((dateStart.getTime()  - 1) + (86400000 * 7));

    for(var i = 0; i < date.weeks; i++) {

        var archetypeResults = [];
        archetypesValues.forEach(function(ArchetypeObj){
            var result = 0;
            var allDecksQuery = _Deck.find({format: "modern", $or: typeCombination.values, date: {$gte: dateStart, $lte: dateEnd}}).fetch();
            var deckQuery = _Deck.find({name: {$in : ArchetypeObj.deckNames}, format: "modern", $or: typeCombination.values, date: {$gte: dateStart, $lte: dateEnd}}).fetch();
            if (allDecksQuery.length != 0){
                result = deckQuery.length/allDecksQuery.length;
            }
            archetypeResults.push({name : ArchetypeObj.name, percentage : result});
        });


        archetypeResults.sort(function(a, b){
            return b.percentage - a.percentage;
        });

        var position = 0;
        var base_value = 9999;
        archetypeResults.forEach(function(archetypeResultObj){
            if(archetypeResultObj.percentage == base_value){
                archetypeResultObj.position = position;
            }else if(archetypeResultObj.percentage < base_value){
                position++;
                base_value = archetypeResultObj.percentage;
                archetypeResultObj.position = position;
            }
            var archetype = archetypesValues.find(function(archetypeValueObj){
                return archetypeResultObj.name == archetypeValueObj.name;
            });

            if(typeof archetype.weeklyPositionAdding === "undefined"){
                archetype.weeklyPositionAdding = [];
            };
            archetype.weeklyPositionAdding.push(archetypeResultObj.position);
        });
        dateEnd = new Date(dateEnd.getTime() + (86400000 * 7));
    }

    archetypesValues.forEach(function(archetypeValueObj){
        var lastWeekPosition = 1;

        var positionUpDownEqualAdding = [];
        var positionWeekChangeAdding = [];
        archetypeValueObj.weeklyPositionAdding.forEach(function(archetypeResultObjObj){
            var upDownEqual = "";
            if(archetypeResultObjObj > lastWeekPosition){
                upDownEqual = "arrowUp";
            }else if(archetypeResultObjObj < lastWeekPosition){
                upDownEqual = "arrowDown";
            }else{
                upDownEqual = "square";
            }

            var weekChange = archetypeResultObjObj - lastWeekPosition;
            lastWeekPosition = archetypeResultObjObj;
            position = archetypeResultObjObj;

            positionUpDownEqualAdding.push(upDownEqual);
            positionWeekChangeAdding.push(weekChange);
        });

        archetypeValueObj.positionUpDownEqualAdding = positionUpDownEqualAdding;
        archetypeValueObj.positionWeekChangeAdding = positionWeekChangeAdding;
    });

};



weeklyArchetypePositionChange = function(archetypesValues, date, typeCombination){

        var weeksQuantity = 10;
        var weekDateEnd = new Date(Date.UTC(2015, 11, 12, 23, 59, 59, 999));
        var weekDateStart = new Date((weekDateEnd.getTime()  + 1) - (86400000 * 7));

        for(var i = 0; i < weeksQuantity; i++) {
            var archetypeResults = [];
            archetypesValues.forEach(function(ArchetypeObj){
                var result = 0;
                var allDecksQuery = _Deck.find({format: "modern", $or: typeCombination.values, date: {$gte: weekDateStart, $lte: weekDateEnd}}).fetch();
                var archetypeQuery = _Deck.find({name: {$in : ArchetypeObj.deckNames}, format: "modern", $or: typeCombination.values, date: {$gte: weekDateStart, $lte: weekDateEnd}}).fetch();
                if (allDecksQuery.length != 0){
                    result = archetypeQuery.length/allDecksQuery.length;
                }
                archetypeResults.push({name : ArchetypeObj.name, percentage : result});
            });

            archetypeResults.sort(function(a, b){
                return b.percentage - a.percentage;
            });

            var position = 0;
            var base_value = 9999;
            archetypeResults.forEach(function(archetypeResultObj){
                if(archetypeResultObj.percentage == base_value){
                    archetypeResultObj.position = position;
                }else if(archetypeResultObj.percentage < base_value){
                    position++;
                    base_value = archetypeResultObj.percentage;
                    archetypeResultObj.position = position;
                }

                var archetype = archetypesValues.find(function(archetypeValuesObj){
                    return archetypeResultObj.name == archetypeValuesObj.name;
                });

                if(typeof archetype.weeklyPosition === "undefined"){ archetype.weeklyPosition = []; };
                archetype.weeklyPosition.push(archetypeResultObj.position);
            });
            weekDateStart = new Date(weekDateStart.getTime() + (86400000 * 7));
            weekDateEnd = new Date(weekDateEnd.getTime() + (86400000 * 7));
        }


        archetypesValues.forEach(function(archetypeValueObj){
            var lastWeekPosition = 1;

            var positionUpDownEqual = [];
            var positionWeekChange = [];
            archetypeValueObj.weeklyPosition.forEach(function(archetypeResultObjObj){
                var upDownEqual = "";
                if(archetypeResultObjObj > lastWeekPosition){
                    upDownEqual = "arrowUp";
                }else if(archetypeResultObjObj < lastWeekPosition){
                    upDownEqual = "arrowDown";
                }else{
                    upDownEqual = "square";
                }

                var weekChange = archetypeResultObjObj - lastWeekPosition;
                lastWeekPosition = archetypeResultObjObj;
                position = archetypeResultObjObj;

                positionUpDownEqual.push(upDownEqual);
                positionWeekChange.push(weekChange);
            });

            archetypeValueObj.positionUpDownEqual = positionUpDownEqual;
            archetypeValueObj.positionWeekChange = positionWeekChange;
        });

};


weeklyArchetypeBlockAdding = function(archetypesValues, date, typeCombination){
    archetypesValues.forEach(function(archetype){
        var weekAddPercentage = [],
            weekAddQuantity = [],
            weekAddChange = [],
            weekAddNegPosChange = [];

        var weekDateEnd = new Date(Date.UTC(2015, 11, 12, 23, 59, 59, 999));
        var dateStart = new Date((weekDateEnd.getTime()  + 1) - (86400000 * 7 *  (date.weeks + 1))),
            dateEnd = new Date((dateStart.getTime()  - 1) + (86400000 * 7));

        var lastWeekValue = 0;
        for(var i = 0; i < date.weeks; i++) {
            var position = "";
            var change = 0;
            var result = 0;

            var allDecksQuery = _Deck.find({format: "modern", $or: typeCombination.values, date: {$gte: dateStart, $lte: dateEnd}}).fetch();
            var deckQuery = _Deck.find({name: {$in : archetype.deckNames}, format: "modern", $or: typeCombination.values, date: {$gte: dateStart, $lte: dateEnd}}).fetch();

            if (allDecksQuery.length != 0){
                result = deckQuery.length/allDecksQuery.length;
            }

            if(result > lastWeekValue){
                position = "up";
                change = result - lastWeekValue;
            }else if(result < lastWeekValue){
                change = result - lastWeekValue;
                position = "down";
            }else{
                position = "equal";
            }
            change = result - lastWeekValue;
            lastWeekValue = result;

            weekAddChange.push(position);
            weekAddNegPosChange.push(change);
            weekAddPercentage.push(result);
            weekAddQuantity.push(deckQuery.length);
            dateEnd = new Date(dateEnd.getTime() + (86400000 * 7));
        }
        archetype.weekAddPercentage = weekAddPercentage;
        archetype.weekAddQuantity = weekAddQuantity;
        archetype.weekAddChange = weekAddChange;
        archetype.weekAddNegPosChange = weekAddNegPosChange;
    });
};

weeklyArchetypeBlockChange = function(archetypesValues, date, typeCombination){

    var weeksQuantity = 10;
    archetypesValues.forEach(function(archetype){
        var weekDataPercentage = [],
            weekDataQuantity = [],
            weekChange = [],
            weekNegPosChange = [],
            weekDateEnd = new Date(Date.UTC(2015, 11, 12, 23, 59, 59, 999)),
            weekDateStart = new Date((weekDateEnd.getTime()  + 1) - (86400000 * 7));

        var lastWeekValue = 0;
        for(var i = 0; i < weeksQuantity; i++) {
            var position = "";
            var change = 0;
            var result = 0;
            var allDecksQuery = _Deck.find({format: "modern", $or: typeCombination.values, date: {$gte: weekDateStart, $lte: weekDateEnd}}).fetch();
            var deckQuery = _Deck.find({name: {$in : archetype.deckNames}, format: "modern", $or: typeCombination.values, date: {$gte: weekDateStart, $lte: weekDateEnd}}).fetch();
            if (allDecksQuery.length != 0){
                result = deckQuery.length/allDecksQuery.length;
            }

            if(result > lastWeekValue){
                position = "up";
            }else if(result < lastWeekValue){
                position = "down";
            }else{
                position = "equal";
            }
            change = result - lastWeekValue;
            lastWeekValue = result;

            weekDataPercentage.push(result);
            weekDataQuantity.push(deckQuery.length);
            weekChange.push(position);
            weekNegPosChange.push(change);

            weekDateStart = new Date(weekDateStart.getTime() + (86400000 * 7));
            weekDateEnd = new Date(weekDateEnd.getTime() + (86400000 * 7));
        }

        archetype.weekDataPercentage = weekDataPercentage;
        archetype.weekDataQuantity = weekDataQuantity;
        archetype.weekChange = weekChange;
        archetype.weekNegPosChange = weekNegPosChange;
    });

};

//weeklyArchetypeBlockChange
//  weekDataPercentage                  [0,0,0,0,0,0,0]
//  weekDataQuantity                    [0,0,0,0,0,0,0]
//  weekChange                          [equal, equal, equal, equal]
//  weekNegPosChange                    [0.15,-0.15,0,0]
//
//weeklyArchetypeBlockAdding
//  weekAddPercentage                   [0.0789473684210526,0.0853658536585366,0.062992125984252]
//  weekAddQuantity                     [3,7,8,11,17,21]
//  weekAddChange                       ["arrowUp","arrowUp","arrowDown","arrowUp","arrowUp","arrowUp"]
//  weekAddNegPosChange                 [0.0789473684210526,0.00641848523748396,-0.0223737276742846,0.00209663141219774]
//
//weeklyArchetypePositionChange
//  weeklyPosition                      [1,1,1,1,1]
//  positionUpDownEqual                 ["square","square","square","square"]
//  positionWeekChange                  [0,0,0,0,0]
//
//weeklyArchetypePositionChangeAdding
//  weeklyPositionAdding                [1,1,1,1,1]
//  positionUpDownEqualAdding           ["equal","equal","equal","equal"]
//  positionWeekChangeAdding            [0,0,0,0]
