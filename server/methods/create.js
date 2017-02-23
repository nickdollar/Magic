Meteor.methods({
    //CREATE NEW
    createNewDecksArchetype: function (form) {
        var queryCheck = DecksArchetypes.find({format: form.format, name: {$regex: new RegExp("^" + form.name + "$", 'i')}});

        if (queryCheck.count()) {
            return false;
        }
        form.name = deckNameAndArchetype(form.name);
        DecksArchetypes.insert(form);
    },
    createNewDecksNames : function(form){
        var queryCheck = DecksNames.find({format : form.format, name : {$regex : new RegExp(form.name, 'i')}});

        if(queryCheck.count()){
            return false;
        }
        form.name = deckNameAndArchetype(form.name);

        DecksNames.insert(form);
    },

})

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}