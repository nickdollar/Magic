import Entities from "entities";

fixHtmlFromCherrios = (string)=>{
    if(!string) return string;

    string = Entities.decodeHTML(string);
    string = string.trim()
    return string;
}

databaseFixes = (string)=>{
    logFunctionsStart("databaseFixes");
    Formats.find().forEach(format=>{
        DecksNames.update({format : {$regex : format.name, $options : "i"}},
            {
                $set : {Formats_id : format._id},
                $unset : {format : ""}
            },
            {
                multi : true
            })
    });

    Formats.find().forEach(format=>{
        DecksArchetypes.update({format : {$regex : format.name, $options : "i"}},
            {
                $set : {Formats_id : format._id},
                $unset : {format : ""}
            },
            {
                multi : true
            })
    });

    DecksArchetypes.find({}).map(deckArchetype => {
        DecksArchetypes.update({_id : deckArchetype._id},
            {
                $set : { link: deckArchetype.name.replace(/[^a-zA-Z0-9-_]/g, '')},
            },
            {
                multi : true
            }
        )
    });


    Formats.find().forEach(format=>{
        DecksDataUniqueWithoutQty.update({format : {$regex : format.name, $options : "i"}},
            {
                $set : {Formats_id : format._id},
                $unset : {format : ""}
            },
            {
                multi : true
            })
    });

    DecksNames.update({Formats_id : "std"},
        {
            $set : {Formats_id : "sta"},
        },
        {
            multi : true
        })

    DecksArchetypes.update({Formats_id : "std"},
        {
            $set : {Formats_id : "sta"},
        },
        {
            multi : true
        })

    DecksNames.find({}).map(deckName => {
        DecksNames.update({_id : deckName._id},
            {
                $set : { link: deckName.name.replace(/[^a-zA-Z0-9-_]/g, '')},
            },
            {
                multi : true
            }
        )
    });

    logFunctionsEnd("databaseFixes");
}