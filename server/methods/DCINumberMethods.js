Meteor.methods({
    ChangeUsersDCINumber({DCINumber}){
        DCINumbers.update({_id : Meteor.userId()},
            {
                $set : {DCINumber : DCINumber}
            })
    }
})