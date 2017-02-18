Meteor.methods({
    addLGS(data){
        if(LGS.find({$or : [{"location.formatedAddress" : data.location.formatedAddress}]}).count()){
            return "LGS on that Address Already Exists";
        }

        data.state = "pending";

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
    }
});