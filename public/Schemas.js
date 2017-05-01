var cardsCollectionsSchema = {
    _id : {
        description : "Card Name"
    },
    ns : {
        names : "Names",
        Types : "[Strings]"
    },
    txt : {
        names : "text",
        Types : "String"
    },
    lo : {
        name : "layout",
        options : ["double-faced", "flip", "leveler", "meld", "normal", "phenomenom", "plane", "scheme", "split", "token", "vanguard"],
        type : "String",
        required : true
    },
    ts : {
        name : "types",
        options : ["artifact", "conspiracy", "creature", "enchantment", "instant", "land", "phenomenon", "plane", "planeswalker", "scheme", "sorcery", "tribal", "vanguard"],
        type : "[String]",
        required : true
    },
    tl : {
        name : "type line",
        type : "String",
        description : "",
        required : true
    },
    sbs : {
        name : "subtypes",
        options : ["Praetor", "Camel", "Druid", "Wildfire", "Insect", "Lizard", "Dryad", "Vryn", "Goblin", "Forest", "Eldrazi", "Aetherborn", "Myr", "Horror", "Pegasus", "Human", "Werewolf", "Equipment", "Snake", "Wolf", "Egg", "God", "Spirit", "Bird", "Sorin", "Spider", "Kor", "Elder", "Avatar", "Scion", "Aura", "Zombie", "Scout", "Bat", "Knight", "Reflection", "Monk", "Ally", "Assassin", "Swamp", "Cat", "Scarecrow", "Vedalken", "Gnome", "Soldier", "Locus", "Gremlin", "Illusion", "Beast", "Crab", "Rogue", "Rat", "Gate", "New Phyrexia", "Hydra", "Faerie", "Lair", "Dwarf", "Construct", "Gus", "Artificer", "Elephant", "Kiora", "Warrior", "Whale", "Crocodile", "Bureaucrat", "Curse", "Boar", "Pilot", "Naga", "Orgg", "Orc", "Merfolk", "Dragon", "Wurm", "Kaldheim", "Lady", "Giant", "Wall", "Elf", "Monkey", "Fox", "Elemental", "Rebel", "Assembly-Worker", "Mole", "Thopter", "Lhurgoyf", "Griffin", "Ox", "Advisor", "Angel", "Nephilim", "Wizard", "Homarid", "Centaur", "Processor", "Golem", "Cleric", "Carrier", "Berserker", "Ral", "Ogre", "Hound", "Vampire", "Pirate", "Siren", "Tezzeret", "Imp", "Shadowmoor", "Shaman", "Treefolk", "Rigger", "Kithkin", "Mountain", "Plains", "Island", "Archon", "Plant", "Liliana", "Aurochs", "Specter", "Slug", "Hag", "Noggle", "Koth", "Freyalise", "Troll", "Drone", "Pest", "Rhino", "Drake", "Kavu", "Skeleton", "Dovin", "Mutant", "Kraken", "Viashino", "Sphinx", "Gargoyle", "Homunculus", "Jellyfish", "Leviathan", "Minotaur", "Ooze", "Power-Plant", "Archer", "Fungus", "Demon", "Leech", "Hippogriff", "Cyclops", "Iquatana", "Serpent", "Shrine", "Elspeth", "Phoenix", "Brushwagg", "Eye", "Antelope", "Mongseng", "Bear", "Karn", "Dack", "Wraith", "Rabiah", "Turtle", "Worm", "Shade", "Scorpion", "Surrakar", "Ape", "Phelddagrif", "Basilisk", "Fish", "Horse", "Juggernaut", "Masticore", "Oyster", "Salamander", "Devil", "Elk", "Zendikar", "Pyrulea", "Kephalai", "Kolbahan", "Equilor", "Nautilus", "Innistrad", "Legend", "Lorwyn", "Kaya", "Azgol", "Regatha", "Shandalar", "Ravnica", "Weird", "Slith", "Thrull", "Gorgon", "Frog", "Cockatrice", "Satyr", "Chimera", "Harpy", "Sable", "Unicorn", "Badger", "Sheep", "Sliver", "Starfish", "Rabbit", "Kirin", "Paratrooper", "Lammasu", "Efreet", "Cow", "Yeti", "Thalakos", "Dinosaur", "Djinn", "Xenagos", "Nahiri", "Nixilis", "Sarkhan", "Hellion", "Nissa", "Ajani", "Mime", "Clamfolk", "Bringer", "Samurai", "Arcane", "Zubera", "Moonfolk", "Igpay", "Townsfolk", "Donkey", "Gamer", "Spike", "Child", "Shapeshifter", "Beeble", "Designer", "Mummy", "Mercadia", "Vehicle", "Lord", "Barbarian", "Waiter", "Hero", "Hyena", "Ship", "Ninja", "Minion", "Proper", "Mercenary", "Urza’s", "Wolverine", "Daretti", "Spellshaper", "Nomad", "Saproling", "Kamigawa", "Ergamon", "Kyneth", "Xerex", "Spawn", "Chandra", "Jace", "Nightmare", "Luvion", "Volver", "Karsus", "Elves", "Kinshala", "Monger", "Manticore", "Cephalid", "Incarnation", "Squid", "Fabacin", "Nightstalker", "Metathran", "Mongoose", "Atog", "Flagbearer", "Mystic", "Squirrel", "Muraganda", "Goat", "Garruk", "Tibalt", "Belenon", "Dauthi", "Alara", "Mirrodin", "Dominaria", "Vraska", "Octopus", "Ashiok", "Nymph", "Lamia", "Teferi", "Ugin", "Narset", "Gideon", "Ulgrotha", "Arlinn", "Tamiyo", "Saheeli", "Moag", "Phyrexia", "Trap", "Hippo", "Soltari", "Chicken", "of", "Etiquette", "Bolas", "Goblins", "Sponge", "Ouphe", "Fortification", "Segovia", "Valla", "Arkhos", "Bolas’s Meditation Realm", "Serra’s Realm", "Rath", "Ir", "Venser", "Domri", "Mine", "Desert", "Tower", "Kobold", "Wombat", "Ferret", "Dreadnought", "Licid"],
        type : "[String]",
        required : true
    },
    sts : {
        name : "supertypes",
        type : "[String]",
        options : ["Basic", "Legendary", "Ongoing", "Snow", "World"]
    },
    cmc : {
        name : "Converted Mana Cost",
        type : "Integer/Double"
    },
    mc : {
        name : "Mana Cost",
        type : "[String]"
    },
    ci : {
        name : "Color Identity",
        type : "[String]",
        options : ["b", "g", "r", "u", "w"]
    },
    pt : {
        name : "power/toughtness",
        type : "[int]"
    },
    pts : {
        name : "power/toughtness",
        type : "[int]"
    },
    p : {
        name : "printings",
        type : "[Object]",
        Object : {
            s : {
                name : "Set",
                type : "String",
                required : true
            },
            r : {
                name : "rarity",
                type : "String",
                options : ["b", "c", "u", "r", "m", "s"]
            },
            nf : {
                name : "Normal/Foil",
                type : "[Bool]",
                required : true
            },
            id : {

            }
        }
    },
    pr : {
        name : "Prices",
        types : "[Object]",
        Object : {
            n : {
                name : "Card",
                type : "String"
            },
            s : {
                name : "Set",
                type : "String",
            },
            val : {
                name : "Set",
                type : "[double]"
            }
        }
    },
    rul : {
        name : "rulings",
        type : "[Object]",
        Object : {
            dt : {
                name : "date",
                type : "date"
            },
            txt : {
                name : "text",
                type : "String"
            }
        }
    },
    leg : {
        name : "legalities",
        type : "[Object]",
        Object : {
            f_id : {
                name : "Formats_id",
                type : "String",
                relation : "Formats"
            },
            leg : {
                name : "Legality",
                type : "Legal",
                options : ["Banned", "Legal", "Restrict"]
            }
        }
    },
    avg : {
        name : "average",
        type : "double",
        required : true
    },
}

//abbreviations
/*

avg         avg
b           Bool
c           c
ci          Color Identity
cmd         Converted Mana Cost
dt          date
f           foil
lo          layout
mc          Mana Cost
n           name
nf          Normal Foil
ns          names
p           print
pt          Power
q           quantity
r           ratity
sbs         subtypes
s           set
ss          sets
sts         supertypes
tt          typeText
txt         text
val         value
tl          type line
ts          types
t           type

*/