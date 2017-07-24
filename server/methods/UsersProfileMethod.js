Meteor.methods({
    setUsersProfileDCINumberMethod({DCINumber}){
        UsersProfile.update({_id : Meteor.userId()},
            {
                $set : {DCINumber : DCINumber}
            },
            {
                upsert : true
            }
        )
    },
    setPreferredNameMethod({preferredName}){
        UsersProfile.update({_id : Meteor.userId()},
            {
                $set : {preferredName : preferredName}
            },
            {
                upsert : true
            }
        )
    },
    setNameMethod({name}){
        UsersProfile.update({_id : Meteor.userId()},
            {
                $set : {name : name}
            },
            {
                upsert : true
            }
        )
    }
})