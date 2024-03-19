
/*	////////////////////////////////////////////////////////////////////////////////

    --------------------------------------------------------------------------------
	
	TOMB
	================================================================================ */
	
var tomb_adjective = [
"Empty",
"False",
"Burial",
"Haunted",
"Trapped",
"Ceremonial",
"Entry",
"Sealed",
"Upper",
"Lower"
];

var tomb_objects = [
"Sepulcher",
"Bone",
"Skeleton",
"Darkness",
"Skull",
"Remains",
"Offering",
"Armored Skeleton",
"Buried Treasure",
"Sleeping Kings",
"Sarcophagus",
"Pit"
];
/*
var tomb_possessive = [
"Ghoul",
"Spectre"
];
*/


/*	////////////////////////////////////////////////////////////////////////////////

    --------------------------------------------------------------------------------
	
	TEMPLE
	================================================================================ */

var temple_adjective = [
"Waiting",
"Violet",
"Torture",
"Terraced",
"Tapestry",
"Storage",
"Robing",
"Reception",
"Pillared",
"Meditation",
"Marble",
"Large",
"Inner",
"Outer",
"Vaulted",
"Divination",
"Domed",
"Augury",
"Audience",
"Arched",
"Abandoned",
"Columned",
"Ancestral",
"Processional"
];

var temple_objects = [
"Ziggarut",
"Wine",
"Treasure",
"Stupa",
"Statueary",
"Statue",
"Pyramid",
"Pool",
"Pipe Organ",
"Obelisk",
"Incense",
"Idol",
"Mosaic",
"Dome",
"Dolmen",
"Distillary",
"Silver Chains",
"Candle",
"Arch",
"Alter",
"Hundred Candles"
];
/*
var temple_possessive = [
"Special Guest",
"Guest",
"Shamen",
"Scribe",
"Priest",
"Gargoyle",
"Adept",
"Acolyte"
];
*/
var temple_special_rooms = [
"Vestibule",
"Vestry",
"Sanctuary",
"Shrine",
"Refectory",
"Promenade",
"Transept",
"Offeratorium",
"Office",
"Oratorium",
"Pavillion",
"Nave",
"Court",
"Library",
"Hall",
"Sanctum",
"Herbarium",
"Foyer",
"Chantry",
"Choir Loft",
"Balcony",
"Beastiary",
"Archives",
"Annex",
"Antechamber",
"Apse",
"Arcade (of Pillars)",
"Alcove",
"Cloister",
"Chapel"
];



/*	////////////////////////////////////////////////////////////////////////////////

    --------------------------------------------------------------------------------
	
	CAVERNS
	================================================================================ */
/*	
var cavern_possessive = [
"Ant",
"Bat",
"Bear",
"Carrion Crawlers",
"Minotaur",
"Spider",
"Devil",
"Hobgoblin",
"Hydra",
"Ogre",
"Piercer",
"Special Visitor",
"Stirge",
"Troglodyte",
"Troll"
];
*/
var cavern_materials = [
"Coral",
"Algae",
"Basalt",
"Bone",
"Carnelian",
"Clay",
"Crystal",
"Ice",
"Flowstone",
"Fungus",
"Gypsum",
"Sand",
"Slate",
"Steam",
"Water"
];

var cavern_objects = [
"Minaret",
"Waterfall",
"Spring",
"Bridge",
"Artifact",
"Bone",
"Boulder",
"Many Candles",
"Glowing Skull",
"Skull",
"Corpse",
"Cave Pearl",
"Coffin",
"Crystal",
"Distillery",
"Engraving",
"Formation",
"Gem",
"Demon Idol",
"Magic Pool",
"Moat",
"Pit",
"Pool",
"Ice Cube",
"Rune",
"Sewer",
"Sinkhole",
"Stream",
"Trapdoor",
"Volcano",
"Weapon"
];

