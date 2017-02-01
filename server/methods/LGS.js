Meteor.methods({
    addLGS(data){
        if(LGS.find({$or : [{"location.formatedAddress" : data.location.formatedAddress}]}).count()){
            return "LGS on that Address Already Exists";
        }
        data.state = "created";

        LGS.update(data,{
            $set : data
        },
            {upsert : true}
        )
        return true;
    }
});