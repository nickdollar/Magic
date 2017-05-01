import moment from "moment";
import Fuse from "fuse.js";

Meteor.methods({
    createSetsMethod(){
          createSets();
    },
    giveSetsTCGNamesMethod(){
        giveSetsTCGNames();
    },
    compareSetsMethod(){
        compareSets();
    }
});

giveSetsTCGNames = ()=>{

    var allCardsNames = Sets.find({}, {fields : {n : 1}}).fetch();

    console.log(allCardsNames);
    var options = {
        keys : ["n"],
        id : "n",
        threshold : 0.4
    }

    var fuse = new Fuse(allCardsNames, options);

    TCGPlayerCards.find().forEach((tcg)=>{


        var founds = fuse.search(tcg.name);
        if(founds.length){

            console.log(Sets.findOne({n : founds[0]}));
            Sets.update({n : founds[0]},
                {
                    $set : {TCG_n : tcg.name}
                })
        }
    })
}




createSets = ()=>{
    logFunctionsStart("createSets");
    Sets.remove({});

    MTGSets.find({}).forEach((set)=>{
        var data = {};
        set.name ?          data.n = set.name : null;
        set.name ?          data.ns = [set.name] : null;
        set.code ?          data._id = set.code : null;
        set.gathererCode ?  data.gc = set.gatheredCode : null;
        set.date ?          data.rd = moment(set.date, "YYYY-MM-DD").toDate() : null;
        set.border ?        data.bo = set.border : null;
        set.cards ?         data.q = set.cards.length : null;
        set.type ?          data.t = set.type : null;

        Sets.insert(data);
    })
    logFunctionsEnd("createSets");
}


compareSets = ()=>{
    logFunctionsStart("compareSets");
    MTGSets.find().forEach((set1)=>{
        var cards1 = set1.cards.map(card=> card.name);
        TCGPlayerCards.find().forEach((set2)=>{
            var cards2 = set2.cards.map(card => card.name);
            var intersection = _.intersection(cards1, cards2);

            if(Math.abs(intersection.length - cards1.length) < 10 && intersection.length != 0){

                console.log(intersection.length, cards1.length);
                console.log(set1.name + "+||+" + set2.name);
            }
        })
    });
    logFunctionsEnd("compareSets");
}

/*
c       code
rd      release date
n       name
ns      names
rd      release date
bo      border
q       quantity
t       type
gc      gatherer code
 */


