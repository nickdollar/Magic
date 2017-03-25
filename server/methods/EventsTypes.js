Meteor.methods({
    createEventsTypesMethod(){
        createEventsTypes();
    }
})

createEventsTypes = ()=>{
    console.log("START: createEventsTypes");
    var eventsArray = [
        {name : "Power 9 Tournament",       owner_id : 19,  venue : "StarCityGames.com",            names : ["StarCityGames.com Power 9 Tournament", "Power 9 Tournament"]},
        {name : "Classic",                  owner_id : 36,  venue : "StarCityGames.com",            names : ["StarCityGames.com Classic", "Classic"]},
        {name : "Elite IQ",                 owner_id : 35,  venue : "StarCityGames.com",            names : ["StarCityGames.com Elite IQ", "Elite IQ"]},
        {name : "Invitational",             owner_id : 21,  venue : "StarCityGames.com",            names : ["StarCityGames.com Invitational", "Invitational"]},
        {name : "Invitational Qualifier",   owner_id : 29,  venue : "StarCityGames.com",            names : ["StarCityGames.com Invitational Qualifier", "Invitational Qualifier"]},
        {name : "Legacy Open",              owner_id : 20,  venue : "StarCityGames.com",            names : ["StarCityGames.com Legacy Open", "Legacy Open"]},
        {name : "Modern Open",              owner_id : 47,  venue : "StarCityGames.com",            names : ["StarCityGames.com Modern Open", "Modern Open"]},
        {name : "Players' Championship",    owner_id : 48,  venue : "StarCityGames.com",            names : ["StarCityGames.com Players' Championship", "Players' Championship"]},
        {name : "Premier IQ",               owner_id : 45,  venue : "StarCityGames.com",            names : ["StarCityGames.com Premier IQ", "Premier IQ"]},
        {name : "Sealed Open",              owner_id : 39,  venue : "StarCityGames.com",            names : ["StarCityGames.com Sealed Open", "Sealed Open"]},
        {name : "Standard Open",            owner_id : 19,  venue : "StarCityGames.com",            names : ["StarCityGames.com Standard Open", "Standard Open"]},
        {name : "Super IQ",                 owner_id : 33,  venue : "StarCityGames.com",            names : ["StarCityGames.com Super IQ", "Super IQ"]},
        {name : "Team Constructed Open",    owner_id : 49,  venue : "StarCityGames.com",            names : ["StarCityGames.com Team Constructed Open", "Team Constructed Open"]},
        {name : "States",                   owner_id : 10,  venue : "StarCityGames.com",            names : ["StarCityGames.com States", "States"]},
        {name : "Regionals",                                venue : "StarCityGames.com",            names : ["StarCityGames.com Regionals", "Regionals"]},
        {name : "Daily",                                    venue : "http://magic.wizards.com",     names : ["Daily"]},
        {name : "League",                                   venue : "http://magic.wizards.com",     names : ["League"]},
        {name : "Grand Prix",                               venue : "http://magic.wizards.com",     names : ["Grand Prix", "GP"]},
        {name : "Pro Tour Qualifier",                       venue : "http://magic.wizards.com",     names : ["Pro Tour Qualifier", "PTQ"]},
        {name : "Local Game Store",                                                                 names : ["Local Game Store", "LGS"]},
    ]

    for(var i = 0; i < eventsArray.length; i++){
        EventsTypes.update({name : eventsArray[i].name},
            {
                $set : eventsArray[i]
            },
            {
                upsert : true
            })
    }
    console.log("   END: createEventsTypes");
}