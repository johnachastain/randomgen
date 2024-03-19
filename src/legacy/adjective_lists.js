
/*	////////////////////////////////////////////////////////////////////////////////

    --------------------------------------------------------------------------------
	
	CREATURES
	================================================================================ */



var creature_underground = [
"Troglodyte",
"Drow",
"Carrion Crawler",
"Piercer"

];

var creature_undead = [
"Skeleton",	
"Zombie",
"Ghoul",
"Ghost",
"Wight",
"Wraith",
"Spectre"
];

var creature_nonhuman = [
"Dwarf",
"Elf",
"Gnome",
"Halfing",
"Drow"
];

var creature_goblinoid = [
"Troll",
"Ogre",
"Gnoll",
"Bugbear",
"Hobgoblin",
"Orc",
"Goblin",
"Kobold",
"Cyclops",
"Minotaur",
"Troglodyte"
];

var creature_animal = [
"Rat",
"Raven",
"Frog", 
"Serpent",
"Leech",
"Bat",
"Bear"
];

var creature_insect = [
"Spider",
"Ant"
];

var creature_medium = [
"Gargoyle",	
"Golem", 
"Demon",
"Devil",
"Carrion Crawler"
];

var creature_big = [
"Dragon",
"Wyrm", 
"Sphinx",
"Hydra",
"Griffon",
"Giant"
];

var creature_small = [
"Imp",
"Spore",
"Stirge",
"Piercer"
];


var creature = [
creature_small,
creature_big,
creature_medium,
creature_insect,
creature_animal,
creature_goblinoid,
creature_nonhuman,
creature_undead,
creature_underground
];


/*	////////////////////////////////////////////////////////////////////////////////

    --------------------------------------------------------------------------------
	
	COLORS
	================================================================================ */


var color = [
"Azure", 
"Cobalt", 
"Verdigris", 
"Pale", 
"Dark", 
"Dim", 
"Umber", 
"Amber", 
"Burgundy", 
"Crimson", 
"Ocher", 
"Rainbow", 
"Magenta", 
"Cyan", 
"Gray", 
"Black", 
"White", 
"Red", 
"Blue", 
"Green", 
"Orange", 
"Violet", 
"Yellow", 
"Sepia", 
"Cerulean", 
"Alizerin", 
"Ebon", 
"Veridian", 
"Dun"
];

/*	////////////////////////////////////////////////////////////////////////////////

    --------------------------------------------------------------------------------
	
	EMOTIVE
	================================================================================ */

var emotive_evil = [
"Creepy", 
"Vile", 
"Cursed", 
"Toxic", 
"Noxious", 
"Putrid", 
"Pitch Black", 
"Desecrated", 
"Awful", 
"Demonic", 
"Infernal", 
"Dire", 
"Grim", 
"Rancid", 
"Foul", 
"Dreary", 
"Abyssal", 
"Corrupted", 
"Contaminated", 
"Diabolic", 
"Cruel", 
"Wretched", 
"Fetid", 
"Unnatural", 
"Infested", 
"Sinister", 
"Suspicious", 
"Defiled", 
"Insidious", 
"Blackflame", 
"Dismal", 
"Gloomy", 
"Murky"
];


var emotive_good = [
"Celestial", 
"Holy", 
"Sacred", 
"Consecrated", 
"Pure", 
"Great", 
"Angelic", 
"Regal", 
"Heraldic", 
"Imperial", 
"Royal", 
"Blessed", 
"Ancestral", 
"Mystic", 
"Tranquil"
];


var emotive_neutral = [
"Weird", 
"Mysterious", 
"Cryptic", 
"Lunar", 
"Elder", 
"Fey", 
"Eldritch", 
"Lonely", 
"Strange", 
"Wonderous", 
"Arcane", 
"Enchanted", 
"Eerie", 
"Quiet", 
"Obscure", 
"Disenchanted", 
"Ingenious"
];

var emotive = [	
emotive_good, 
emotive_neutral, 
emotive_evil 
];

/*	////////////////////////////////////////////////////////////////////////////////

    --------------------------------------------------------------------------------
	
	MATERIAL
	================================================================================ */

