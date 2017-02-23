Meteor.methods({
    addLGSEvents(data){

        var state;
        if(Roles.userIsInRole(this.userId, ['admin'])){
            state = "confirmed";
        }else{
            state = "created";
        }

        Object.assign(data, {state : state});
        LGSEvents.update(data,{
            $set : data
        },
            {upsert : true}
        )
        return true;
    },
    stateConfirmLGSEvents(_ids){
        LGSEvents.update({_id : {$in : _ids}},
            {
                $set : {state : "confirmed"}
            },
            {
                multi : true
            }
        )
    },
    removeConfirmLGSEvents(_ids){
        LGSEvents.remove({_id : {$in : _ids}})
    }
})