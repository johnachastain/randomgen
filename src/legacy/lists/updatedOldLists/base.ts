// CONSTRUCTION BASE

export enum Tags {
    Construction = 'construction',
    Fortification = 'fortification',
    Religious = 'religious',
    Funerary = 'funerary',
    Artifact = 'artifact',
    Underground = 'underground',
    Shelter = 'shelter',
    Mechanical = 'mechanical',
    Security = 'security',
    Tavern = 'tavern',
    Dungeon = 'dungeon',
    Level = 'level'
}

const {
    Construction,
    Fortification,
    Religious,
    Funerary,
    Artifact,
    Underground,
    Shelter,
    Mechanical,
    Security,
    Tavern,
    Dungeon,
    Level
} = Tags

export const construction_fortification = [
    ['Castle', [Construction, Fortification], 1],
    ['Citadel', [Construction, Fortification], 1],
    ['Fortress', [Construction, Fortification], 1],
    ['Stronghold', [Construction, Fortification], 1],
    ['Tower', [Construction, Fortification], 1],
    ['Trench', [Construction, Fortification], 1],
    ['Outpost', [Construction, Fortification], 1],
    ['Encampment', [Construction, Fortification], 1],
    ['Minefield', [Construction, Fortification], 1],
    ['Keep', [Construction, Fortification], 1],
    ['Gate', [Construction, Fortification], 1],
    ['Wall', [Construction, Fortification], 1],
    ['Barrier', [Construction, Fortification], 1],
    ['Hold', [Construction, Fortification], 1],
];

export const construction_religious = [
    ['Monastery', [Construction, Religious], 1],
    ['Temple', [Construction, Religious], 1],
    ['Shrine', [Construction, Religious], 1],
    ['Sanctuary', [Construction, Religious], 1],
    ['Reliquary', [Construction, Religious], 1],
    ['Abbey', [Construction, Religious], 1],
    ['Cathedral', [Construction, Religious], 1],
    ['Prayer Wheel', [Construction, Religious], 1],
    ['Alter', [Construction, Religious], 1],
    ['Ziggarut', [Construction, Religious], 1],
    ['Sanctum', [Construction, Religious], 1],
];

export const construction_funerary = [
    ['Morgue', [Construction, Funerary], 1],
    ['Mortuary', [Construction, Funerary], 1],
    ['Mausoleum', [Construction, Funerary], 1],
    ['Graveyard', [Construction, Funerary], 1],
    ['Crypt', [Construction, Funerary], 1],
    ['Tomb', [Construction, Funerary], 1],
    ['Mound', [Construction, Funerary], 1],
    ['Barrow', [Construction, Funerary], 1],
    ['Pyramid', [Construction, Funerary], 1],
    ['Catacombs', [Construction, Funerary], 1],
    ['Ossuary', [Construction, Funerary], 1],
];

export const construction_artifact = [
    ['Obelisk', [Construction, Artifact], 1],
    ['Statue', [Construction, Artifact], 1],
    ['Tome', [Construction, Artifact], 1],
    ['Monolith', [Construction, Artifact], 1],
    ['Guardian', [Construction, Artifact], 1],
    ['Forge', [Construction, Artifact], 1],
    ['Bubble', [Construction, Artifact], 1],
    ['Cube', [Construction, Artifact], 1],
    ['Helix', [Construction, Artifact], 1],
    ['Dome', [Construction, Artifact], 1],
    ['Vortex', [Construction, Artifact], 1],
    ['Spiral', [Construction, Artifact], 1],
    ['Totem', [Construction, Artifact], 1],
    ['Apparatus', [Construction, Artifact], 1],
    ['Furnace', [Construction, Artifact], 1],
    ['Circle', [Construction, Artifact], 1],
    ['Stele', [Construction, Artifact], 1],
    ['Tablet', [Construction, Artifact], 1],
    ['Visage', [Construction, Artifact], 1],
    ['Arch', [Construction, Artifact], 1],
    ['Sphere', [Construction, Artifact], 1],
    ['Box', [Construction, Artifact], 1],
    ['Puzzle', [Construction, Artifact], 1],
    ['Cauldron', [Construction, Artifact], 1],
    ['Fountain', [Construction, Artifact], 1],
    ['Grid', [Construction, Artifact], 1],
    ['Matrix', [Construction, Artifact], 1],
    ['Orb', [Construction, Artifact], 1],
    ['Shard', [Construction, Artifact], 1],
    ['Piller', [Construction, Artifact], 1],
    ['Relic', [Construction, Artifact], 1],
    ['Anvil', [Construction, Artifact], 1],
    ['Throne', [Construction, Artifact], 1],
];

