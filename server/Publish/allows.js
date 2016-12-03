DecksNames.allow({
    update : function(userId, doc, fields, modifier){
        if(Roles.userIsInRole(userId, ['admin'])){
            return true;
        };
        return false;
    },
    insert : function(userId, doc, fields, modifier){
        if(Roles.userIsInRole(userId, ['admin'])){
            return true;
        };
        return false;
    }
});


DecksArchetypes.allow({
    update : function(){
        if(Roles.userIsInRole(userId, ['admin'])){
            return true;
        };
        return false;
    },
    insert : function(userId, doc, fields, modifier){
        if(Roles.userIsInRole(userId, ['admin'])){
            return true;
        };
        return false;
    }
})

DecksData.allow({
    update : function(_id){
        if(Roles.userIsInRole(userId, ['admin'])){
            return true;
        };
        return false;
    },
    insert : function(userId, doc, fields, modifier){
        if(Roles.userIsInRole(userId, ['admin'])){
            return true;
        };
        return false;
    }
})

Events.allow({
    update : function(_id){
        if(Roles.userIsInRole(userId, ['admin'])){
            return true;
        };
        return false;
    },
    insert : function(userId, doc, fields, modifier){
        if(Roles.userIsInRole(userId, ['admin'])){
            return true;
        };
        return false;
    }
});

Images.allow({
    'insert': function () {
        // add custom authentication code here
        return true;
    },
    download: function(userId, fileObj) {
        return true
    },
    update: function () {
        return true;
    },
    remove: function () {
        return true;
    }
});