var material_misc = [ 
"Alabaster",
"Bone", 
"Dung", 
"Sand", 
"Salt", 
"Glass",  
"Brimstone", 
"Sulpher", 
"Brine", 
"Ambergris",  
"Fungal", 
"Mud", 
"Pitch", 
"Sludge",  
"Parchment", 
"Woven", 
"Silk", 
"Wax", 
"Brick",  
"Ash", 
"Thatch", 
"Tar", 
"Porcelain", 
"Leather",  
"Slag", 
"Shale", 
"Coal",  
"Plaster",  
"Clay", 
"Straw",  
"Tephra", 
"Charcoal", 
"Lotus", 
"Papyrus",
"Muck", 
"Steam",  
"Smog", 
"Blood", 
"Fog", 
"Ice"
];

var saltwater_material = [ 
"Salt", 
"Glass",  					 
"Blood", 
"Fog",
"Brine",
"Ice",
"Silver",
"Emerald", 
"Jade", 
"Onyx", 
"Ruby",  
"Topaz", 
"Crystal",  
"Sapphire", 
"Amethyst",  
"Coral", 
"Ivory", 
"Turquoise", 
"Opal"
];

var material_stone = [
"Obsidian", 
"Granite", 
"Marble", 
"Flint", 
"Flowstone", 
"Limestone", 
"Sandstone", 
"Basalt",  
"Concrete", 
"Igneous", 
"Greenstone"
];

var material_metal = [ 
"Brass", 
"Copper", 
"Iron",  
"Silver", 
"Mithril", 
"Platinum", 
"Bronze",  
"Steel", 
"Gold", 
"Lead", 
"Alloy", 
"Adamantite"
];

var material_gemstone = [
"Emerald", 
"Jade", 
"Onyx", 
"Ruby",  
"Topaz", 
"Crystal",  
"Sapphire", 
"Amethyst", 
"Garnet", 
"Coral", 
"Beryl", 
"Lapis", 
"Ivory", 
"Turquoise", 
"Ambergris", 
"Opal", 
"Greenstone",
"Bloodstone"
];

var material_wood = [
"Oaken", 
"Cedar", 
"Ash", 
"Wooden", 
"Redwood", 
"Mahogany"
];


var material = [
material_wood,
material_gemstone,
material_metal,
material_stone,
material_misc
];

/*	////////////////////////////////////////////////////////////////////////////////

    --------------------------------------------------------------------------------
	
	CONDITION & EFFECT
	================================================================================ */

mountain_condition = [
"Grand",
"Pristine",
"Terraced",
"Shattered",
"Broken",
"Fallen",
"Crumbling",
"Splintered",
"Worn",
"Collapsed",
"Scorched",
"Unstable",
"Weathered",
"Warped",
"Rusty",
"Sunken",
"Tangled",
"Twisted",
"Tarnished",
"Sinking",
"Smoldering",
"Odious",
"Moldy",
"Eroded",
"Overgrown",
"Lost",
"Ancient",
"Bald",
"Hollow",
"Forgotten",
"Jagged",
"Cloudy",
"Foggy",
"Wrinkled",
"Mossy",
"Drifting",
"Looming",
"Lurking",
"Remote",
"Barbed",
"Shrouded",
"Thermal",
"Crested",
"Spined",
"Serrated",
"Forsaken",
"Dormant"
];

mountain_effect = [
"Glowing",
"Shimmering",
"Levitating",
"Wandering",
"Endless",
"Drifting",
"Radiant",
"Howling",
"Screaming",
"Inverted",
"Whispering",
"Frozen",
"Colossal",
"Cursed",
"Haunted",
"Withering",
"Creeping",
"Magnetic",
"Luminous",
"Irridescent",
"Jeweled",
"Ghostly",
"Caustic",
"Shifting",
"Whirling",
"Spiraling"
];


