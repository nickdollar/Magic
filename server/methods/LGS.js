Meteor.methods({
    addLGS(data){
        if(LGS.find({$or : [{"location.formatedAddress" : data.location.formatedAddress}]}).count()){
            return "LGS on that Address Already Exists";
        }

        var state;
        if(Roles.userIsInRole(this.userId, ['admin'])){
            state = "confirmed";
        }else{
            state = "pending";
        }

        Object.assign(data, {state : state});
        LGS.update(data,{
            $set : data
        },
            {upsert : true}
        )
        return true;
    },
    stateConfirmLGS(_ids){
        LGS.update({_id : {$in : _ids}},
            {
                $set : {state : "confirmed"}
            },
            {
                multi : true
            }
        )
    },
    removeLGS(_ids){
        LGSEvents.remove({_id : {$in : _ids}})
    },
    autoPublish(){

    },
    getLGSStateQty(){
        var EventsAggregate = LGS.aggregate([{$group: {_id : "$state", qty : {$sum : 1}}}]);
        return EventsAggregate;
    }
});