var cavern_adjective = [
"Winding",
"Wide",
"Wet",
"Water Filled",
"Upper",
"Splendid",
"Narrow",
"Monotonous",
"Lower",
"Inclined",
"Gothic",
"Forgotten",
"Dark",
"Collapsed",
"Grinding",
"Dripping",
"Frostwork",
"Arched",
"Attic",
"Blast",
"Blue Sky",
"Blue Velvet",
"Burrowed",
"Cascade",
"Cathedral",
"Charred and Burned",
"Communal",
"Damp",
"Deserted",
"Dismal",
"Secret",
"Deep",
"Domed",
"Vaulted",
"Dry",
"Empty",
"Engraved",
"Entry",
"Exit",
"Fire",
"Flooding",
"Frescoed",
"Glittering",
"Glowing",
"Grey",
"Guard",
"Hidden",
"Huge",
"Vast",
"Infernal",
"Irregular",
"Jagged",
"Jeweled",
"Littered",
"Long",
"Low Cieling",
"Misty",
"Mouning",
"Mudslide",
"Narrow",
"Pillared",
"Rotunda",
"Scar",
"Sealed",
"Shattered",
"Side",
"Singing",
"Slippery",
"Small",
"Smoke Filled",
"Smooth",
"Spur",
"Statueary",
"Stinking",
"Storage",
"Streaked",
"Sunken",
"Terraced",
"Wind",
"Wishbone"
];
/*
var cavern_abstract = [
"Fatique"
];
*/
var cavern_special_rooms = [
"Culvert",
"Catacombs",
"Rift",
"Labyrinth",
"Crawlway",
"Corkscrew",
"Alcove",
"Antecavern",
"Barrow",
"Cavity",
"Chasm",
"Crevasse",
"Hollow",
"Grotto",
"Loft",
"Attic",
"Cellar",
"Balcony",
"Ballroom",
"Ravine",
"Sewers",
"Gallery"
];

var cavern_room_unique = [
//"Yellow Brick Road",
"The Button Hole",
"Rathole",
"Escape Tunnel",
"Exhaust Pipe",
"Borehole",
"Belfry",
"Chandelier Ballroom",
"Natural Bridge",
"Virgin Forest",
"Ammonia Cave (Bat Colony)",
"Boneyard",
"Boulder Choke",
"Boulder Heap",
"Cave Warrens",
"Cavern Barracks",
"Cavern Hall",
"Cave Chamber",
"Cavern Temple",
"Coral Grove",
"Crystal Gardens",
"Crystal Grotto",
"Crystal Pool",
"Death Valley",
"Deep Sea Room",
"Deep Secrets",
"Devil's Ice Box",
"Dismal Hollow",
"Eastern Eerie",
"Elfin Forest",
"Fairy Grotto",
"Firecaverns",
"Ghost Town",
"Giant's Hallway",
"Glacier Way",
"Grand Entry",
"Great Beyond",
"Helictite Hall",
"Hidden Loft",
"Infernal Regions",
"Jungle Room",
"Kennel Cave",
"Kitchen Cave",
"Land of Awes",
"Lava Pool",
"Lost Wax Room",
"Lost World Cave",
"Menagerie",
"Mummy's Niche",
"Nirvana",
"North Rift",
"Oasis",
"Prison Cave",
"Rainbow Cavern",
"Seleotherm Gallery",
"South Rift",
"Spillway",
"Stalagmite Forest",
"Storm Shelter",
"Stream Crossing",
"Stream View",
"Whale's Stomach"
];


var cavern_water_special_rooms = [
"Waterfall",
"Spring",
"Falls"
];

var cavern_water_unique = [
"Underground River",
"Echo River",
"Boulder Falls",
"Noisy Water Cave",
"Bridal Veil Falls",
"Underground Lake",
"Underground Reservoir",
"Lake of the Blue Giants",
"Lake of the Lost Marbles",
"Lake Purity",
"Oasis Pool",
"Pearlsian Gulf",
"Rimstone Pool",
"Sulfur Pool",
"Sump",
"Epsom Salts",
"Glacier Bay",
"Acid Lake Basin",
"Bitter Water Pool"
];

var cavern_formation_unique = [
"The Leaning Tower",
"The Marble Temple",
"Wizard's Staff",
"The Giant's Coffin",
"Emperor's Throne"
];

var cavern_pit_unique = [
"The Commode",
"Blowholes",
"Dragon Pit",
"Dry Cistern",
"Esophagus",
"Lava Tube",
"Shower Shaft",
"Slippery Chimney",
"The Chimneys",
"Vent Shaft",
"Well Cave",
];

var cavern_unique = [
cavern_pit_unique,
cavern_formation_unique,
cavern_water_unique,
cavern_room_unique
];



/*	////////////////////////////////////////////////////////////////////////////////

    --------------------------------------------------------------------------------
	
	DUNGEON
	================================================================================ */
