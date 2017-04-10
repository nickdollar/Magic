
Meteor.publish('DecksDataBy_id', function(DecksData_id) {
    return DecksData.find({_id : DecksData_id});
});

Meteor.publish('DecksDataBy_id_NonReactive', function(DecksData_id) {
    return DecksData.find({_id : DecksData_id});
});

Meteor.publish('DecksDataFromEvent_idSimplified', function(Events_id) {
    return DecksData.find({Events_id : Events_id}, {sort : {position : 1}, fields : {main : 0, sideboard : 0}});
});

Meteor.publish('DecksDataPLayerList_FromEvents', function(Events_id) {
    return DecksData.find({Events_id : Events_id}, {sort : {position : 1, victory : 1}, fields : {main : 0, sideboard : 0}});
});

Meteor.publish('DecksDataDecksData_idOrEvents_id', function(DecksData_id, Events_id) {
    if(DecksData_id){
        return DecksData.find({_id : DecksData_id});
    }else{
        return DecksData.find({Events_id : Events_id}, {$sort : {position : 1, victory : 1}, limit : 1});
    }
});


Meteor.publish("DecksData", function(){
    return DecksData.find({});
});

Meteor.publishComposite('DecksDataCardsDataByDecksdata_id', function(DecksData_id){
    return {
        find : function() {
            return DecksData.find({_id : DecksData_id});
        },
        children : [
            {
                find : function(DeckData){
                    var main = DeckData.main.map(function(obj){
                        return obj.name;
                    });
                    var sideboard = DeckData.sideboard.map(function(obj){
                        return obj.name;
                    });
                    var allCards = arrayUnique(main.concat(sideboard));
                    return CardsData.find({name: {$in : allCards}});
                }
            }
        ]
    }
});

Meteor.publish('DecksDataByDecksNames_idSimple', function(DecksNames_id){
    if(!DecksNames_id){
        return;
    }
    return DecksData.find({DecksNames_id : DecksNames_id}, {fields : {DecksNames_id : 1, state : 1}});

});

function arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }
    return a;
}
