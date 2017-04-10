Meteor.methods({
    //CREATE NEW
    fixDecksNamesColorsAbbreviation: function () {
        logFunctionsStart("" + fixDecksNamesColorsAbbreviation);
        
        DecksNames.find({}).forEach(function(obj){
            var name = deckNameAndArchetypeFix(obj.name);
            DecksNames.update({_id : obj._id}, {$set : {name : name}});
        })

        logFunctionsEnd("" + fixDecksNamesColorsAbbreviation);

    },
    addDeckName(data){
        data.name = data.name.toTitleCase();
        DecksNames.update(data,
            {$set : data},
            {upsert : true}
        );
        return true;
    },
    removeDeckName(DecksNames_id){
        if(Roles.userIsInRole(Meteor.user(), ['admin'])){
            DecksData.update({DecksNames_id : DecksNames_id},
                {
                    $set : {state : "nameRemoved"},
                    $unset : {DecksNames_id : ""}
                },
                {
                    multi : true
                }
            )
            DecksDataUniqueWithoutQuantity.remove({DecksNames_id : DecksNames_id});
            DecksNames.remove({_id : DecksNames_id});
        };
    },
    updateDeckName(form){
        if(Roles.userIsInRole(Meteor.user(), ['admin'])){

            DecksNames.update(  {_id : form._id},
                                {
                                    $set : form
                                }
                              )
        };
    },
    createDecksNamesShell(DecksNames_id){
        // logFunctionsStart("createDecksNamesShell");
            var decksNamesQuery = DecksNames.findOne({_id : DecksNames_id});

            var DecksArchetypesAggregation = DecksNames.aggregate(
                [
                    {$match: {_id : DecksNames_id}},
                    {$lookup: {
                            "from" : "DecksData",
                            "localField" : "_id",
                            "foreignField" : "DecksNames_id",
                            "as" : "DecksData"
                    }},
                    {$project : {DecksData : 1,DecksDataQuantity : {$size : "$DecksData"}}},
                    {$match : {DecksDataQuantity : {$gte : 5}}},
                    {$unwind: {path : "$DecksData"}},
                    {$project: {_id : "$DecksData._id",name : {$map : {input : "$DecksData.main", as : "el", in : "$$el.name"}}}},
                    {$unwind: {path : "$name"}},
                    {$group: {_id : "$name", count : {$sum : 1}}},
                    {$lookup: {
                            "from" : "CardDatabase",
                            "localField" : "_id",
                            "foreignField" : "name",
                            "as" : "cardData"
                    }},
                    {$unwind: {path : "$cardData"}},
                    {$match: {"cardData.land" : false}},
                    {$group: {_id : "$count",cards : { $push : "$_id"}}},
                    {$sort: {_id : -1}},
                    {
                        $project : {
                            _id : 0,
                            quantity : "$_id",
                            cards : 1
                        }
                    }
                ]
            );



            if(DecksArchetypesAggregation.length){
                var deckShell = [];
                for(var i = 0; i< DecksArchetypesAggregation.length; i++){
                    deckShell = deckShell.concat(DecksArchetypesAggregation[i].cards).unique();
                    if(deckShell.length >= 6){
                        break;
                    }
                }
                DecksNamesShells.update({DecksNames_id : DecksNames_id, name : decksNamesQuery.name, format : decksNamesQuery.format},{
                        $set : {
                            cardTiers : DecksArchetypesAggregation,
                            deckShell : deckShell
                        }
                    },
                    {
                        upsert : true
                    }
                )
            }else{
                DecksNamesShells.remove({DecksNames_id : DecksNames_id})
            }
        // logFunctionsEnd("createDecksNamesShell");
    },
    createDecksNamesShellsByFormat(Formats_id){
        logFunctionsStart("createDecksNamesShellsByFormat");
            DecksNames.find({Formats_id : Formats_id}).forEach((decksNames)=>{
                Meteor.call("createDecksNamesShell", decksNames._id);
            })
        logFunctionsEnd("createDecksNamesShellsByFormat");
    },
    findDecksByDecksNamesShells(DecksNamesShells_id){
        logFunctionsStart("findDecksByDecksNamesShellsAll");
            var DecksNamesShellsQuery = DecksNamesShells.findOne({_id : DecksNamesShells_id});
            var DecksDataQuery_ids = DecksData.find({
                    format : DecksNamesShellsQuery.format,
                    state: {$nin : ["manual", "perfect", "shell"]},
                    "main.name" : {$all : DecksNamesShellsQuery.deckShell}})
                .map((deckData)=>{
                    return deckData._id;
            });

            if(DecksDataQuery_ids.length){
                var array = [];
                DecksNamesShells.find({format : DecksNamesShellsQuery.format}).forEach((decksNamesShell)=>{
                    var decksDataQuery_ids = DecksData.find(
                        {
                            _id: {$in: DecksDataQuery_ids},
                            "main.name": {$all: decksNamesShell.deckShell}
                        }
                    ).map((deckData)=>{
                        return deckData._id;
                    })

                    if(decksDataQuery_ids.length){
                        array.push({DecksNamesShells_id : decksNamesShell._id, DecksNames_id: decksNamesShell.DecksNames_id, decksDataQuery_ids: decksDataQuery_ids, quantity : decksNamesShell.deckShell.cards.length})
                    }
                });
                var highestObject = {quantity : 0};

                for(var i=0; i < array.length; i++){
                    if(highestObject.quantity < array[i].quantity){
                        highestObject = array[i];
                    }
                }
                DecksData.update({_id : {$in : highestObject.decksDataQuery_ids}},
                    {$set : {DecksNames_id : highestObject.DecksNames_id, state : "shell"}},
                    {multi : true}
                )
                CreateTheCardList(data.DecksNames_id);
            }

        logFunctionsEnd("findDecksByDecksNamesShellsAll");
    },
    findDecksByDecksNamesShellsAll(Formats_id){
        logFunctionsStart("findDecksByDecksNamesShellsAll");
            DecksNamesShells.find({Formats_id : Formats_id}).forEach((decksNamesShells)=>{
                Meteor.call("findDecksByDecksNamesShells", decksNamesShells._id);
            });
        logFunctionsEnd("findDecksByDecksNamesShellsAll");
    },
    getDecksNamesByFormat(Formats_id){
        return DecksNames.find({Formats_id : Formats_id}).fetch();
    },
    formatToFormats_id(){
        logFunctionsStart("formatToFormats_id")
            Formats.find({}).map(format => {
                var formatsRegex = [];
                for (var i = 0; i < format.names.length; i++) {
                    formatsRegex[i] = new RegExp(format.names[i], "i");
                }
                DecksNames.update({format : {$in : formatsRegex}},
                    {
                        $set : {Formats_id : format._id},
                        $unset : {format : ""}
                    },
                    {
                        multi : true
                    })
            });
        logFunctionsEnd("formatToFormats_id")
    },
    DecksNamesCreateLinkNameMethod(){
        logFunctionsStart("DecksNamesCreateLinkNameMethod")
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
        logFunctionsEnd("DecksNamesCreateLinkNameMethod")
    }
})