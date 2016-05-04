Template.cardsPercentageMain.helpers({
    weekDates : function(){
        var date = getWeekStartAndEnd();
        var weekQuantity = 6;
        var week = 7;
        var oldDate = new Date(date.weekStart);
        var newDate = new Date(date.weekEnd);
        oldDate.setDate(oldDate.getDate() - week*(weekQuantity-1));
        newDate.setDate(newDate.getDate() - week*(weekQuantity-1));
        var dates = [];
        for(var i = 0; i< weekQuantity ;i++){
            dates.push(oldDate.getMonth()+1 + "/" + oldDate.getDate());
            oldDate.setDate(oldDate.getDate() + 6);
            newDate.setDate(oldDate.getDate() + 6);
        }
        return dates;
    },
    cards : function(){
        return _deckCardsWeekChange.find({format : Router.current().params.format,
            deckName: Router.current().params.deckSelected.replace(/-/," "),
            land : false, sideboard : false}, {sort : {weekTotal : -1}});
    },
    cardWeek : function(cardName){
        var date = getWeekStartAndEnd();
        var weekQuantity = 6;
        var week = 7;
        var oldDate = new Date(date.weekStart);
        oldDate.setDate(oldDate.getDate() - week*(weekQuantity-1));

        var values = [];

        createAFunctionForGradient();

        var oldValue = 0;
        var oldColor = "";
        for(var i = 0; i< weekQuantity ;i++){
            var newValue = 0;

            if(_deckCardsWeekChange.find({name : cardName, date :  oldDate}, {limit : 1}).count() == 0){
                newValue = 0;
            }else{
                newValue = _deckCardsWeekChange.findOne({name : cardName, date : oldDate}).quantity;
            }

            var newColor = "";
            if(oldValue > newValue){
                newColor = getColorForPercentageNegative(newValue/4);
            }else if (oldValue < newValue){
                newColor = getColorForPercentagePositive(newValue/4);
            }else{
                newColor = oldColor;
            }
            oldValue = newValue;
            oldColor = newColor;

            values.push({value : newValue, color : newColor});

            oldDate.setDate(oldDate.getDate() + week);
        }
        return values;
    }
});