/*	////////////////////////////////////////////////////////////////////////////////

    --------------------------------------------------------------------------------
	
	CONSTRUCTION BASE
	================================================================================ */

var construction_fortification = [
"Castle", 
"Citadel", 
"Fortress", 
"Stronghold", 
"Tower", 
"Trench", 
"Outpost", 
"Encampment", 
"Minefield", 
"Keep", 
"Gate", 
"Wall", 
"Barrier",
"Hold"
];

var construction_religious = [
"Monastary", 
"Temple", 
"Shrine", 
"Sanctuary", 
"Reliquary", 
"Abbey", 
"Cathedral", 
"Prayer Wheel", 
"Alter", 
"Ziggarut",
"Sanctum"
];

var construction_funerary = [
"Morgue", 
"Mortuary", 
"Mausoleum", 
"Graveyard", 
"Crypt", 
"Tomb", 
"Mound", 
"Barrow", 
"Pyramid",
"Catacombs",
"Ossuary"
];

var construction_artifact = [
"Obelisk", 
"Statue", 
"Tome", 
"Monolith", 
"Guardian", 
"Forge", 
"Bubble", 
"Cube", 
"Helix", 
"Dome", 
"Vortex", 
"Spiral", 
"Totem", 
"Apparatus", 
"Furnace", 
"Circle", 
"Stele", 
"Tablet", 
"Visage", 
"Arch", 
"Sphere", 
"Box", 
"Puzzle", 
"Cauldron", 
"Fountain", 
"Grid", 
"Matrix", 
"Orb", 
"Shard", 
"Piller", 
"Relic", 
"Anvil", 
"Throne"
];

var construction_underground = [
"Burrow", 
"Dungeon", 
"Tunnel", 
"Catacombs", 
"Sewer", 
"Mine", 
"Pit", 
"Maze",
"Excavation",
"Nest",
"Lair",
"Den",
"Vault",
"Warren",
"Cellar"
];

var construction_shelter = [
"Manor", 
"Palace", 
"Hall", 
"City", 
"Hive", 
"Ruin", 
"Library",
"Enclave"
];

var construction_mechanical = [
"Observatory", 
"Windmill", 
"Aquaduct", 
"Lighthouse", 
"Foundry"
];

var construction_security = [
"Prison", 
"Cage", 
"Vault", 
"Cache", 
"Treasury"
];

var construction_misc = [
"Bridge", 
"Stairway", 
"Road",
"Crossing",
"Pass",
"Trail",
"Causeway",
"Landing"
];

var construction_freshwater = [
"Well", 
"Cistern"//, 
//"Dam"
];


var construction_city = [
"City"					 					 
];

var construction_bridge = [
"Bridge",
"Drawbridge"
];
var construction_tower = [
"Tower"					 					 
];

var construction_tavern = [
"Inn",
"Tavern",
"Alehouse",
"Pub",
"Lodge"
];

var construction = [	
construction_fortification, 
construction_religious, 
construction_funerary, 
construction_artifact, 
construction_underground, 
construction_shelter, 
construction_mechanical, 
construction_security, 
construction_misc, 
construction_freshwater,
construction_city,
construction_bridge,
construction_tower,
construction_tavern
];

var dungeon_level = [
"Eye",
"Atrium",
"Promenade",
"Core",
"Balcony",
"Cauldron",
"Garden",
"Pavillion",
"Arena",
"Foundry",
"Grid",
"Cube",
"Kitchens",
"Underground Lake",
"Underground Forest",
"Underground City",
"Gallery",
"Collection",
"Underground Garden",
"Maze",
"Labyrinth",
"Warrens",
"Barracks",
"Libraries",
"Catacombs",
"Sewers",
"Chasm",
"Prisons",
"Asylum",
"Mines",
"Caverns",
"Tunnels",
"Laboratories",
"Museum",
"Baths",
"Wreckage",
"Hideout",
"Treasury",
"Vaults",
"Underground Citadel",
"Cemetery",
"Tombs",
"Crypts",
"Temple",
"Ruins",
"Storerooms",
"Theater",
"Markets",
"Halls",
"Workshop",
"Gauntlet",
"Fissure",
"Lair",
"Fane",
"Reaches",
"Slave Pits",
"Enclave"
];

var political_nation = [
"Realm",
"Theocracy",
"Kingdom",
"Empire",
"Alliance",
"Duchy",
"Principality",
"Guild",
"Marches",
"Grand Duchy",
"Collective",
"Confederacy",
"Baronry",
"Colony",
"Federation",
"County",
"Dominion",
"Territory",
"Watch",
"Hold",
"Province",
"Union",
"League"
];

var political_district = [
"Ward",
"Quarter",
"District",
"Market"
];


var dungeon_room_basic = [
"Room",
"Chamber",
"Antechamber",
"Niche",
"Cell",
"Mine",
"Vault"
];