/*	
var dungeon_possessive = [
"Minstrel",
"Halfling",
"Dead Man",
"Troll",
"Servant",
"Maid",
"Lord",
"Guardian",
"Giant",
"Dragon",
"Cook",
"Archer"
];
*/
var dungeon_materials = [
"Teak",
"Cedar",
"Red Marble",
"Sand",
"Steam",
"Moss",
"Lava",
"Ice",
"Granite",
"Geode",
"Dust",
"Coal",
"Amber"
];

var dungeon_objects = [
"Well",
"Hot Spring",
"Mud Pit",
"Vaulted Skylight",
"Sparkling Stone",
"Boiler",
"Spyhole",
"Pit",
"Rat",
"Antler",
"Winch",
"Weapon",
"Waterfall",
"Sword",
"Valve",
"Trophy",
"Treasure",
"Trap",
"Torch",
"Time Machine",
"Throne",
"Slippery Floor",
"Rope",
"Crowned Skull",
"Refuse",
"Quicksand",
"Pump",
"Provisions",
"Pottery",
"Moat",
"Lodestone",
"Ladder",
"Junk",
"Black Helm",
"Garbage",
"Crossbow",
"Fountain",
"Cube",
"Compass Rose",
"Cobweb",
"Stone Head",
"Barrel",
"Ballistae",
"Arsenal",
"Water Clock"
];

var dungeon_adjective = [
"Sewage",
"Sundered",
"Greased",
"Muttering",
"Unfinished",
"Training",
"Toll",
"Timber",
"Theives",
"Secret",
"Rubble-Filled",
"Round",
"Rough Hewn",
"Polished",
"Partially Collapsed",
"Padlocked",
"Mud-Filled",
"Mouning",
"Opulent",
"Odd-Angled",
"Misty",
"Meeting",
"Maintenance",
"Loud",
"Locked",
"Littered",
"Jumbled",
"Inky",
"Echo",
"Guard",
"Grim",
"Grand",
"Forsaken",
"Forgotten",
"Foggy",
"Flooding",
"Empty",
"Earth-floored",
"Dusty and Moldy",
"Dusty",
"Moldy",
"Drainage",
"Deserted",
"Damp",
"Cool",
"Common",
"Collapsed",
"Bricked Up",
"Boarded Up",
"Bloodstained",
"Barred",
"Banquet",
"Audience",
"Arched"
];
/*
var dungeon_abstract = [
"Merriment",
"Echoes"
];
*/
var dungeon_special_rooms = [
"Oubliette",
"Maze",
"Cove",
"Cistern",
"Smithy",
"Forge",
"Wellroom",
"Storeroom",
"Ballroom",
"Bedchamber",
"Compartment",
"Prison",
"Pantry",
"Nusery",
"Elevator",
"Arena",
"Armory",
"Kennels",
"Niche",
"Dormitory",
"Recess",
"Scullery (Dish Washing Room)",
"Latrine",
"Kitchen",
"Coliseum",
"Cellar",
"Cesspool",
"Closet",
"Barracks",
"Barroom",
"Bank",
"Aquaduct",
"Snuggery"
];

var dungeon_unique = [
"Tight Squeeze",
"Vent Shaft",
"Swill Pit",
"Mine Shaft",
"Tool Shed",
"Strong Room",
"Boat Dock (Row Boat)",
"Slippery Slide",
"Shooting Gallery",
"Dressing Room",
"Dining Room",
"Living Room",
"Root Cellar",
"Nusery Room",
"Gas Chamber",
"Food Storage",
"Fuel Storage",
"Oaken Cabinet",
"Bridal Chamber",
"Firing Range",
"Linen Closet",
"Harem/Seraglio",
"Underground Bridge"
];



/*	////////////////////////////////////////////////////////////////////////////////

    --------------------------------------------------------------------------------
	
	DUNGEON BRIDGE
	================================================================================ */

var dungeon_bridge_adjective = [
"Collapsing",
"Rope",
"Rotting",
"Stone"
];

/*	////////////////////////////////////////////////////////////////////////////////

    --------------------------------------------------------------------------------
	
	DUNGEON CORRIDOR
	================================================================================ */

var dungeon_corridor_adjective = [
"Blocked",
"Cobweb",
"Collapsed",
"Crooked",
"Flooded",
"Junction",
"Plain",
"Round",
"Royal",
"Trapped",
"Verdigris"
];

