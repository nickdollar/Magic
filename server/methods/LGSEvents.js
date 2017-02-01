Meteor.methods({
    addLGSEvents(data){
        Object.assign(data, {state : "created"});

        LGSEvents.update(data,{
            $set : data
        },
            {upsert : true}
        )
        return true;
    },
    stateConfirmLGSEvents(_ids){
        console.log(_ids);
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

