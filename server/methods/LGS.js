Meteor.methods({
    addLGS(data){

        console.log(data.location.formatedAddress);
        console.log(LGS.find({$or : [{"location.formatedAddress" : data.location.formatedAddress}]}).count());


        if(LGS.find({$or : [{"location.formatedAddress" : data.location.formatedAddress}]}).count()){
            console.log("LGS on that Address Already Exists");
            return "LGS on that Address Already Exists";
        }
        console.log("XXXXXXXXXXXXX");

        LGS.update({data},{
            $set : data
        },
            {upsert : true}
        )
        return true;
    }
})