/*	////////////////////////////////////////////////////////////////////////////////

    --------------------------------------------------------------------------------
	
	DUNGEON PORTAL
	================================================================================ */

var dungeon_portal_adjective = [
"Great Iron",
"Heavy Barred",
"Reinforced",
"Secret",
"One-way",
"Metal",
"Stone",
"Circular",
"False",
"Double",
"Revolving"
];

var cavern_portal_special_rooms = [
"Keyhole"
];

/*	////////////////////////////////////////////////////////////////////////////////

    --------------------------------------------------------------------------------
	
	DUNGEON STAIRWAY
	================================================================================ */

var dungeon_stairway_adjective = [
"Main",
"Marble",
"Moving",
"Ruined",
"Sinister",
"Trapped"
];

/*	////////////////////////////////////////////////////////////////////////////////

    --------------------------------------------------------------------------------
	
	DUNGEON PIT
	================================================================================ */

var dungeon_pit_adjective = [
"Circular",
"Drainage",
"Locking",
"Flooding",
"Spiked",
"Spear",
"Poison Spike",
"Teleporting",
"Crossbow",
"Slime",
"Gas",
"Water Filled",
"Acid",
"Sulfur",
"Rat",
"Snake"
];

/*	////////////////////////////////////////////////////////////////////////////////

    --------------------------------------------------------------------------------
	
	MAGICAL
	================================================================================ */

var magical_unique = [
"Underground Garden",
"Treasure Vault",
"Wind Tunnel",
"Storage Space",
"Scenic Vista",
"Fish Tank",
"Echo Chamber",
"Game Room",
"Display Room",
"Control Room",
"Cloak Room",
"Classroom",
"Card Room",
"Beam Room",
"Council Chamber",
"Curtain of Beads",
"Art Studio"
];

var magical_materials = [
"Jade",
"Glass",
"Crystal",
"Marble and Gold",
"Mist",
"Mithril"
];

var magical_objects = [
"Floating Bones",
"Treasure",
"Fountain",
"Throne",
"Tea",
"Star",
"Sphere",
"Scroll",
"Spell",
"Rosette",
"Green Glow",
"Deadly Marble",
"Red Carpet",
"Puzzle",
"Prism",
"Pillar",
"Pentacle",
"Pearl",
"Mushroom",
"Mosaic",
"Mirror",
"Menhir",
"Magic Mouth",
"Machine",
"Lantern",
"Key",
"Jewelry",
"Illusion",
"Mirror",
"Floating Hat",
"Grim Statue",
"Gem",
"Gargoyle",
"Talking Painting",
"Shield",
"Painting",
"Living Sculpture",
"Fungus",
"Fresco",
"Engraving",
"Echo",
"Egg",
"Dome",
"Pedestal",
"Compass",
"Collection",
"Clock",
"Cloak",
"Talking Skull",
"Floating Corpse",
"Dancing Swords",
"Sword",
"Potion",
"Portal",
"Pool",
"Map",
"Lever",
"Floating Skull",
"Eye",
"Chest",
"Cauldron",
"Balloon",
"Cage",
"Artifact",
"Armor",
"Abacus",
"Floating Candles",
"Guardian"
];

var magical_adjective = [
"Wondrous",
"Weird",
"Viewing",
"Tiny",
"Terraced",
"Teleportation",
"Sunken",
"Summoning",
"Striated",
"Storage",
"Stasis",
"Spinning",
"Smoking",
"Secret",
"Scrying",
"Reflecting",
"Radiation",
"Pleasure",
"Pearlescent",
"Opulent",
"Luxurious",
"Locked",
"Lavish",
"Inner",
"Elemental",
"Domed",
"Conjuring",
"Carousel",
"Billiards",
"Purple",
"Muraled",
"Glowing"
];
/*
var magical_abstract = [
"Distortion",
"Eternal Returns"
];
*/
/*
var magical_possessive = [
"Wizard",
"Sorceror",
"Apprentice",
"Alchemist",
"Advisor"
];
*/
var magical_special_rooms = [
"Salon",
"Registary",
"Privy",
"Planetarium",
"Museum",
"Menagerie",
"Lounge",
"Librarium",
"Laboratory",
"Workroom",
"Sphere",
"Greenhouse",
"Cubicle",
"Closet",
"Gallery",
"Aviary",
"Atrium",
"Maze",
"Beastiary"
];