[
    {name : "Amonkhet", code : "AKH"},
    {name : "Aether Revolt", code : "AER"},
    {name : "Kaladesh", code : "KLD"},
    {name : "Eldritch Moon", code : "EMN"},
    {name : "Shadows Over Innistrad", code : "SOI"},
    {name : "Oath of the Gatewatch", code : "OGW"},
    {name : "Battle for Zendikar", code : "BFZ"},
    {name : "Dragons of Tarkir", code : "DTK"},
    {name : "Fate Reforged", code : "FRF"},
    {name : "Khans of Tarkir", code : "KTK"},
    {name : "Journey Into Nyx", code : "JOU"},
    {name : "Born of the Gods", code : "BNG"},
    {name : "Theros", code : "THS"},
    {name : "Dragon's Maze", code : ""},
    {name : "Gatecrash", code : ""},
    {name : "Return to Ravnica", code : ""},
    {name : "Avacyn Restored", code : ""},
    {name : "Dark Ascension", code : ""},
    {name : "Innistrad", code : ""},
    {name : "New Phyrexia", code : ""},
    {name : "Mirrodin Besieged", code : ""},
    {name : "Scars of Mirrodin", code : ""},
    {name : "Rise of the Eldrazi", code : ""},
    {name : "Worldwake", code : ""},
    {name : "Zendikar", code : ""},
    {name : "Alara Reborn", code : ""},
    {name : "Conflux", code : ""},
    {name : "Shards of Alara", code : ""},
    {name : "Eventide", code : ""},
    {name : "Shadowmoor", code : ""},
    {name : "Morningtide", code : ""},
    {name : "Lorwyn", code : ""},
    {name : "Future Sight", code : ""},
    {name : "Planar Chaos", code : ""},
    {name : "Time Spiral", code : ""},
    {name : "Timeshifted", code : ""},
    {name : "Coldsnap", code : ""},
    {name : "Dissension", code : ""},
    {name : "Guildpact", code : ""},
    {name : "Ravnica", code : ""},
    {name : "Saviors of Kamigawa", code : ""},
    {name : "Betrayers of Kamigawa", code : ""},
    {name : "Champions of Kamigawa", code : ""},
    {name : "Fifth Dawn", code : ""},
    {name : "Darksteel", code : ""},
    {name : "Mirrodin", code : ""},
    {name : "Scourge", code : ""},
    {name : "Legions", code : ""},
    {name : "Onslaught", code : ""},
    {name : "Judgment", code : ""},
    {name : "Torment", code : ""},
    {name : "Odyssey", code : ""},
    {name : "Apocalypse", code : ""},
    {name : "Planeshift", code : ""},
    {name : "Invasion", code : ""},
    {name : "Prophecy", code : ""},
    {name : "Nemesis", code : ""},
    {name : "Mercadian Masques", code : ""},
    {name : "Urza's Destiny", code : ""},
    {name : "Urza's Legacy", code : ""},
    {name : "Urza's Saga", code : ""},
    {name : "Exodus", code : ""},
    {name : "Stronghold", code : ""},
    {name : "Tempest", code : ""},
    {name : "Weatherlight", code : ""},
    {name : "Visions", code : ""},
    {name : "Mirage", code : ""},
    {name : "Alliances", code : ""},
    {name : "Homelands", code : ""},
    {name : "Ice Age", code : ""},
    {name : "Fallen Empires", code : ""},
    {name : "The Dark", code : ""},
    {name : "Legends", code : ""},
    {name : "Antiquities", code : ""},
    {name : "Arabian Nights", code : ""},
    {name : "Magic Origins", code : ""},
    {name : "Magic 2015 (M15)", code : ""},
    {name : "Magic 2014 (M14)", code : ""},
    {name : "Magic 2013 (M13)", code : ""},
    {name : "Magic 2012 (M12)", code : ""},
    {name : "Magic 2011 (M11)", code : ""},
    {name : "Magic 2010 (M10)", code : ""},
    {name : "Tenth Edition", code : ""},
    {name : "Ninth Edition", code : ""},
    {name : "Eighth Edition", code : ""},
    {name : "Seventh Edition", code : ""},
    {name : "Sixth Edition", code : ""},
    {name : "Fifth Edition", code : ""},
    {name : "Fourth Edition", code : ""},
    {name : "Revised Edition", code : ""},
    {name : "Unlimited Edition", code : ""},
    {name : "Beta Edition", code : ""},
    {name : "Alpha Edition", code : ""},
    {name : "Modern Masters 2017", code : ""},
    {name : "Commander 2016", code : ""},
    {name : "Kaladesh Inventions", code : ""},
    {name : "Eternal Masters", code : ""},
    {name : "Commander 2015", code : ""},
    {name : "Zendikar Expeditions", code : ""},
    {name : "Modern Masters 2015", code : ""},
    {name : "Conspiracy: Take the Crown", code : ""},
    {name : "Conspiracy", code : ""},
    {name : "Modern Masters", code : ""},
    {name : "From the Vault: Lore", code : ""},
    {name : "From the Vault: Annihilation", code : ""},
    {name : "From the Vault: Angels", code : ""},
    {name : "From the Vault: Dragons", code : ""},
    {name : "From the Vault: Exiled", code : ""},
    {name : "From the Vault: Legends", code : ""},
    {name : "From the Vault: Realms", code : ""},
    {name : "From the Vault: Relics", code : ""},
    {name : "From the Vault: Twenty", code : ""},
    {name : "Modern Event Deck", code : ""},
    {name : "Duel Decks: Nissa vs. Ob Nixilis", code : ""},
    {name : "Duel Decks: Blessed vs. Cursed", code : ""},
    {name : "Duel Decks: Zendikar vs. Eldrazi", code : ""},
    {name : "Duel Decks: Elspeth vs. Kiora", code : ""},
    {name : "Duel Decks: Anthology", code : ""},
    {name : "Speed vs. Cunning", code : ""},
    {name : "Ajani vs. Nicol Bolas", code : ""},
    {name : "Divine vs. Demonic", code : ""},
    {name : "Elspeth vs. Tezzeret", code : ""},
    {name : "Elves vs. Goblins", code : ""},
    {name : "Garruk vs. Liliana", code : ""},
    {name : "Heroes vs. Monsters", code : ""},
    {name : "Izzet vs. Golgari", code : ""},
    {name : "Jace vs. Chandra", code : ""},
    {name : "Jace vs. Vraska", code : ""},
    {name : "Knights vs. Dragons", code : ""},
    {name : "Phyrexia vs. The Coalition", code : ""},
    {name : "Sorin vs. Tibalt", code : ""},
    {name : "Venser vs. Koth", code : ""},
    {name : "PDS: Graveborn", code : ""},
    {name : "PDS: Slivers", code : ""},
    {name : "PDS: Fire and Lightning", code : ""},
    {name : "Commander 2014", code : ""},
    {name : "Commander", code : ""},
    {name : "Commander's Arsenal", code : ""},
    {name : "Commander 2013", code : ""},
    {name : "Archenemy", code : ""},
    {name : "Duels of the Planeswalkers", code : ""},
    {name : "Planechase Anthology", code : ""},
    {name : "Planechase 2012", code : ""},
    {name : "Planechase", code : ""},
    {name : "Chronicles", code : ""},
    {name : "Portal", code : ""},
    {name : "Portal Second Age", code : ""},
    {name : "Portal Three Kingdoms", code : ""},
    {name : "Starter 1999", code : ""},
    {name : "Starter 2000", code : ""},
    {name : "Anthologies", code : ""},
    {name : "Battle Royale Box Set", code : ""},
    {name : "Beatdown Box Set", code : ""},
    {name : "Unglued", code : ""},
    {name : "Unhinged", code : ""},
    {name : "Vanguard", code : ""},
    {name : "Ugin's Fate Promos", code : ""},
    {name : "Arena Promos", code : ""},
    {name : "Champs Promos", code : ""},
    {name : "FNM Promos", code : ""},
    {name : "Game Day Promos", code : ""},
    {name : "WPN & Gateway Promos", code : ""},
    {name : "Grand Prix Promos", code : ""},
    {name : "Guru Lands", code : ""},
    {name : "JSS/MSS Promos", code : ""},
    {name : "Judge Promos", code : ""},
    {name : "Launch Party & Release Event Cards", code : ""},
    {name : "Magic Player Rewards", code : ""},
    {name : "Media Promos", code : ""},
    {name : "Prerelease Cards", code : ""},
    {name : "Pro Tour Promos", code : ""},
    {name : "Special Occasion", code : ""},
    {name : "Unique and Miscellaneous Promos", code : ""},
    {name : "Collector's Edition", code : ""},
]