var dungeon_room_misc = [
"Gallery"
];

var dungeon_room_construction = [
"Burrow",  
"Tunnel", 
"Catacombs", 
"Sewer", 
"Mine", 
"Maze",
"Excavation",
"Nest",
"Lair",
"Den",
"Vault",
"Warren",
"Cellar",
"Labyrinth"
];

var dungeon_room_stairs = [
"Staircase",
"Stairway",
"Ladder",
"Spiral Staircase",
"Stairs",
"Escalator"
];

var dungeon_room_pit = [
"Pit",
"Shaft",
"Culvert",
"Pipe",
"Tube"
];

var dungeon_room_corridor = [
"Corridor",
"Hallway",
"Tunnel",
"Avenue",
"Passage",
"Serviceway",
"Crawlway",
"Catwalk",
"Hall"
];

var dungeon_room_funerary = [ 
"Mausoleum", 
"Grave", 
"Crypt", 
"Tomb",  
"Barrow", 
"Catacombs",
"Ossuary"
];

var cavern_room_basic = [
"Grotto", 
"Sinkhole", 
"Cavern", 
"Cave",
"Hole",
"Chasm",
"Crevasse",
"Fissure"
];

var dungeon_room_portal = [
"Doorway",
"Door",
"Portal",
"Gate",
"Hatch",
"Archway",
"Curtain",
"Hatchway",
"Valves"
];

var dungeon_room_feature = [
"Pillar",
"Throne",
"Elevator"
];

var dungeon_room = [
dungeon_room_basic,
dungeon_room_misc,
dungeon_room_stairs,
dungeon_room_pit,
dungeon_room_corridor,
dungeon_room_construction,
dungeon_room_funerary,
dungeon_room_portal,
dungeon_room_feature,
	dungeon_special_rooms
];

var tomb_room = [
dungeon_room_funerary
];

var temple_room = [
dungeon_room_basic,
dungeon_room_misc,
dungeon_room_stairs,
dungeon_room_pit,
dungeon_room_corridor,
dungeon_room_construction,
dungeon_room_funerary,
dungeon_room_portal,
dungeon_room_feature,
	temple_special_rooms
];

var cavern_room = [
cavern_special_rooms,
cavern_water_special_rooms,
cavern_portal_special_rooms
];

var magical_room = [
dungeon_room_basic,
dungeon_room_misc,
dungeon_room_stairs,
dungeon_room_pit,
dungeon_room_corridor,
dungeon_room_construction,
dungeon_room_portal,
dungeon_room_feature,
	magical_special_rooms
];

/*	////////////////////////////////////////////////////////////////////////////////

    --------------------------------------------------------------------------------
	
	NATURAL BASE
	================================================================================ */
	
var natural_misc = [
"Barrens", 
"Wastes", 
"Desert", 
"Hills", 
"Island", 
"Stone", 
"Rock", 
"Tundra", 
"Moor", 
"Plains", 
"Dunes", 
"Volcano", 
"Glacier",
"Blight"
];

var natural_saltwater = [
"Sea", 
"Reef", 
"Bay", 
"Ocean", 
"Whirlpool"
];

var natural_woodlands = [
"Glade", 
"Grove", 
"Meadow", 
"Thicket", 
"Briar", 
"Woods", 
"Forest", 
"Garden", 
"Tree"
];

var natural_marshes = [
"Swamp", 
"Jungle", 
"Bog", 
"Marsh", 
"Quagmire", 
"Mire", 
"Fen",
"Rot"
];

var natural_underground = [
"Grotto", 
"Sinkhole", 
"Cavern", 
"Cave",
"Hole"
];

var natural_depression = [
"Chasm", 
"Fault", 
"Ravine", 
"Rift", 
"Gully", 
"Gorge", 
"Canyon", 
"Fissure", 
"Crater", 
"Cliff", 
"Valley"
];

var natural_freshwater = [
"River", 
"Spring", 
"Falls", 
"Creek", 
"Stream", 
"Geyser", 
"Pool", 
"Lake", 
"Pond", 
"Puddle", 
"Basin",
"Kettle"
];

var natural_highlands = [
"Mesa", 
"Spire", 
"Summit", 
"Plateau", 
"Peak", 
"Pinnacle", 
"Mountains"
];


var natural = [	
natural_woodlands, 
natural_marshes, 
natural_underground, 
natural_depression, 
natural_freshwater, 
natural_highlands, 
natural_misc,
natural_saltwater
];

var natural_stone = [
"Rock",
"Stone",
"Monolith"
];



var natural_mountain = [
"Mountains"
];

var natural_river = [
"River"
];

var natural_hills = [
"Hills"
];

var natural_desert = [
"Desert"
];

var base = [	
construction, 
natural
];
