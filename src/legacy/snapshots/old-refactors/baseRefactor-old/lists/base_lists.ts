import * as deityLists from './deity_lists'
import * as dungeonLists from './dungeon_rooms'
import * as miscLists from './misc_lists'

const allLists = { ...deityLists, ...dungeonLists, ...miscLists }

// CONSTRUCTION BASE

export const construction_fortification = [
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

export const construction_religious = [
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

export const construction_funerary = [
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

export const construction_artifact = [
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

export const construction_underground = [
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

export const construction_shelter = [
"Manor", 
"Palace", 
"Hall", 
"City", 
"Hive", 
"Ruin", 
"Library",
"Enclave"
];

export const construction_mechanical = [
"Observatory", 
"Windmill", 
"Aquaduct", 
"Lighthouse", 
"Foundry"
];

export const construction_security = [
"Prison", 
"Cage", 
"Vault", 
"Cache", 
"Treasury"
];

export const construction_misc = [
"Bridge", 
"Stairway", 
"Road",
"Crossing",
"Pass",
"Trail",
"Causeway",
"Landing"
];

export const construction_freshwater = [
"Well", 
"Cistern"//, 
//"Dam"
];


export const construction_city = [
"City"					 					 
];

export const construction_bridge = [
"Bridge",
"Drawbridge"
];
export const construction_tower = [
"Tower"					 					 
];

export const construction_tavern = [
"Inn",
"Tavern",
"Alehouse",
"Pub",
"Lodge"
];

export const construction = [	
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

export const dungeon_level = [
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

export const political_nation = [
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

export const political_district = [
"Ward",
"Quarter",
"District",
"Market"
];


export const dungeon_room_basic = [
"Room",
"Chamber",
"Antechamber",
"Niche",
"Cell",
"Mine",
"Vault"
];

export const dungeon_room_misc = [
"Gallery"
];

export const dungeon_room_construction = [
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

export const dungeon_room_stairs = [
"Staircase",
"Stairway",
"Ladder",
"Spiral Staircase",
"Stairs",
"Escalator"
];

export const dungeon_room_pit = [
"Pit",
"Shaft",
"Culvert",
"Pipe",
"Tube"
];

export const dungeon_room_corridor = [
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

export const dungeon_room_funerary = [ 
"Mausoleum", 
"Grave", 
"Crypt", 
"Tomb",  
"Barrow", 
"Catacombs",
"Ossuary"
];

export const cavern_room_basic = [
"Grotto", 
"Sinkhole", 
"Cavern", 
"Cave",
"Hole",
"Chasm",
"Crevasse",
"Fissure"
];

export const dungeon_room_portal = [
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

export const dungeon_room_feature = [
"Pillar",
"Throne",
"Elevator"
];

export const dungeon_room = [
  dungeon_room_basic,
  dungeon_room_misc,
  dungeon_room_stairs,
  dungeon_room_pit,
  dungeon_room_corridor,
  dungeon_room_construction,
  dungeon_room_funerary,
  dungeon_room_portal,
  dungeon_room_feature,
	allLists.dungeon_special_rooms
];

export const tomb_room = [
dungeon_room_funerary
];

export const temple_room = [
dungeon_room_basic,
dungeon_room_misc,
dungeon_room_stairs,
dungeon_room_pit,
dungeon_room_corridor,
dungeon_room_construction,
dungeon_room_funerary,
dungeon_room_portal,
dungeon_room_feature,
allLists.temple_special_rooms
];

export const cavern_room = [
allLists.cavern_special_rooms,
allLists.cavern_water_special_rooms,
allLists.cavern_portal_special_rooms
];

export const magical_room = [
dungeon_room_basic,
dungeon_room_misc,
dungeon_room_stairs,
dungeon_room_pit,
dungeon_room_corridor,
dungeon_room_construction,
dungeon_room_portal,
dungeon_room_feature,
allLists.magical_special_rooms
];

// NATURAL BASE
	
export const natural_misc = [
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

export const natural_saltwater = [
"Sea", 
"Reef", 
"Bay", 
"Ocean", 
"Whirlpool"
];

export const natural_woodlands = [
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

export const natural_marshes = [
"Swamp", 
"Jungle", 
"Bog", 
"Marsh", 
"Quagmire", 
"Mire", 
"Fen",
"Rot"
];

export const natural_underground = [
"Grotto", 
"Sinkhole", 
"Cavern", 
"Cave",
"Hole"
];

export const natural_depression = [
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

export const natural_freshwater = [
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

export const natural_highlands = [
"Mesa", 
"Spire", 
"Summit", 
"Plateau", 
"Peak", 
"Pinnacle", 
"Mountains"
];


// export const natural = [	
// natural_woodlands, 
// natural_marshes, 
// natural_underground, 
// natural_depression, 
// natural_freshwater, 
// natural_highlands, 
// natural_misc,
// natural_saltwater
// ];

export const natural_stone = [
"Rock",
"Stone",
"Monolith"
];



export const natural_mountain = [
"Mountains"
];

export const natural_river = [
"River"
];

export const natural_hills = [
"Hills"
];

export const natural_desert = [
"Desert"
];

export const natural = [	
  natural_woodlands, 
  natural_marshes, 
  natural_underground, 
  natural_depression, 
  natural_freshwater, 
  natural_highlands, 
  natural_misc,
  natural_saltwater,
  natural_stone,
  natural_mountain,
  natural_river,
  natural_hills,
  natural_desert,
];

export const base = [	
  construction, 
  natural
];

export const all = [
  ...construction,
  ...dungeon_room,
  ...cavern_room,
  ...natural,
  construction,
  dungeon_level,
  dungeon_room,
  political_nation,
  political_district,
  tomb_room,
  temple_room,
  cavern_room,
  magical_room,
  natural
];