export const construction_underground = [
    ['Burrow', [Construction, Underground], 1],
    ['Dungeon', [Construction, Underground], 1],
    ['Tunnel', [Construction, Underground], 1],
    ['Catacombs', [Construction, Underground], 1],
    ['Sewer', [Construction, Underground], 1],
    ['Mine', [Construction, Underground], 1],
    ['Pit', [Construction, Underground], 1],
    ['Maze', [Construction, Underground], 1],
    ['Excavation', [Construction, Underground], 1],
    ['Nest', [Construction, Underground], 1],
    ['Lair', [Construction, Underground], 1],
    ['Den', [Construction, Underground], 1],
    ['Vault', [Construction, Underground], 1],
    ['Warren', [Construction, Underground], 1],
    ['Cellar', [Construction, Underground], 1],
];

export const construction_shelter = [
    ['Manor', [Construction, Shelter], 1],
    ['Palace', [Construction, Shelter], 1],
    ['Hall', [Construction, Shelter], 1],
    ['City', [Construction, Shelter], 1],
    ['Hive', [Construction, Shelter], 1],
    ['Ruin', [Construction, Shelter], 1],
    ['Library', [Construction, Shelter], 1],
    ['Enclave', [Construction, Shelter], 1],
];

export const construction_mechanical = [
    ['Observatory', [Construction, Mechanical], 1],
    ['Windmill', [Construction, Mechanical], 1],
    ['Aqueduct', [Construction, Mechanical], 1],
    ['Lighthouse', [Construction, Mechanical], 1],
    ['Foundry', [Construction, Mechanical], 1],
];

export const construction_security = [
    ['Prison', [Construction, Security], 1],
    ['Cage', [Construction, Security], 1],
    ['Vault', [Construction, Security], 1],
    ['Cache', [Construction, Security], 1],
    ['Treasury', [Construction, Security], 1],
];

export const construction_misc = [
    ['Bridge', [Construction], 1],
    ['Stairway', [Construction], 1],
    ['Road', [Construction], 1],
    ['Crossing', [Construction], 1],
    ['Pass', [Construction], 1],
    ['Trail', [Construction], 1],
    ['Causeway', [Construction], 1],
    ['Landing', [Construction], 1],
];


export const construction_tavern = [
    ['Inn', [Construction, Tavern], 1],
    ['Tavern', [Construction, Tavern], 1],
    ['Alehouse', [Construction, Tavern], 1],
    ['Pub', [Construction, Tavern], 1],
    ['Lodge', [Construction, Tavern], 1],
];


export const dungeon_level = [
    ['Eye', [Dungeon, Level], 1],
    ['Atrium', [Dungeon, Level], 1],
    ['Promenade', [Dungeon, Level], 1],
    ['Core', [Dungeon, Level], 1],
    ['Balcony', [Dungeon, Level], 1],
    ['Cauldron', [Dungeon, Level], 1],
    ['Garden', [Dungeon, Level], 1],
    ['Pavilion', [Dungeon, Level], 1],
    ['Arena', [Dungeon, Level], 1],
    ['Foundry', [Dungeon, Level], 1],
    ['Grid', [Dungeon, Level], 1],
    ['Cube', [Dungeon, Level], 1],
    ['Kitchens', [Dungeon, Level], 1],
    ['Underground Lake', [Dungeon, Level], 1],
    ['Underground Forest', [Dungeon, Level], 1],
    ['Underground City', [Dungeon, Level], 1],
    ['Gallery', [Dungeon, Level], 1],
    ['Collection', [Dungeon, Level], 1],
    ['Underground Garden', [Dungeon, Level], 1],
    ['Maze', [Dungeon, Level], 1],
    ['Labyrinth', [Dungeon, Level], 1],
    ['Warrens', [Dungeon, Level], 1],
    ['Barracks', [Dungeon, Level], 1],
    ['Libraries', [Dungeon, Level], 1],
    ['Catacombs', [Dungeon, Level], 1],
    ['Sewers', [Dungeon, Level], 1],
    ['Chasm', [Dungeon, Level], 1],
    ['Prisons', [Dungeon, Level], 1],
    ['Asylum', [Dungeon, Level], 1],
    ['Mines', [Dungeon, Level], 1],
    ['Caverns', [Dungeon, Level], 1],
    ['Tunnels', [Dungeon, Level], 1],
    ['Laboratories', [Dungeon, Level], 1],
    ['Museum', [Dungeon, Level], 1],
    ['Baths', [Dungeon, Level], 1],
    ['Wreckage', [Dungeon, Level], 1],
    ['Hideout', [Dungeon, Level], 1],
    ['Treasury', [Dungeon, Level], 1],
    ['Vaults', [Dungeon, Level], 1],
    ['Underground Citadel', [Dungeon, Level], 1],
    ['Cemetery', [Dungeon, Level], 1],
    ['Tombs', [Dungeon, Level], 1],
    ['Crypts', [Dungeon, Level], 1],
    ['Temple', [Dungeon, Level], 1],
    ['Ruins', [Dungeon, Level], 1],
    ['Storerooms', [Dungeon, Level], 1],
    ['Theater', [Dungeon, Level], 1],
    ['Markets', [Dungeon, Level], 1],
    ['Halls', [Dungeon, Level], 1],
    ['Workshop', [Dungeon, Level], 1],
    ['Gauntlet', [Dungeon, Level], 1],
    ['Fissure', [Dungeon, Level], 1],
    ['Lair', [Dungeon, Level], 1],
    ['Fane', [Dungeon, Level], 1],
    ['Reaches', [Dungeon, Level], 1],
    ['Slave Pits', [Dungeon, Level], 1],
    ['Enclave', [Dungeon, Level], 1],
];

