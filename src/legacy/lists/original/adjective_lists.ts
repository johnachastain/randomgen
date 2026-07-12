import * as baseLists from './base_lists'
import * as deityLists from './deity_lists'
import * as dungeonLists from './dungeon_rooms'
import * as miscLists from './misc_lists'

export const allLists = { 
  // ...baseLists, 
  ...deityLists, 
  ...dungeonLists, 
  // ...miscLists 
}

// CREATURES

export const creature_underground = [
"Troglodyte",
"Drow",
"Carrion Crawler",
"Piercer"

];

export const creature_undead = [
"Skeleton",	
"Zombie",
"Ghoul",
"Ghost",
"Wight",
"Wraith",
"Spectre"
];

export const creature_nonhuman = [
"Dwarf",
"Elf",
"Gnome",
"Halfing",
"Drow"
];

export const creature_goblinoid = [
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

export const creature_animal = [
"Rat",
"Raven",
"Frog", 
"Serpent",
"Leech",
"Bat",
"Bear"
];

export const creature_insect = [
"Spider",
"Ant"
];

export const creature_medium = [
"Gargoyle",	
"Golem", 
"Demon",
"Devil",
"Carrion Crawler"
];

export const creature_big = [
"Dragon",
"Wyrm", 
"Sphinx",
"Hydra",
"Griffon",
"Giant"
];

export const creature_small = [
"Imp",
"Spore",
"Stirge",
"Piercer"
];


export const creature = [
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


// COLORS


export const color = [
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

// EMOTIVE

export const emotive_evil = [
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


export const emotive_good = [
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


export const emotive_neutral = [
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

export const emotive = [	
emotive_good, 
emotive_neutral, 
emotive_evil 
];

// MATERIAL

export const material_misc = [ 
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

export const saltwater_material = [ 
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

export const material_stone = [
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

export const material_metal = [ 
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

export const material_gemstone = [
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

export const material_wood = [
"Oaken", 
"Cedar", 
"Ash", 
"Wooden", 
"Redwood", 
"Mahogany"
];


export const material = [
material_wood,
material_gemstone,
material_metal,
material_stone,
material_misc
];

// CONDITION & EFFECT

export const mountain_condition = [
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

export const mountain_effect = [
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


export const forest_condition = [
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

export const forest_effect = [
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

export const swamp_condition = [
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

export const swamp_effect = [
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

export const hills_condition = [
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

export const hills_effect = [
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

export const tower_condition = [
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

export const tower_effect = [
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

export const ocean_condition = [
"Sunken",
"Squirming",
"Shallow"
];

export const ocean_effect = [
"Shimmering",
"Ethereal",
"Endless",
"Drifting",
"Howling",
"Cursed",
"Bottomless",
"Boiling"
];

export const lake_condition = [
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

export const lake_effect = [
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

export const cave_condition = [
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

export const cave_effect = [
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

export const mine_condition = [
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

export const mine_effect = [
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

export const river_condition = [
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

export const river_effect = [
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

export const temple_condition = [
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

export const temple_effect = [
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

export const canyon_condition = [
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

export const canyon_effect = [
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
export const condition_construction = [
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
export const condition_misc = [
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

export const condition_excellent = [
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

export const condition_broken = [
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

export const condition = [
condition_excellent,
condition_broken, 
condition_misc 
];

export const effect = [
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

export const past_participle_adjective = [
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

export const tavern_participle_adjective = [
"Limping",
"Snorting",
"Stuttering"
];

export const tavern_participle = [
past_participle_adjective,
tavern_participle_adjective
];

// currently not used???
export const addtional_adjective = [
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

export const bridge_special_adjective = [
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

export const tower_special_adjective = [
"Bell",
"Watch",
"Signal",
"Lookout"
];

//currently not used
export const dungeon_level_connection = [
"Stairs",
"Spiral Stairs",
"Elevator",
"Sloping Passage",
"Teleporter",
"Pit",
"Slide",
"Ladder"
];

export const stone_special_adjective = [
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

export const district_special_adjective = [
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


// ADJECTIVE LISTS
	
export const base_adjective = [	
color, 
emotive, 
material, 
condition, 
effect,
creature
];

export const natural_mountain_adjective = [
color, 
emotive, 
material, 
mountain_condition, 
mountain_effect,
creature
];

export const natural_river_adjective = [
color, 
emotive, 
material, 
river_condition, 
river_effect,
creature
];

export const natural_hills_adjective = [
color, 
emotive, 
material, 
hills_condition, 
hills_effect,
creature
];

export const natural_woodlands_adjective = [
color, 
emotive, 
material, 
forest_condition, 
forest_effect,
creature
];

export const natural_marshes_adjective = [
color, 
emotive, 
material, 
swamp_condition, 
swamp_effect,
creature
];

export const natural_depression_adjective = [
color, 
emotive, 
material, 
canyon_condition, 
canyon_effect,
creature
];

export const natural_underground_adjective = [
color, 
emotive, 
material, 
cave_condition, 
cave_effect,
creature
];

export const natural_saltwater_adjective = [
color, 
emotive, 
saltwater_material,
ocean_condition, 
ocean_effect,
creature
];

export const natural_stone_adjective = [
base_adjective,
stone_special_adjective,
stone_special_adjective
];

export const construction_fortification_adjective = [
color, 
emotive, 
material, 
tower_condition, 
tower_effect,
creature
];

export const construction_religious_adjective = [
color, 
emotive, 
material, 
temple_condition, 
temple_effect,
creature
];

export const construction_underground_adjective = [
color, 
emotive, 
material, 
mine_condition, 
mine_effect,
creature
];

export const construction_bridge_adjective = [
base_adjective,
bridge_special_adjective,
bridge_special_adjective
];

export const construction_tower_adjective = [
base_adjective,
tower_special_adjective,
tower_special_adjective
];

export const dungeon_room_adjective = [
allLists.dungeon_materials,
allLists.dungeon_objects,
allLists.dungeon_adjective,
allLists.dungeon_bridge_adjective,
allLists.dungeon_corridor_adjective,
allLists.dungeon_portal_adjective,
allLists.dungeon_stairway_adjective,
allLists.dungeon_pit_adjective
];

export const tomb_room_adjective = [
allLists.tomb_objects,
//tomb_possessive,
allLists.tomb_adjective
];

export const temple_room_adjective = [
  allLists.temple_objects,
  allLists.temple_adjective
];

export const cavern_room_adjective = [
  allLists.cavern_materials,
  allLists.cavern_objects,
  allLists.cavern_adjective
];

export const magical_room_adjective = [
  allLists.magical_materials,
  allLists.magical_objects,
  allLists.magical_adjective
];