Meteor.methods({
    addLGSEvents(data){
        console.log(data)
        LGSEvents.update(data,{
            $set : data
        },
            {upsert : true}
        )
        return true;
    }
})

