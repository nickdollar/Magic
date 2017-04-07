Meteor.methods({

})

createFormats = ()=>{
    console.log("START: createFormats");
    var formats =
        [
            {
                _id : "std",
                name : "Standard",
                names : ["std", "standard"],
                banned :[],
                types : [
                    {
                        name : "main",
                        qty : {min : 60}
                    },
                    {
                        name : "sideboard",
                        qty : {max : 15}
                    }
                ],
                active : 1
            },
            {
                _id : "mod",
                name : "Modern",
                names : ["mod", "modern"],
                banned :[],
                types : [
                    {name : "main", qty : {min : 60}},
                    {name : "sideboard", qty : {max : 15}}
                ],
                active : 1
            },
            {
                _id : "leg",
                name : "Legacy",
                names : ["leg", "legacy"],
                banned :[],
                types : [
                    {
                        name : "main",
                        qty : {min : 60}
                    },
                    {
                        name : "sideboard",
                        qty : {
                            max : 15
                        }
                    }
                ],
                active : 1},
            {
                _id : "vnt",
                name : "Vintage",
                names : ["vnt", "vintage"],
                banned :[],
                types : [
                    {
                        name : "main",
                        qty : {min : 60}
                    },
                    {
                        name : "sideboard",
                        qty : {max : 15}
                    }
                ],
                active : 1
            },
            {
                _id : "edh",
                name : "EDH",
                names : ["EDH", "EDH Commander"],
                banned :[],
                types : [
                    {
                        name : "main",
                        qty : {min : 60}
                    },
                    {
                        name : "commander",
                        qty : {
                            exactly : 1}
                    }
                ],
                active : 0
            },
            {
                _id : "pau",
                name : "Pauper",
                names : ["pau", "Pauper"],
                banned :[],
                types : [
                    {
                        name : "main",
                        qty : {min : 60}
                    },
                    {
                        name : "commander",
                        qty : {
                            exactly : 1}
                    }
                ],
                active : 0
            },
        ]
    Formats.remove({});
    formats.forEach((format)=>{
        Formats.insert(format);
    })
    console.log("   END: createFormats");
}