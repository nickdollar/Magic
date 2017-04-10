Meteor.methods({
    createEventsTypesMethod(){
        createEventsTypes();
    }
})

createEventsTypes = ()=>{
    logFunctionsStart("createEventsTypes");

    EventsTypes.remove({});

    var eventsArray = [
        {
            _id : "SCGP9",
            name : "Power 9 Tournament",
            states : [{name : "SCGCreated", order : 1}, {name : "decks", order : 2}],
            short : "P9 Tour",
            size : 0,
            owner_id : 19,
            venue : "SCG",
            website : "StarCityGames.com",
            names : ["StarCityGames.com Power 9 Tournament", "Power 9 Tournament"]
        },
        {
            _id : "SCGClassic",
            name : "Classic",
            states : [{name : "SCGCreated", order : 1}, {name : "decks", order : 2}],
            short : "Classic",
            size : 0,
            owner_id : 36,
            venue : "SCG",
            website : "StarCityGames.com",
            names : ["StarCityGames.com Classic", "Classic"]
        },
        {_id : "SCGEliteIQ",
            name : "Elite IQ",
            states : [{name : "SCGCreated", order : 1}, {name : "decks", order : 2}],
            short : "Elite IQ",
            size : 0,
            owner_id : 35,
            venue : "SCG",
            website : "StarCityGames.com",
            names : ["StarCityGames.com Elite IQ", "Elite IQ"]
        },
        {
            _id : "SCGInvi",
            name : "Invitational",
            states : [{name : "SCGCreated", order : 1}, {name : "decks", order : 2}],
            short : "Inviational",
            size : 1,
            owner_id : 21,
            venue : "SCG",
            website : "StarCityGames.com",
            names : ["StarCityGames.com Invitational", "Invitational"]
        },
        {
            _id : "SCGInviQual",
            name : "Invitational Qualifier",
            states : [{name : "SCGCreated", order : 1}, {name : "decks", order : 2}],
            short : "Invi Qual",
            size : 0,
            owner_id : 29,
            venue : "SCG",
            website : "StarCityGames.com",
            names : ["StarCityGames.com Invitational Qualifier", "Invitational Qualifier"]
        },
        {
            _id : "SCGOpen",
            name : "Open",
            states : [{name : "SCGCreated", order : 1}, {name : "decks", order : 2}],
            short : "Open",
            size : 1,
            venue : "SCG",
            website : "StarCityGames.com",
            names : [
                "StarCityGames.com Open",
                "StarCityGames.com Legacy Open",
                "StarCityGames.com Standard Open",
                "StarCityGames.com Modern Open",
                "StarCityGames.com Team Constructed Open",
                "StarCityGames.com Sealed Open",
                "Open"
            ]
        },
        {
            _id : "SCGPlayersChamp",
            name : "Players' Championship",
            states : [{name : "SCGCreated", order : 1}, {name : "decks", order : 2}],
            short : "Players' Champ",
            size : 0,
            owner_id : 48,
            venue : "SCG",
            website : "StarCityGames.com",
            names : ["StarCityGames.com Players' Championship", "Players' Championship"]
        },
        {
            _id : "SCGPremIQ",
            name : "Premier IQ",
            states : [{name : "SCGCreated", order : 1}, {name : "decks", order : 2}],
            short : "Premier IQ",
            size : 0,
            owner_id : 45,
            venue : "SCG",
            website : "StarCityGames.com",
            names : ["StarCityGames.com Premier IQ", "Premier IQ"]
        },
        {
            _id : "SCGSuperIQ",
            name : "Super IQ",
            states : [{name : "SCGCreated", order : 1}, {name : "decks", order : 2}],
            short : "Super IQ",
            size : 0, owner_id : 33,
            venue : "SCG",
            website : "StarCityGames.com",
            names : ["StarCityGames.com Super IQ", "Super IQ"]
        },
        {
            _id : "SCGStates",
            name : "States",
            states : [{name : "SCGCreated", order : 1}, {name : "decks", order : 2}],
            short : "States",
            size : 0, owner_id : 10,
            venue : "SCG",
            website : "StarCityGames.com",
            names : ["StarCityGames.com States", "States"]},
        {
            _id : "SCGReg",
            name : "Regionals",
            states : [{name : "SCGCreated", order : 1}, {name : "decks", order : 2}],
            short : "Regionals",
            size : 0,
            venue : "SCG",
            website : "StarCityGames.com",
            names : ["StarCityGames.com Regionals", "Regionals"]},
        {
            _id : "MTGMODaily",
            name : "Daily",
            states : [{name : "decks", order : 1}],
            short : "Daily",
            size : 0,
            venue : "MTGO",
            website : "http://magic.wizards.com",
            names : ["Daily"]},
        {
            _id : "MTGMOLeague",
            name : "League",
            states : [{name : "decks", order : 1}],
            short : "League",
            size : 0,
            venue : "MTGO",
            website : "http://magic.wizards.com",
            names : ["League"]
        },
        {
            _id : "MTGMOPTQ",
            name : "Magic Online Pro Tour Qualifier",
            states : [{name : "decks", order : 1}],
            short : "MO PTQ",
            size : 1,
            venue : "MTGO",
            website : "http://magic.wizards.com",
            names : ["MTGOPTQ", "Magic Online Pro Tour Qualifier"]
        },
        {
            _id : "MTGPTQ",
            name : "Pro Tour Qualifier",
            states : [{name : "created", order : 1}, {name : "finalStanding", order : 2}, {name : "decks", order : 3}                                    ],
            short : "PTQ",
            size : 1,
            venue : "WotC",
            website : "http://magic.wizards.com",
            names : ["Pro Tour Qualifier", "PTQ"]
        },
        {
            _id : "MTGGP",
            name : "Grand Prix",
            states : [{name : "created", order : 1}, {name : "finalStanding", order : 2}, {name : "decks", order : 3}],
            short : "GP",
            size : 1,
            venue : "WotC",
            website : "http://magic.wizards.com",
            names : ["Grand Prix", "GP"]
        },
        {
            _id : "LGS",
            name : "Local Game Store",
            states : [{name : "decks", order : 1}],
            short : "LGS",
            size : 2,
            venue : "LGS",
            names : ["Local Game Store", "LGS"]
        },
    ]

    for(var i = 0; i < eventsArray.length; i++) {
        EventsTypes.insert(eventsArray[i]);
    }
    logFunctionsEnd("createEventsTypes");
}