import * as deityLists from './deity_lists'
import * as dungeonLists from './dungeon_rooms'
import * as baseLists from './base_lists'
import * as adjLists from './adjective_lists'

const allLists = { 
  ...deityLists, 
  ...dungeonLists, 
  // ...baseLists, 
  ...adjLists 
}

// PERSON

export const person_misc = [
"Fidget",
"Maggot",
"Dead Man",
"Hermit", 
"Fool",
"Special Guest",
"Guest"
];

export const person_ruler = [
"King",
"Queen",
"Lord", 
"Duke"
];

export const person_entertainer = [
"Minstrel",
"Jester"
];

export const person_worker = [
"Cook",
"Servant",
"Maid",
"Fletcher" 
];

export const person_warrior = [
"Archer",
"Guardian",
"Rogue"
];

export const person_religious = [
"Druid", 
"Martyr",
"Monk", 
"Templar",
"Shamen",
"Scribe",
"Priest",
"Adept",
"Acolyte",
"Scrivner"
];

export const person_magical = [
"Wizard",
"Sorceror",
"Apprentice",
"Alchemist",
"Advisor"
];


export const person = [
person_magical,
person_religious,
person_warrior,
person_worker,
person_entertainer,
person_ruler,
person_misc
];


export const possessive = [
person,
// allLists.creature
];

//currently not used
export const possessive_suffix = [
"Crossing",
"Gaunlet",
"Watch",
"Sorrow",
"Folly",
"Run"
];

export const relative = [
"Greater", 
"Lesser", 
"Inner", 
"Outer", 
"Upper", 
"Lower", 
"Eastern", 
"Western", 
"Northern", 
"Southern", 
"Old", 
"Elder", 
"Far",
"Deep",
"High"
];

export const the = [
"The"
];

export const optional_adjective = [ 
relative, 
the
];

export const prefix_mundane = [
// need more mundane terms to add to the vivid fantasy elements in other lists.
"Stump",
"Cricket",
"Mouse",
"Thistle",
"Cobble",
"Thatch",
"Puddle",
"Gnat",
"Moth",
"Owl",
"Grog",
"Farm"
];

export const prefix_evil = [
"Ash",
"Ashen",
"Ashen",
"Bane",
"Bitter",
"Blight",
"Blight",
"Blood",
"Bone",
"Carrion",
"Dark",
"Dead",
"Demon",
"Dire",
"Dirt",
"Doom",
"Dread",
"Fang",
"Fell",
"Fire",
"Frost",
"Gallow",
"Ghoul",
"Gloom",
"Gore",
"Grim",
"Guant",
"Hack",
"Havoc",
"Imp",
"Marrow",
"Mire",
"Murk",
"Plague",
"Raven",
"Riven",
"Rot",
"Sever",
"Shadow",
"Shiver",
"Spawn",
"Thorn",
"Torn",
"Winter",
"Woe",
"Wraith",
"Wraith",
"Wyrm",
"Swarm",
"Witch"
];

export const prefix_good = [
"Soul",
"Star",
"Spell",
"Heart",
"Stone",
"Shard",
"Feather",
"Far",
"Moon",
"Elder",
"Old",
"Storm",
"Rune",
"Dagger",
"Sigil",
"Mist",
"Wind",
"Moss",
"Well",
"Ever",
"Ember"
];

export const suffix_evil = [
"Finger",
"Fist",
"Talon",
"Spawn",
"Dark"
];

export const suffix_good = [
"Hand",
"Shield",
"Song",
"Spire",
"Edge",
"Warden",
"Stone",
"Root",
"Guard",
"Water",
"Ever",
"Wind",
"Forge",
"Watch",
"Hold"
];


// ABSTRACTIONS

export const abstraction = [
"Blight", 
"Hate", 
"Malice", 
"Ire", 
"Carnage", 
"Envy", 
"Truth", 
"Knowledge",
"Discord",
"Dread",
"Lies", 
"Weakness",
"Woe",
"Gore",
"Greed",
"Stench", 
"Healing", 
"Strength", 
"Wisdom", 
"Might",
"Remedy", 
"Memory", 
"Mana", 
"Life", 
"Lore",
"Regeneration", 
"Summoning",
"Mercy", 
"Perception", 
"Vision", 
"Protection",
"Balance", 
"Storms", 
"Tears", 
"Steam", 
"Gravity",  
"Silence",  
"Whisper", 
"Sleep", 
"Disruption", 
"Magnetism", 
"Eclipse",
"Zenith",
"Distortion",
"Eternal Return",
"Merriment",
"Echo",
"Fatique"
];

