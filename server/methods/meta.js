Meteor.methods({

    MethodCreateMeta : function(format){
        createMeta(format);
    },
    //META
    updateMetaCards: function (format) {
        createDeckCardsMeta(format);
    },
    createMetaNewThingsDaysAllFormats : function(){
        createMetaNewThingsDaysAllFormats();
    },
    createMetaNewest: function (format) {
        createMetaNewThings(format);
    }
})