forest_condition = [
"Pristine",
"Shattered",
"Fallen",
"Splintered",
"Scorched",
"Decayed",
"Warped",
"Rotting",
"Sunken",
"Tangled",
"Twisted",
"Tarnished",
"Sinking",
"Smoldering",
"Flooded",
"Moldy",
"Eroded",
"Overgrown",
"Lost",
"Mottled",
"Ancient",
"Forgotten",
"Abandoned",
"Jagged",
"Cloudy",
"Foggy",
"Mossy",
"Barbed",
"Shrouded",
"Spined",
"Serrated",
"Forsaken",
"Nocturnal"
];

forest_effect = [
"Shimmering",
"Hidden",
"Ethereal",
"Floating",
"Wandering",
"Endless",
"Howling",
"Screaming",
"Poison",
"Whispering",
"Frozen",
"Cursed",
"Haunted",
"Withering",
"Creeping",
"Luminous",
"Polluted",
"Phantasmal",
"Ghostly",
"Primordial",
"Spectral"
];

swamp_condition = [
"Decayed",
"Rotting",
"Sunken",
"Tangled",
"Twisted",
"Sinking",
"Smoldering",
"Flooded",
"Odious",
"Moldy",
"Overgrown",
"Drained",
"Lost",
"Ancient",
"Forgotten",
"Foggy",
"Veiled",
"Mossy",
"Slippery",
"Remote",
"Dry",
"Squirming",
"Shrouded",
"Shallow",
"Forsaken",
"Nocturnal",

"Peat",
"Pitch",
"Mud",
"Sludge",
"Muddy",
"Stump"
];

swamp_effect = [
"Glowing",
"Shimmering",
"Endless",
"Howling",
"Screaming",
"Poison",
"Whispering",
"Cursed",
"Haunted",
"Withering",
"Creeping",
"Polluted",
"Ghostly",
"Caustic",
"Boiling",
"Primordial",
"Spectral"
];

hills_condition = [
"Terraced",
"Crumbling",
"Splintered",
"Worn",
"Scorched",
"Decayed",
"Weathered",
"Rotting",
"Sunken",
"Twisted",
"Sinking",
"Smoldering",
"Moldy",
"Eroded",
"Overgrown",
"Dusty",
"Lost",
"Bald",
"Hollow",
"Forgotten",
"Jagged",
"Foggy",
"Wrinkled",
"Mossy",
"Slippery",
"Remote",
"Dry",
"Shrouded",
"Crested",
"Forsaken"
];

hills_effect = [
"Glowing",
"Hidden",
"Wandering",
"Endless",
"Drifting",
"Howling",
"Screaming",
"Whispering",
"Frozen",
"Cursed",
"Haunted",
"Withering",
"Creeping",
"Hovering",
"Ghostly",
"Shifting"
];

tower_condition = [
"Grand",
"Ornate",
"Engraved",
"Warded",
"Concentric",
"Gilded",
"Sealed",
"Shattered",
"Broken",
"Fallen",
"Crumbling",
"Splintered",
"Collapsed",
"Scorched",
"Decayed",
"Weathered",
"Warped",
"Rotting",
"Rusty",
"Sunken",
"Tangled",
"Twisted",
"Tarnished",
"Sinking",
"Smoldering",
"Flooded",
"Pilfered",
"Moldy",
"Rusting",
"Dusty",
"Lost",
"Ancient",
"Forgotten",
"Abandoned",
"Jagged",
"Unfinished",
"Renovated",
"Repaired",
"Foggy",
"Veiled",
"Rebuilt",
"Mossy",
"Drifting",
"Looming",
"Remote",
"Barbed",
"Shrouded",
"Crested",
"Spined",
"Spiked",
"Serrated",
"Scaled",
"Forsaken",
"Cyclopean"
];

tower_effect = [
"Clockwork",
"Glowing",
"Shimmering",
"Hidden",
"Secret",
"Invisible",
"Ethereal",
"Floating",
"Levitating",
"Prismatic",
"Wandering",
"Drifting",
"Blinking",
"Radiant",
"Howling",
"Screaming",
"Burning",
"Electric",
"Spinning",
"Secure",
"Locked",
"Inverted",
"Whispering",
"Frozen",
"Cursed",
"Haunted",
"Creeping",
"Luminous",
"Iridescent",
"Hovering",
"Phantasmal",
"Jeweled",
"Trapped",
"Ghostly",
"Spectral",
"Whirling",
"Spiraling",
"Concealed"
];

