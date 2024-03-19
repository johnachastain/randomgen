
/*	////////////////////////////////////////////////////////////////////////////////

    --------------------------------------------------------------------------------
	
	PERSON
	================================================================================ */

var person_misc = [
"Fidget",
"Maggot",
"Dead Man",
"Hermit", 
"Fool",
"Special Guest",
"Guest"
];

var person_ruler = [
"King",
"Queen",
"Lord", 
"Duke"
];

var person_entertainer = [
"Minstrel",
"Jester"
];

var person_worker = [
"Cook",
"Servant",
"Maid",
"Fletcher" 
];

var person_warrior = [
"Archer",
"Guardian",
"Rogue"
];

var person_religious = [
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

var person_magical = [
"Wizard",
"Sorceror",
"Apprentice",
"Alchemist",
"Advisor"
];


var person = [
person_magical,
person_religious,
person_warrior,
person_worker,
person_entertainer,
person_ruler,
person_misc
];


var possessive = [
person,
creature
];

//currently not used
var possessive_suffix = [
"Crossing",
"Gaunlet",
"Watch",
"Sorrow",
"Folly",
"Run"
];

var relative = [
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

var the = [
"The"
];

var optional_adjective = [ 
relative, 
the
];

var prefix_mundane = [
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

var prefix_evil = [
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

var prefix_good = [
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

var suffix_evil = [
"Finger",
"Fist",
"Talon",
"Spawn",
"Dark"
];

var suffix_good = [
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


/*	////////////////////////////////////////////////////////////////////////////////

    --------------------------------------------------------------------------------
	
	ABSTRACTIONS
	================================================================================ */


var abstraction = [
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

/*	////////////////////////////////////////////////////////////////////////////////

    --------------------------------------------------------------------------------
	
	OBJECTS
	================================================================================ */
	
var objects = [			   
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

var objects_body = [			   
"Eye", 
"Hand",
"Talon",
"Fang",
"Skull",
"Mind",
"Corpse"
];

var objects_container = [			   
"Jar", 
"Urn"
];

var objects_magic = [			    			   
"Rune",  
"Glyph", 
"Talisman", 
"Pentacle"
];

var objects_weapon = [			    
"Sword",
"Helm",
"Shield",
"Spike", 
"Glaive"
];

var objects_clothing = [			   
"Shroud", 
"Cloak"
];


var objects_celestial = [			   ,
"Moon", 
"Sun",
"Star"
];


var tavern_objects = [
person,
creature,
objects
];

/*	////////////////////////////////////////////////////////////////////////////////

    --------------------------------------------------------------------------------
	
	PREFIX SUFFIX
	================================================================================ */

var prefixes = [	
color, 
material, 
objects, 
creature,
prefix_good,
prefix_evil,
prefix_mundane
];

var suffixes = [	
objects, 
creature,
prefix_good,
prefix_evil,
suffix_good,
suffix_evil,
prefix_mundane
];

/*	////////////////////////////////////////////////////////////////////////////////

    --------------------------------------------------------------------------------
	
	PREPOSITIONAL
	================================================================================ */


var prepositional_singular = [	
material_misc,
abstraction
];

var prepositional_plural = [	
objects, 
creature,
construction_artifact
];


var tomb_prepositional = [
creature_undead,
tomb_objects,
abstraction
];

var temple_prepositional = [
person_religious,
temple_objects,
abstraction
];

var cavern_prepositional = [
creature,
cavern_objects,
cavern_materials,
abstraction
];

var dungeon_prepositional = [
person,
creature,
dungeon_objects,
dungeon_materials,
abstraction
];

var magical_prepositional = [
person_magical,
magical_objects,
magical_materials,
abstraction
];


/*	////////////////////////////////////////////////////////////////////////////////

    --------------------------------------------------------------------------------
	
	SPECIAL SUFFIX
	================================================================================ */

var suffix_river = [
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

var suffix_forest = [
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


var suffix_mountain = [
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

var prefix_mountain = [
"Mount"
];

var prefix_fortification = [
"Fort",
"Castle"
];

var special_suffix_town = [
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

var suffix_town = [
special_suffix_town,
suffixes
];

/*	////////////////////////////////////////////////////////////////////////////////

    --------------------------------------------------------------------------------
	
	SPECIAL ARRAYS
	================================================================================ */

var special_arrays = [
{type: "base"},
{type: "natural"},
{type: "natural_mountain", 
	prefix: prefix_mountain, 
	suffix: suffix_mountain, 
	adjective: natural_mountain_adjective 
},
{type: "natural_hills", 
	adjective: natural_hills_adjective 
},
{type: "natural_river", 
	suffix: suffix_river, 
	adjective: natural_river_adjective 
},
{type: "natural_freshwater", 
	suffix: suffix_river, 
	adjective: natural_river_adjective 
}, 
{type: "natural_woodlands", 
	suffix: suffix_forest, 
	adjective: natural_woodlands_adjective 
}, 
{type: "natural_highlands", 
	suffix: suffix_mountain, 
	adjective: natural_mountain_adjective 
},
{type: "natural_saltwater", 
	adjective: natural_saltwater_adjective 
},
{type: "natural_underground", 
	adjective: natural_underground_adjective 
},
{type: "natural_depression", 
	adjective: natural_depression_adjective 
},
{type: "natural_marshes", 
	adjective: natural_marshes_adjective 
},
{type: "natural_desert"},
{type: "natural_misc"},
{type: "construction"},
{type: "construction_town", 
	suffix: suffix_town 
},
{type: "construction_underground", 
	adjective: construction_underground_adjective 
},
{type: "construction_religious", 
	adjective: construction_religious_adjective 
},
{type: "construction_fortification", 
	prefix: prefix_fortification, 
	adjective: construction_fortification_adjective 
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
	adjective: construction_bridge_adjective 
},
{type: "construction_tower", 
	adjective: construction_tower_adjective 
},
{type: "political_district", 
	adjective: district_special_adjective 
},
{type: "dungeon_room", 
	adjective: dungeon_room_adjective, 
	prepositional: dungeon_prepositional, 
	unique:dungeon_unique  
},
{type: "tomb_room", 
	adjective: tomb_room_adjective, 
	possessive: creature_undead, 
	prepositional: tomb_prepositional   
},
{type: "temple_room", 
	adjective: temple_room_adjective, 
	possessive: person_religious, 
	prepositional: temple_prepositional   
},
{type: "cavern_room", 
	adjective: cavern_room_adjective, 
	possessive: creature, 
	prepositional: cavern_prepositional, 
	unique: cavern_unique 
},
{type: "magical_room", 
	adjective: magical_room_adjective, 
	possessive: person_magical, 
	prepositional: magical_prepositional,
	unique:magical_unique
}
];

var natural_type = [
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

var any_dungeon_type = [
"tomb_room",
"temple_room",
"cavern_room",
"magical_room",
"dungeon_room"
];

var construction_type = [
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

var base_type = [
natural_type,
construction_type
];