export const political_nation = [
    ['Realm', [], 1],
    ['Theocracy', [], 1],
    ['Kingdom', [], 1],
    ['Empire', [], 1],
    ['Alliance', [], 1],
    ['Duchy', [], 1],
    ['Principality', [], 1],
    ['Guild', [], 1],
    ['Marches', [], 1],
    ['Grand Duchy', [], 1],
    ['Collective', [], 1],
    ['Confederacy', [], 1],
    ['Baronry', [], 1],
    ['Colony', [], 1],
    ['Federation', [], 1],
    ['County', [], 1],
    ['Dominion', [], 1],
    ['Territory', [], 1],
    ['Watch', [], 1],
    ['Hold', [], 1],
    ['Province', [], 1],
    ['Union', [], 1],
    ['League', [], 1],
];

export const political_district = [
    ['Ward', [], 1],
    ['Quarter', [], 1],
    ['District', [], 1],
    ['Market', [], 1],
];


export const dungeon_room_basic = [
    ['Room', [], 1],
    ['Chamber', [], 1],
    ['Antechamber', [], 1],
    ['Niche', [], 1],
    ['Cell', [], 1],
    ['Mine', [], 1],
    ['Vault', [], 1],
];

export const dungeon_room_misc = [
    ['Gallery', [], 1],
];

export const dungeon_room_construction = [
    ['Burrow', [], 1],
    ['Tunnel', [], 1],
    ['Catacombs', [], 1],
    ['Sewer', [], 1],
    ['Mine', [], 1],
    ['Maze', [], 1],
    ['Excavation', [], 1],
    ['Nest', [], 1],
    ['Lair', [], 1],
    ['Den', [], 1],
    ['Vault', [], 1],
    ['Warren', [], 1],
    ['Cellar', [], 1],
    ['Labyrinth', [], 1],
];

export const dungeon_room_stairs = [
    ['Staircase', [], 1],
    ['Stairway', [], 1],
    ['Ladder', [], 1],
    ['Spiral Staircase', [], 1],
    ['Stairs', [], 1],
    ['Escalator', [], 1],
];

export const dungeon_room_pit = [
    ['Pit', [], 1],
    ['Shaft', [], 1],
    ['Culvert', [], 1],
    ['Pipe', [], 1],
    ['Tube', [], 1],
];

export const dungeon_room_corridor = [
    ['Corridor', [], 1],
    ['Hallway', [], 1],
    ['Tunnel', [], 1],
    ['Avenue', [], 1],
    ['Passage', [], 1],
    ['Serviceway', [], 1],
    ['Crawlway', [], 1],
    ['Catwalk', [], 1],
    ['Hall', [], 1],
];

