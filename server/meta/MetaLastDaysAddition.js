Meteor.methods({
    getMetaLastDaysAddiction(){
        return MetaLastAddition.findOne();
    },
    createMetaLastDaysAdditionFormatsMethod(){
        createMetaLastDaysAdditionFormats();
    }
})

createMetaLastDaysAdditionFormats = ()=>{
    logFunctionsStart("createMetaNewThingsDaysAllFormats");
        var metaNewThingsObj = {};
        metaNewThingsObj.newestDecks = createMetaNewDecksLatestDaysAllFormats(14);
        metaNewThingsObj.newestArchetypes = createMetaArchetypesDecksLatestDaysAllFormats(14);
        metaNewThingsObj.newestCards = createMetaNewCardsLatestDaysAllFormats(14);

        MetaLastAddition.update({},
            {$set : {metaNewThingsObj }},
            {upsert : true}
        );
    logFunctionsEnd("createMetaNewThingsDaysAllFormats");
}