Meteor.methods({
    getMetaNewest(){
         return MetaNewest.findOne({type : "lastDays"});
    },
    createMetaNewThingsDaysAllFormatsMethod(){
        console.log("AAAAAAAAAAA");
        createMetaNewThingsDaysAllFormats();
    }
})