ocean_condition = [
"Sunken",
"Squirming",
"Shallow"
];

ocean_effect = [
"Shimmering",
"Ethereal",
"Endless",
"Drifting",
"Howling",
"Cursed",
"Bottomless",
"Boiling"
];

lake_condition = [
"Pristine",
"Rotting",
"Sunken",
"Sinking",
"Smoldering",
"Flooded",
"Moldy",
"Eroded",
"Overgrown",
"Lost",
"Forgotten",
"Foggy",
"Veiled",
"Mossy",
"Remote",
"Dry",
"Shrouded",
"Thermal",

"Shallow",
"Forsaken"
];

lake_effect = [
"Glowing",
"Shimmering",
"Hidden",
"Prismatic",
"Screaming",
"Poison",
"Whispering",
"Frozen",
"Cursed",
"Haunted",
"Luminous",
"Polluted",
"Iridescent",
"Ghostly",
"Bottomless",
"Caustic",
"Boiling"
];

cave_condition = [
"Grand",
"Pristine",
"Terraced",
"Sealed",
"Fallen",
"Crumbling",
"Worn",
"Collapsed",
"Scorched",
"Unstable",
"Defaced",
"Weathered",
"Warped",
"Rotting",
"Rusty",
"Sunken",
"Twisted",
"Sinking",
"Smoldering",
"Flooded",
"Moldy",
"Eroded",
"Rusting",
"Overgrown",
"Leaking",
"Drained",
"Dusty",
"Lost",
"Forgotten",
"Abandoned",
"Foggy",
"Speckled",
"Veiled",
"Mossy",
"Slippery",
"Remote",
"Dry",
"Shrouded",
"Thermal",
"Shallow",
"Forsaken"
];

cave_effect = [
"Glowing",
"Shimmering",
"Hidden",
"Secret",
"Endless",
"Howling",
"Screaming",
"Whispering",
"Frozen",
"Colossal",
"Cursed",
"Haunted",
"Creeping",
"Luminous",
"Jeweled",
"Trapped",
"Ghostly",
"Bottomless",
"Caustic",
"Concealed"
];

mine_condition = [
"Sealed",
"Crumbling",
"Collapsed",
"Scorched",
"Unstable",
"Decayed",
"Defaced",
"Rotting",
"Sunken",
"Twisted",
"Sinking",
"Smoldering",
"Flooded",
"Moldy",
"Overgrown",
"Leaking",
"Dusty",
"Lost",
"Ancient",
"Forgotten",
"Abandoned",
"Unfinished",
"Renovated",
"Repaired",
"Veiled",
"Slippery",
"Remote",
"Dry",
"False",
"Shrouded",
"Shallow",
"Forsaken"
];

mine_effect = [
"Clockwork",
"Glowing",
"Shimmering",
"Hidden",
"Secret",
"Endless",
"Radiant",
"Howling",
"Locked",
"Whispering",
"Frozen",
"Colossal",
"Cursed",
"Haunted",
"Magnetic",
"Luminous",
"Polluted",
"Jeweled",
"Trapped",
"Ghostly",
"Caustic",
"Concealed",

"Exhausted",
"Plundered"
];

river_condition = [
"Grand",
"Pristine",
"Warped",
"Rotting",
"Sunken",
"Twisted",
"Sinking",
"Flooded",
"Moldy",
"Eroded",
"Overgrown",
"Drained",
"Lost",
"Foggy",
"Veiled",
"Mossy",
"Drifting",
"Remote",
"Dry",
"Squirming",
"Shrouded",
"Shallow",
"Forsaken"
];

river_effect = [
"Shimmering",
"Wandering",
"Endless",
"Poison",
"Whispering",
"Frozen",
"Cursed",
"Haunted",
"Creeping",
"Polluted",
"Caustic",
"Boiling"
];

