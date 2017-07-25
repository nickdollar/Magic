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
                banned :["Emrakul, the Promised End", "Reflector Mage", "Smuggler’s Copter", "Felidar Guardian", "Aetherworks Marvel"],
                sets : ["BFZ", "OGW", "SOI", "EMN", "KLD", "AER", "AKH", "HOU"],
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
                banned :["Ancient Den", "Birthing Pod", "Blazing Shoal", "Bloodbraid Elf", "Chrome Mox", "Cloudpost", "Dark Depths", "Deathrite Shaman", "Dig Through Time",
                         "Dread Return", "Eye of Ugin", "Gitaxian Probe", "Glimpse of Nature", "Golgari Grave-Troll", "Great Furnace", "Green Sun's Zenith", "Hypergenesis",
                         "Jace, the Mind Sculptor", "Mental Misstep", "Ponder", "Preordain", "Punishing Fire", "Rite of Flame",  "Seat of the Synod", "Second Sunrise",
                         "Seething Song", "Sensei's Divining Top", "Skullclamp", "Splinter Twin", "Stoneforge Mystic", "Summer Bloom", "Treasure Cruise", "Tree of Tales",
                         "Umezawa's Jitte", "Vault of Whispers"],
                sets : [
                        "8ED", "MRD", "DST", "5DN", "CHK", "BOK", "SOK", "9ED", "RAV", "GPT",
                        "DIS", "CSP", "TSP", "PLC", "FUT", "10E", "LRW", "MOR", "SHM", "EVE",
                        "ALA", "CON", "ARB", "M10", "ZEN", "WWK", "ROE", "M11", "SOM", "MBS",
                        "NPH", "M12", "ISD", "DKA", "AVR", "M13", "RTR", "GTC", "DGM", "THS",
                        "BNG", "JOU", "KTK", "FRF", "DTK", "ORI", "BFZ", "OGW", "SOI", "EMN",
                        "KLD", "AER", "AKH", "HOU"
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
                banned :[["Adriana's Valor", "Advantageous Proclamation", "Amulet of Quoz", "Ancestral Recall", "Assemble the Rank and Vile", "Backup Plan", "Balance", "Bazaar of Baghdad", "Black Lotus",
                            "Brago's Favor", "Bronze Tablet", "Channel", "Chaos Orb", "Darkpact", "Demonic Attorney", "Demonic Consultation", "Demonic Tutor", "Dig Through Time", "Double Stroke",
                            "Dread Return", "Earthcraft", "Echoing Boon", "Emissary's Ploy", "Falling Star", "Fastbond", "Flash", "Frantic Search", "Goblin Recruiter", "Gush", "Hermit Druid", "Hired Heist",
                            "Hold the Perimeter", "Hymn of the Wilds", "Immediate Action", "Imperial Seal", "Incendiary Dissent", "Iterative Analysis", "Jeweled Bird", "Library of Alexandria", "Mana Crypt",
                            "Mana Drain", "Mana Vault", "Memory Jar", "Mental Misstep", "Mind Twist", "Mind's Desire", "Mishra's Workshop", "Mox Emerald", "Mox Jet", "Mox Pearl", "Mox Ruby", "Mox Sapphire",
                            "Muzzio's Preparations", "Mystical Tutor", "Natural Unity", "Necropotence", "Oath of Druids", "Power Play", "Rebirth", "Second Sunrise", "Secret Summoning", "Secrets of Paradise",
                            "Sensei's Divining Top", "Sentinel Dispatch", "Shahrazad", "Skullclamp", "Skullclamp", "Sol Ring", "Sovereign's Realm", "Strip Mine", "Summoner's Bond", "Survival of the Fittest",
                            "Tempest Efreet", "Time Vault", "Time Walk", "Timetwister", "Timmerian Fiends", "Tinker", "Tolarian Academy", "Treasure Cruise", "Unexpected Potential", "Vampiric Tutor", "Weight Advantage",
                            "Wheel of Fortune", "Windfall", "Worldknits", "Yawgmoth's Bargain", "Yawgmoth's Will"]],
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
                banned : ["Adriana's Valor", "Advantageous Proclamation", "Amulet of Quoz", "Assemble the Rank and Vile", "Backup Plan", "Brago's Favor", "Bronze Tablet", "Chaos Orb", "Chaos Orb",
                          "Contract from Below", "Darkpact", "Demonic Attorney", "Double Stroke", "Echoing Boon", "Emissary's Ploy", "Falling Star", "Falling Star", "Hired Heist", "Hold the Perimeter",
                          "Hymn of the Wilds", "Immediate Action", "Incendiary Dissent", "Iterative Analysis", "Jeweled Bird", "Muzzio's Preparations", "Natural Unity", "Power Play", "Rebirth",
                          "Secrets of Paradise", "Secret Summoning", "Sentinel Dispatch", "Shahrazad", "Shahrazad", "Sovereign's Realm", "Summoner's Bond", "Tempest Efreet", "Timmerian Fiends",
                          "Unexpected Potential", "Weight Advantage", "Worldknit"],
                restricted : ["Ancestral Recall", "Balance", "Black Lotus", "Brainstorm", "Chalice of the Void", "Channel", "Demonic Consultation", "Demonic Tutor", "Dig Through Time", "Fastbond",
                              "Flash", "Imperial Seal", "Library of Alexandria", "Lion's Eye Diamond", "Lodestone Golem", "Lotus Petal", "Mana Crypt", "Mana Vault", "Memory Jar", "Merchant Scroll",
                              "Mind's Desire", "Mox Emerald", "Mox Jet", "Mox Pearl", "Mox Ruby", "Mox Sapphire", "Mystical Tutor", "Necropotence", "Ponder", "Sol Ring", "Strip Mine", "Time Vault",
                              "Time Walk", "Timetwister", "Tinker", "Tolarian Academy", "Treasure Cruise", "Trinisphere", "Vampiric Tutor", "Wheel of Fortune", "Windfall", "Yawgmoth's Bargain", "Yawgmoth's Will"],
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
                active : 0
            },
            {
                _id : "edh",
                name : "EDH",
                names : ["EDH", "EDH Commander"],
                banned :["Ancestral Recall", "Balance", "Biorhythm", "Black Lotus", "Braids, Cabal Minion", "Coalition Victory", "Channel", "Emrakul, the Aeons Torn", "Erayo, Soratami Ascendant",
                    "Fastbond", "Gifts Ungiven", "Griselbrand", "Karakas", "Leovold, Emissary of Trest", "Library of Alexandria", "Limited Resources", "Mox Sapphire", "Mox Ruby", "Mox Pearl", "Mox Emerald", "Mox Jet",
                    "Painter's Servant", "Panoptic Mirror", "Primeval Titan", "Prophet of Kruphix", "Recurring Nightmare", "Rofellos, Llanowar Emissary", "Sway of the Stars", "Sundering Titan", "Sylvan Primordial",
                    "Time Vault", "Time Walk", "Tinker", "Tolarian Academy", "Trade Secrets", "Upheaval", "Worldfire", "Yawgmoth's Bargain"
                ],
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
                banned :["Cloud of Faeries", "Cloudpost", "Cranial Plating", "Empty the Warrens", "Frantic Search", "Grapeshot", "Invigorate", "Peregrine Drake", "Temporal Fissure", "Treasure Cruise"],
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