export const dungeon_room_funerary = [
    ['Mausoleum', [], 1],
    ['Grave', [], 1],
    ['Crypt', [], 1],
    ['Tomb', [], 1],
    ['Barrow', [], 1],
    ['Catacombs', [], 1],
    ['Ossuary', [], 1],
];

export const cavern_room_basic = [
    ['Grotto', [], 1],
    ['Sinkhole', [], 1],
    ['Cavern', [], 1],
    ['Cave', [], 1],
    ['Hole', [], 1],
    ['Chasm', [], 1],
    ['Crevasse', [], 1],
    ['Fissure', [], 1],
];

export const dungeon_room_portal = [
    ['Doorway', [], 1],
    ['Door', [], 1],
    ['Portal', [], 1],
    ['Gate', [], 1],
    ['Hatch', [], 1],
    ['Archway', [], 1],
    ['Curtain', [], 1],
    ['Hatchway', [], 1],
    ['Valves', [], 1],
];

export const dungeon_room_feature = [
    ['Pillar', [], 1],
    ['Throne', [], 1],
    ['Elevator', [], 1],
];

// NATURAL BASE

export const natural_misc = [
    ['Barrens', [], 1],
    ['Wastes', [], 1],
    ['Desert', [], 1],
    ['Hills', [], 1],
    ['Island', [], 1],
    ['Stone', [], 1],
    ['Rock', [], 1],
    ['Tundra', [], 1],
    ['Moor', [], 1],
    ['Plains', [], 1],
    ['Dunes', [], 1],
    ['Volcano', [], 1],
    ['Glacier', [], 1],
    ['Blight', [], 1],
];

export const natural_saltwater = [
    ['Sea', [], 1],
    ['Reef', [], 1],
    ['Bay', [], 1],
    ['Ocean', [], 1],
    ['Whirlpool', [], 1],
];

export const natural_woodlands = [
    ['Glade', [], 1],
    ['Grove', [], 1],
    ['Meadow', [], 1],
    ['Thicket', [], 1],
    ['Briar', [], 1],
    ['Woods', [], 1],
    ['Forest', [], 1],
    ['Garden', [], 1],
    ['Tree', [], 1],
];

export const natural_marshes = [
    ['Swamp', [], 1],
    ['Jungle', [], 1],
    ['Bog', [], 1],
    ['Marsh', [], 1],
    ['Quagmire', [], 1],
    ['Mire', [], 1],
    ['Fen', [], 1],
    ['Rot', [], 1],
];

export const natural_underground = [
    ['Grotto', [], 1],
    ['Sinkhole', [], 1],
    ['Cavern', [], 1],
    ['Cave', [], 1],
    ['Hole', [], 1],
];

export const natural_depression = [
    ['Chasm', [], 1],
    ['Fault', [], 1],
    ['Ravine', [], 1],
    ['Rift', [], 1],
    ['Gully', [], 1],
    ['Gorge', [], 1],
    ['Canyon', [], 1],
    ['Fissure', [], 1],
    ['Crater', [], 1],
    ['Cliff', [], 1],
    ['Valley', [], 1],
];

export const natural_freshwater = [
    ['River', [], 1],
    ['Spring', [], 1],
    ['Falls', [], 1],
    ['Creek', [], 1],
    ['Stream', [], 1],
    ['Geyser', [], 1],
    ['Pool', [], 1],
    ['Lake', [], 1],
    ['Pond', [], 1],
    ['Puddle', [], 1],
    ['Basin', [], 1],
    ['Kettle', [], 1],
];

export const natural_highlands = [
    ['Mesa', [], 1],
    ['Spire', [], 1],
    ['Summit', [], 1],
    ['Plateau', [], 1],
    ['Peak', [], 1],
    ['Pinnacle', [], 1],
    ['Mountains', [], 1],
];


export const natural_stone = [
    ['Rock', [], 1],
    ['Stone', [], 1],
    ['Monolith', [], 1],
];

export const construction_freshwater = [
    ['Well', [], 1],
    ['Cistern', [], 1],
    //'Dam'
];


export const construction_city = [
    ['City', [], 1],
];

export const construction_bridge = [
    ['Bridge', [], 1],
    ['Drawbridge', [], 1],
];
export const construction_tower = [
    ['Tower', [], 1],
];

export const natural_mountain = [
    ['Mountains', [], 1],
];

export const natural_river = [
    ['River', [], 1],
];

export const natural_hills = [
    ['Hills', [], 1],
];

export const natural_desert = [
    ['Desert', [], 1],
];