temple_condition = [
"Grand",
"Ornate",
"Engraved",
"Gilded",
"Sealed",
"Shattered",
"Broken",
"Fallen",
"Crumbling",
"Splintered",
"Collapsed",
"Scorched",
"Decayed",
"Defaced",
"Weathered",
"Warped",
"Rotting",
"Rusty",
"Sunken",
"Tangled",
"Twisted",
"Tarnished",
"Sinking",
"Smoldering",
"Flooded",
"Moldy",
"Rusting",
"Overgrown",
"Lost",
"Ancient",
"Forgotten",
"Abandoned",
"Unfinished",
"Renovated",
"Repaired",
"Veiled",
"Rebuilt",
"Remote",
"Shrouded",
"Forsaken"
];

temple_effect = [
"Clockwork",
"Glowing",
"Shimmering",
"Hidden",
"Secret",
"Floating",
"Levitating",
"Radiant",
"Howling",
"Locked",
"Whispering",
"Frozen",
"Colossal",
"Cursed",
"Haunted",
"Creeping",
"Luminous",
"Iridescent",
"Hovering",
"Jeweled",
"Trapped",
"Ghostly",
"Whirling",
"Spiraling",
"Concealed"
];

canyon_condition = [
"Crumbling",
"Weathered",
"Rotting",
"Rusty",
"Sunken",
"Twisted",
"Sinking",
"Smoldering",
"Flooded",
"Moldy",
"Eroded",
"Overgrown",
"Dusty",
"Lost",
"Forgotten",
"Veiled",
"Mossy",
"Slippery",
"Remote",
"Dry",
"Shrouded",
"Shallow",
"Forsaken"
];

canyon_effect = [
"Hidden",
"Secret",
"Howling",
"Screaming",
"Whispering",
"Frozen",
"Colossal",
"Cursed",
"Haunted",
"Creeping",
"Luminous",
"Ghostly",
"Bottomless",
"Concealed"
];

/*
var condition_construction = [
"Unfinished", 
"Renovated", 
"Repaired",
"Abandoned",
"Rebuilt",
"Sealed",
"Concentric", 
"Terraced", 
"Geometric", 
"Gilded",
"Ornate", 
"Engraved", 
"Warded", 
"Sturdy"
];
*/
var condition_misc = [
"Dusty", 
"Lost", 
"Mottled", 
"Ancient", 
"Bald", 
"Hollow", 
"Balanced", 
"Forgotten", 
"Abandoned", 
"Jagged", 
"Dull", 
"Viscous", 
"Cloudy", 
"Greasy", 
"Unfinished", 
"Renovated", 
"Repaired", 
"Foggy", 
"Speckled", 
"Wrinkled", 
"Veiled", 
"Rebuilt", 
"Mossy", 
"Slippery", 
"Drifting", 
"Looming", 
"Lurking", 
"Remote", 
"Dry", 
"Squirming", 
"False ", 
"Barbed", 
"Shrouded", 
"Thermal", 
"Crested", 
"Spined", 
"Spiked", 
"Serrated", 
"Scaled", 
"Shallow", 
"Forsaken", 
"Dormant", 
"Nocturnal", 
"Cyclopean"
];

var condition_excellent = [
"Fine", 
"Grand", 
"Pristine", 
"Ornate", 
"Engraved", 
"Warded", 
"Sturdy", 
"Bright", 
"Concentric", 
"Terraced", 
"Geometric", 
"Gilded", 
"Sealed"
];

var condition_broken = [
"Shattered", 
"Broken", 
"Fallen", 
"Crumbling", 
"Flawed", 
"Faulty", 
"Splintered", 
"Chipped", 
"Worn", 
"Collapsed", 
"Scorched", 
"Unstable", 
"Decayed", 
"Defaced", 
"Weathered", 
"Warped", 
"Rotting", 
"Rusty", 
"Sunken", 
"Tangled", 
"Twisted", 
"Tarnished", 
"Sinking", 
"Smoldering", 
"Flooded", 
"Pilfered", 
"Odious", 
"Moldy", 
"Eroded", 
"Rusting", 
"Overgrown", 
"Leaking", 
"Drained"
];

var condition = [
condition_excellent,
condition_broken, 
condition_misc 
];

