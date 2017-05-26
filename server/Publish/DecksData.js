
Meteor.publish('DecksDataBy_id', function(DecksData_id) {
    return DecksData.find({_id : DecksData_id});
});

Meteor.publish('DecksDataBy_id_NonReactive', function(DecksData_id) {
    return DecksData.find({_id : DecksData_id});
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

Meteor.publishComposite('DecksCardsByDecksdata_id', function(DecksData_id){
    return {
        find : function() {
            return DecksData.find({_id : DecksData_id});
        },
        children : [
            {
                find : function(DeckData){
                    var main = DeckData.main.map(function(obj){return obj.name;});
                    var sideboard = DeckData.sideboard.map(function(obj){return obj.name;});
                    var allCards = arrayUnique(main.concat(sideboard));
                    return Cards.find({_id: {$in : allCards}});
                }
            }
        ]
    }
});

