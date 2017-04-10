Meteor.methods({

})

createFormats = ()=>{
    logFunctionsStart("createFormats");
    var formats =
        [
            {
                _id : "sta",
                name : "Standard",
                names : ["sta", "standard"],
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
                banned :[
                    "Ancient Den",
                    "Birthing Pod",
                    "Blazing Shoal",
                    "Bloodbraid Elf",
                    "Chrome Mox",
                    "Cloudpost",
                    "Dark Depths",
                    "Deathrite Shaman",
                    "Dig Through Time",
                    "Dread Return",
                    "Eye of Ugin",
                    "Gitaxian Probe",
                    "Glimpse of Nature",
                    "Golgari Grave-Troll",
                    "Great Furnace",
                    "Green Sun's Zenith",
                    "Hypergenesis",
                    "Jace, the Mind Sculptor",
                    "Mental Misstep",
                    "Ponder",
                    "Preordain",
                    "Punishing Fire",
                    "Rite of Flame",
                    "Seat of the Synod",
                    "Second Sunrise",
                    "Seething Song",
                    "Sensei's Divining Top",
                    "Skullclamp",
                    "Splinter Twin",
                    "Stoneforge Mystic",
                    "Summer Bloom",
                    "Treasure Cruise",
                    "Tree of Tales",
                    "Umezawa's Jitte",
                    "Vault of Whispers",
                ],
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
                _id : "vin",
                name : "Vintage",
                names : ["vin", "vintage"],
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
    logFunctionsEnd("createFormats");
}