var effect = [
"Clockwork",
"Glowing", 
"Shimmering", 
"Hidden", 
"Secret", 
"Invisible", 
"Ethereal", 
"Floating", 
"Levitating", 
"Prismatic", 
"Wandering", 
"Singing", 
"Endless", 
"Drifting", 
"Blinking", 
"Jumping", 
"Radiant", 
"Giant", 
"Howling", 
"Screaming", 
"Chromatic", 
"Burning", 
"Blazing", 
"Charged", 
"Fiery", 
"Electric", 
"Acidic", 
"Poison", 
"Spinning", 
"Secure", 
"Locked", 
"Inverted", 
"Whispering", 
"Corrosive", 
"Frozen", 
"Colossal", 
"Cursed", 
"Haunted", 
"Dancing", 
"Withering", 
"Creeping", 
"Magnetic", 
"Albino", 
"Luminous", 
"Molten", 
"Polluted", 
"Iridescent", 
"Hovering", 
"Phantasmal", 
"Jeweled", 
"Trapped", 
"Voltaic", 
"Psionic", 
"Masterwork", 
"Temporal", 
"Ghostly", 
"Shrinking", 
"Bottomless", 
"Blinding", 
"Caustic", 
"Boiling", 
"Primordial", 
"Eternal", 
"Animated", 
"Spectral", 
"Shifting", 
"Hypnotic", 
"Explosive", 
"Blurry", 
"Shrunken", 
"Whirling", 
"Flickering", 
"Spiraling", 
"Concealed"
];

past_participle_adjective = [
"Weeping",
"Sleeping",
"Gasping",
"Waning",
"Wailing",
"Screeching",
"Glimmering",
"Writhing",
"Dancing", 
"Withering", 
"Creeping",
"Glowing", 
"Shimmering", 
"Floating", 
"Levitating",
"Wandering", 
"Singing",
"Drifting", 
"Blinking", 
"Jumping",
"Howling", 
"Screaming",
"Burning", 
"Blazing",
"Spinning",
"Whispering", 
"Whirling", 
"Flickering", 
"Spiraling",
"Shifting",
"Boiling", 
"Blinding",
"Shrinking",
"Hovering",
"Festering",
"Sinking", 
"Smoldering", 
"Leaking", 
"Crumbling",
"Rotting",
"Squirming",
"Drifting", 
"Looming", 
"Lurking"
];

tavern_participle_adjective = [
"Limping",
"Snorting",
"Stuttering"
];

tavern_participle = [
past_participle_adjective,
tavern_participle_adjective
];

// currently not used???
addtional_adjective = [
"Crystalline",
"Glacial",
"infernal",
"Elysian",
"Arcadian",
"Shattered",
"Opaque",
"Smooth",
"Chilled",
"Cryptic",
"Obscure",
"Lucid",
"Reinfornced",
"Ruined",
"Damaged",
"Decomposed",
"Stitched",
"Preserved",
"Polished",
"Fractured",
"Poisonous",
"Toxic", 
"Ashen",
"Forlorn",
"Dismal",
"Bleak",
"Sacramental",
"Solar",
"Lunar",
"Primal",
"Sacrificial",
"Malevolent",
"Fetid",
"Imperial",
"Empyrean",
"Murky",
"Elemental",
"Decrepit",
"Fermented",
"Abysmal",
"Erudite",
"Termagant",
"Unmarked",
"Infested",
"Derelict",
"Toadstool",
"Arcane",
"Lone",
"Lonely",
"Seven",
"Ten",
"Twelve",
"Fouled",
"Festering",
"Whispering",
"Vast",
"Cloven"
];

bridge_special_adjective = [
"Covered",
"Suspension",
"Rope",
"Toll",
"Log",
"Fallen Tree",
"Natural",
"Gargoyle",
"Chain",
"Ironwork",
"Arched",
"Stepping Stone"
];

tower_special_adjective = [
"Bell",
"Watch",
"Signal",
"Lookout"
];

//currently not used
dungeon_level_connection = [
"Stairs",
"Spiral Stairs",
"Elevator",
"Sloping Passage",
"Teleporter",
"Pit",
"Slide",
"Ladder"
];