// OBJECTS
	
export const objects = [			   
"Eye", 
"Hand",
"Talon",
"Fang",
"Skull",
"Mind",
"Corpse",
"Glacier",
"Moon", 
"Sun",
"Star",
"Venom", 			   
"Rune", 
"Shroud", 
"Cloak", 
"Glyph", 
"Sword", 
"Thorn",
"Flame", 
"Shadow", 
"Fire", 
"Lantern", 
"Slime", 
"Leaf", 
"Chord",
"Chain",
"Talisman", 
"Pentacle",
"Orb",
"Sphere",
"Egg", 
"Candle", 
"Lens", 
"Shield",
"Jar", 
"Urn",
"Spike", 
"Gem",
"Rose",
"Junk",
"Void",
"Glaive"
];

export const objects_body = [			   
"Eye", 
"Hand",
"Talon",
"Fang",
"Skull",
"Mind",
"Corpse"
];

export const objects_container = [			   
"Jar", 
"Urn"
];

export const objects_magic = [			    			   
"Rune",  
"Glyph", 
"Talisman", 
"Pentacle"
];

export const objects_weapon = [			    
"Sword",
"Helm",
"Shield",
"Spike", 
"Glaive"
];

export const objects_clothing = [			   
"Shroud", 
"Cloak"
];


export const objects_celestial = [			   ,
"Moon", 
"Sun",
"Star"
];


export const tavern_objects = [
person,
// allLists.creature,
objects
];

// PREFIX SUFFIX

export const prefixes = [	
// allLists.color, 
// allLists.material, 
objects, 
// allLists.creature,
prefix_good,
prefix_evil,
prefix_mundane
];

export const suffixes = [	
objects, 
// allLists.creature,
prefix_good,
prefix_evil,
suffix_good,
suffix_evil,
prefix_mundane
];

// PREPOSITIONAL

export const prepositional_singular = [	
// allLists.material_misc,
abstraction
];

export const prepositional_plural = [	
objects, 
// allLists.creature,
// allLists.construction_artifact
];


export const tomb_prepositional = [
// allLists.creature_undead,
// allLists.tomb_objects,
abstraction
];

export const temple_prepositional = [
person_religious,
// allLists.temple_objects,
abstraction
];

export const cavern_prepositional = [
// allLists.creature,
// allLists.cavern_objects,
// allLists.cavern_materials,
abstraction
];

export const dungeon_prepositional = [
person,
// allLists.creature,
// allLists.dungeon_objects,
// allLists.dungeon_materials,
abstraction
];

export const magical_prepositional = [
person_magical,
// allLists.magical_objects,
// allLists.magical_materials,
abstraction
];


// SPECIAL SUFFIX

export const suffix_river = [
"flow", 
"water", 
"tears", 
"blood", 
"wine", 
"mere", 
"ford", 
"falls", 
"meade", 
"grog",
"spring",
"tide",
"wash"
];

export const suffix_forest = [
"wood", 
"leaf", 
"root", 
"tree", 
"thorn", 
"willow", 
"oak", 
"wort", 
"weed", 
"cedar",
"bark"
];


export const suffix_mountain = [
"wall", 
"stone", 
"horn", 
"spur", 
"rock", 
"tooth", 
"spine", 
"teeth", 
"talon", 
"cap",
"top"
];

export const prefix_mountain = [
"Mount"
];

export const prefix_fortification = [
"Fort",
"Castle"
];

export const special_suffix_town = [
"well", 
"wall", 
"wich", 
"wold", 
"wald", 
"ton", 
"town", 
"glen", 
"heim", 
"wort", 
"ward", 
"ham", 
"berg", 
"gard", 
"watch", 
"port", 
"gate", 
"brair", 
"home", 
"holm", 
"haven", 
"shire", 
"keep", 
"stone", 
"heart", 
"hall", 
"bury", 
"falls", 
"ford", 
"helm", 
"mere", 
"mill",
"hollow",
"burrow",
"barrow",
"cliff",
"guard",
"water",
"bluff",
"dorf",
"field",
"fens",
"bog",
"moor",
"delve",
"watch",
"wick",
"wart",
"moot",
"dell",
"fell",
"minster",
"stein",
"ville",
"borough",
"vale",
"dale",
"end"
];

