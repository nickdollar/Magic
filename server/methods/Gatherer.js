import csvtojson from 'csvtojson';

Meteor.methods({
    updateGathererMethod(){
        console.log("START: updateGathererMethod");

        csvtojson({
            delimiter : "||"
        })
            .fromFile(Assets.absoluteFilePath("gatherer.csv"))
            .on('json', Meteor.bindEnvironment((csvRow)=>{
                    Gatherer.update({_id : csvRow.id},
                        {
                            $set : csvRow
                        },
                        {
                            upsert : true
                        });
            }))
            .on('done',(error)=>{
                console.log("END: updateGathererMethod");
            }).on('error',(err)=>{
            console.log(err)
        })
    },
    getGathererSetsMethod(){
        var gatheredSets = Gatherer.aggregate(
            [
                {
                    $group: {_id : "$set"}
                },
                {
                    $sort : {_id : 1}
                }
            ]
        );
        return gatheredSets;
    },
    getGathererSetsMethod(){
        var gatheredSets = Gatherer.aggregate(
            [
                {
                    $group: {_id : "$set"}
                },
                {
                    $sort : {_id : 1}
                }
            ]
        );
        return gatheredSets;
    }
})