stone_special_adjective = [
"Wedge",
"Standing",
"Chimney",
"Wart",
"Warp",
"Wrinkle",
"Riven",
"Whispering",
"Grave",
"Engraved",
"Portal",
"Spinning",
"Singing",
"Skimming",
"Leaning",
"Lode",
"Lift",
"Rune",
"Trail",
"Grind",
"Skipping",
"Moon",
"Speaking",
"Slippery",
"Balanced",
"Lookout",
"Stovepipe",
"Notch",
"Dome",
"Needle",
"Pedestal",
"Bald",
"Mushroom",
"Crevisse",
"Weird",
"Weeping",
"Chatter",
"Beetle",
"Brim",
"Float",
"Field",
"Drip",
"Sun",
"Mud",
"Touch",
"Stink",
"Smoke",
"Boil",
"Drifting",
"Mill",
"Gate",
"Helix",
"Spire",
"Alter",
"Wind",
"Calendar",
"Clock",
"Moon"
];

district_special_adjective = [
"Dock",
"High",
"Low",
"Lower",
"Jewel",
"Palace",
"Trade",
"Sea",
"Castle",
"River",
"Garden",
"Foreign",
"Thieves",
"Artisans",
"Slum",
"Park",
"Plaza",
"Temple",
"Noble",
"Uptown",
"Harbor",
"Festival",
"Market",
"Lantern",
"Shackles",
"Emerald",
"Crypt",
"Old",
"Night",
"Marble",
"Bellows",
"Cobbles"
];


/*	////////////////////////////////////////////////////////////////////////////////

    --------------------------------------------------------------------------------
	
	ADJECTIVE LISTS
	================================================================================ */
	
var base_adjective = [	
color, 
emotive, 
material, 
condition, 
effect,
creature
];

var natural_mountain_adjective = [
color, 
emotive, 
material, 
mountain_condition, 
mountain_effect,
creature
];

var natural_river_adjective = [
color, 
emotive, 
material, 
river_condition, 
river_effect,
creature
];

var natural_hills_adjective = [
color, 
emotive, 
material, 
hills_condition, 
hills_effect,
creature
];

var natural_woodlands_adjective = [
color, 
emotive, 
material, 
forest_condition, 
forest_effect,
creature
];

var natural_marshes_adjective = [
color, 
emotive, 
material, 
swamp_condition, 
swamp_effect,
creature
];

var natural_depression_adjective = [
color, 
emotive, 
material, 
canyon_condition, 
canyon_effect,
creature
];

var natural_underground_adjective = [
color, 
emotive, 
material, 
cave_condition, 
cave_effect,
creature
];

var natural_saltwater_adjective = [
color, 
emotive, 
saltwater_material,
ocean_condition, 
ocean_effect,
creature
];

var natural_stone_adjective = [
base_adjective,
stone_special_adjective,
stone_special_adjective
];

var construction_fortification_adjective = [
color, 
emotive, 
material, 
tower_condition, 
tower_effect,
creature
];

var construction_religious_adjective = [
color, 
emotive, 
material, 
temple_condition, 
temple_effect,
creature
];

var construction_underground_adjective = [
color, 
emotive, 
material, 
mine_condition, 
mine_effect,
creature
];

var construction_bridge_adjective = [
base_adjective,
bridge_special_adjective,
bridge_special_adjective
];

var construction_tower_adjective = [
base_adjective,
tower_special_adjective,
tower_special_adjective
];

var dungeon_room_adjective = [
dungeon_materials,
dungeon_objects,
dungeon_adjective,
dungeon_bridge_adjective,
dungeon_corridor_adjective,
dungeon_portal_adjective,
dungeon_stairway_adjective,
dungeon_pit_adjective
];

var tomb_room_adjective = [
tomb_objects,
//tomb_possessive,
tomb_adjective
];

var temple_room_adjective = [
temple_objects,
temple_adjective
];

var cavern_room_adjective = [
cavern_materials,
cavern_objects,
cavern_adjective
];

var magical_room_adjective = [
magical_materials,
magical_objects,
magical_adjective
];