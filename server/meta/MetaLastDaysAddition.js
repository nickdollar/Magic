Meteor.methods({
    getMetaLastDaysAddiction(){
        return MetaLastAddition.findOne();
    },
    createMetaLastDaysAdditionFormatsMethod(){
        createMetaLastDaysAdditionFormats();
    }
})