export const suffix_town = [
special_suffix_town,
suffixes
];

// SPECIAL ARRAYS

export type specialArray = {
  type?: any,
  prefix?: any,
  suffix?: any,
  adjective?: any,
  prepositional?: any,
  possessive?: any,
  unique?: any,
}

export const special_arrays: any = [
{type: "base"},
{type: "natural"},
{type: "natural_mountain", 
	prefix: prefix_mountain, 
	suffix: suffix_mountain, 
	adjective: allLists.natural_mountain_adjective 
},
{type: "natural_hills", 
	adjective: allLists.natural_hills_adjective 
},
{type: "natural_river", 
	suffix: suffix_river, 
	adjective: allLists.natural_river_adjective 
},
{type: "natural_freshwater", 
	suffix: suffix_river, 
	adjective: allLists.natural_river_adjective 
}, 
{type: "natural_woodlands", 
	suffix: suffix_forest, 
	adjective: allLists.natural_woodlands_adjective 
}, 
{type: "natural_highlands", 
	suffix: suffix_mountain, 
	adjective: allLists.natural_mountain_adjective 
},
{type: "natural_saltwater", 
	adjective: allLists.natural_saltwater_adjective 
},
{type: "natural_underground", 
	adjective: allLists.natural_underground_adjective 
},
{type: "natural_depression", 
	adjective: allLists.natural_depression_adjective 
},
{type: "natural_marshes", 
	adjective: allLists.natural_marshes_adjective 
},
{type: "natural_desert"},
{type: "natural_misc"},
{type: "construction"},
{type: "construction_town", 
	suffix: suffix_town 
},
{type: "construction_underground", 
	adjective: allLists.construction_underground_adjective 
},
{type: "construction_religious", 
	adjective: allLists.construction_religious_adjective 
},
{type: "construction_fortification", 
	prefix: prefix_fortification, 
	adjective: allLists.construction_fortification_adjective 
},
{type: "construction_funerary"},
{type: "construction_artifact"},
{type: "construction_shelter"},
{type: "construction_mechanical"},
{type: "construction_security"},
{type: "construction_misc"},
{type: "construction_freshwater"},
{type: "construction_city"},
{type: "construction_bridge", 
	adjective: allLists.construction_bridge_adjective 
},
{type: "construction_tower", 
	adjective: allLists.construction_tower_adjective 
},
{type: "political_district", 
	adjective: allLists.district_special_adjective 
},
{type: "dungeon_room", 
	adjective: allLists.dungeon_room_adjective, 
	prepositional: dungeon_prepositional, 
	unique: allLists.dungeon_unique  
},
{type: "tomb_room", 
	adjective: allLists.tomb_room_adjective, 
	possessive: allLists.creature_undead, 
	prepositional: tomb_prepositional   
},
{type: "temple_room", 
	adjective: allLists.temple_room_adjective, 
	possessive: person_religious, 
	prepositional: temple_prepositional   
},
{type: "cavern_room", 
	adjective: allLists.cavern_room_adjective, 
	possessive: allLists.creature, 
	prepositional: cavern_prepositional, 
	unique: allLists.cavern_unique 
},
{type: "magical_room", 
	adjective: allLists.magical_room_adjective, 
	possessive: person_magical, 
	prepositional: magical_prepositional,
	unique: allLists.magical_unique
}
];

export const natural_type = [
"natural_mountain",
"natural_hills",
"natural_river",
"natural_freshwater", 
"natural_woodlands",
"natural_highlands",
"natural_saltwater",
"natural_underground",
"natural_depression",
"natural_marshes",
"natural_desert",
"natural_misc",
"natural_stone"
];

export const any_dungeon_type = [
"tomb_room",
"temple_room",
"cavern_room",
"magical_room",
"dungeon_room"
];

export const construction_type = [
"construction_underground",
"construction_religious",
"construction_fortification",
"construction_funerary",
"construction_artifact",
"construction_shelter",
"construction_mechanical",
"construction_security",
"construction_misc",
"construction_freshwater",
"construction_tower",
"construction_bridge",
"construction_tavern"
];

export const base_type = [
natural_type,
construction_type
];